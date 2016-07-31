import htmlparser from 'htmlparser';
import entities from 'html-entities';
import ParagraphMaker from './ParagraphMaker';
import Paragraph from './Paragraph.js';

class Core {
  /**
   * Converts an HTML page into a list of classified paragraphs. Each paragraph
   * is represented as instance of class ˙˙justext.paragraph.Paragraph˙˙.
   **/
  jusText(htmlText, stoplist = [], lengthLow, lengthHigh, stopwordsLow,
    stopwordsHigh, maxLinkDensity, maxHeadingDistance, noHeadings) {
    const cleanHtml = this.preprocessor(htmlText, {
      head: true,
      footer: true,
      script: true,
      iframe: true,
      style: true,
      comment: true,
    });
    const htmlDocument = this.htmlToDom(cleanHtml);
    const maker = new ParagraphMaker();
    let paragraphs = maker.makeParagraphs(htmlDocument);
    paragraphs = this.classifyParagraphs(paragraphs, stoplist, lengthLow, lengthHigh,
      stopwordsLow, stopwordsHigh, maxLinkDensity, noHeadings);
    paragraphs = this.reviseParagraphClassification(paragraphs, maxHeadingDistance);

    return paragraphs;
  }

  /**
   * Context-free paragraph classification.
   **/
  classifyParagraphs(paragraphs = [Paragraph], stoplist = [], lengthLow,
    lengthHigh, stopwordsLow, stopwordsHigh, maxLinkDensity, maxHeadingDistance, noHeadings) {
    // use cache some string function
    const search = String.prototype.search;
    const indexOf = String.prototype.indexOf;
    const toLowerCase = String.prototype.toLowerCase;

    const stopList = stoplist.map(item => toLowerCase.call(item));
    const result = [];
    for (const paragraph of paragraphs) {
      const text = paragraph.text();
      const length = paragraph.len();
      const stopwordDesity = paragraph.stopwordDesity(stopList);
      const linksDesity = paragraph.linksDesity();
      paragraph.heading = !noHeadings && paragraph.isHeading();

      if (Number(linksDesity) > Number(maxLinkDensity)) {
        paragraph.cfClass = 'bad';
      } else if (indexOf.call(text, '\xa9') !== -1 || indexOf.call(this, '&copy') !== -1) {
        paragraph.cfClass = 'bad';
      } else if (search.call(paragraph.domPath, '^select|.select') !== -1) {
        paragraph.cfClass = 'bad';
      } else if (length < lengthLow) {
        if (paragraph.charsCountInLinks > 0) {
          paragraph.cfClass = 'bad';
        } else {
          paragraph.cfClass = 'short';
        }
      } else if (Number(stopwordDesity) >= Number(stopwordsHigh)) {
        if (Number(length) > Number(lengthHigh)) {
          paragraph.cfClass = 'good';
        } else {
          paragraph.cfClass = 'neargood';
        }
      } else if (Number(stopwordDesity) >= Number(stopwordsLow)) {
        paragraph.cfClass = 'neargood';
      } else {
        paragraph.cfClass = 'bad';
      }
      result.push(paragraph);
    }

    return result;
  }

  /**
   * Context-sensitive paragraph classification. Assumes that classify_pragraphs
   * has already been called.
   **/
  reviseParagraphClassification(paragraphs = [Paragraph],
    maxHeadingDistance) {
    const reviseParagraphs = [];
    // copy classes
    for (const paragraph of paragraphs) {
      paragraph.classType = paragraph.cfClass;
      reviseParagraphs.push(paragraph);
    }

    // good headings
    reviseParagraphs.forEach((paragraph, index) => {
      if (paragraph.isHeading() && paragraph.classType === 'short') {
        let counter = index + 1;
        let distance = 0;
        while (counter < reviseParagraphs.length && distance <= maxHeadingDistance) {
          if (reviseParagraphs[counter].classType === 'good') {
            reviseParagraphs[counter].classType = 'neargood';
            break;
          }
          distance += reviseParagraphs[counter].text().length;
          counter++;
        }
      }
    });

    // classify short
    const newClassType = [];
    reviseParagraphs.forEach((paragraph, index) => {
      if (paragraph.classType === 'short') {
        const prevNeighbour = this.getPrevNeighbour(index, reviseParagraphs, true);
        const nextNeighbour = this.getNextNeighbour(index, reviseParagraphs, true);
        const neighbours = [prevNeighbour];
        if (neighbours.indexOf(nextNeighbour) === -1) {
          neighbours.push(nextNeighbour);
        }

        if (neighbours.length === 1 && neighbours[0] === 'good') {
          newClassType[index] = 'good';
        } else if (neighbours.length === 1 && neighbours[0] === 'bad') {
          newClassType[index] = 'bad';
        } else if (
          (prevNeighbour === 'bad' &&
            this.getPrevNeighbour(index, reviseParagraphs, false) === 'neargood') ||
          (nextNeighbour === 'bad' &&
            this.getNextNeighbour(index, reviseParagraphs, false) === 'neargood')
        ) {
          newClassType[index] = 'good';
        } else {
          newClassType[index] = 'bad';
        }
      }
    });

    newClassType.forEach((classType, index) => {
      reviseParagraphs[index].classType = classType;
    });

    // revise neargood
    reviseParagraphs.forEach((paragraph, index) => {
      if (paragraph.classType === 'neargood') {
        const prevNeighbour = this.getPrevNeighbour(index, reviseParagraphs, true);
        const nextNeighbour = this.getNextNeighbour(index, reviseParagraphs, true);
        if (prevNeighbour === 'bad' && nextNeighbour === 'bad') {
          reviseParagraphs[index].classType = 'bad';
        } else {
          reviseParagraphs[index].classType = 'good';
        }
      }
    });

    // more good headings
    reviseParagraphs.forEach((paragraph, index) => {
      if (paragraph.isHeading() && paragraph.classType === 'bad' && paragraph.cfClass !== 'bad') {
        let counter = index + 1;
        let distance = 0;
        while (counter < reviseParagraphs.length && distance <= maxHeadingDistance) {
          if (reviseParagraphs[counter].classType === 'good') {
            reviseParagraphs[counter].classType = 'good';
            break;
          }
          distance += reviseParagraphs[counter].text().length;
          counter++;
        }
      }
    });
    return paragraphs;
  }

  /**
   * Convert html string to HTML Document
   * rawHtml: string
   **/
  htmlToDom(rawHtml) {
    // TODO: process encode for html string
    const htmlHandler = new htmlparser.DefaultHandler();
    const htmlParser = new htmlparser.Parser(htmlHandler);
    htmlParser.parseComplete(rawHtml);
    console.log('DOM', htmlHandler.dom);
    return htmlHandler.dom;
  }

  /**
   * Removes unwanted parts of HTML.
   * rawHtml: string
   **/
  preprocessor(rawHtml,
    options = {
      html: false,
      head: false,
      footer: false,
      script: true,
      iframe: true,
      style: true,
      comment: true,
    }) {
    // TODO: Process XML format
    // removes script section entirely
    const replace = String.prototype.replace;
    const htmlDecoding = new entities.AllHtmlEntities();
    let str = htmlDecoding.decode(rawHtml);
    if (options.script) {
      str = replace.call(str, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    }

    // removes iframe section entirely
    if (options.iframe) {
      str = replace.call(str, /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ' ');
    }

    // removes head section entirely
    if (options.head) {
      str = replace.call(str, /<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, ' ');
    }

    // removes footer section entirely
    if (options.footer) {
      str = replace.call(str, /<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
    }

    // removes style section entirely and inline style
    if (options.style) {
      str = replace.call(str, /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
      str = replace.call(str, /\s+style=["|'].*?["|']/gi, ' ');
      str = replace.call(str, /\s+class=["|'].*?["|']/gi, ' ');
    }

    // remove comment
    if (options.comment) {
      str = replace.call(str, /<!--[^>]*-->/gi, ' ');
    }

    // remove all remaining tags
    if (options.html) {
      str = replace.call(str,
        /<\/?[a-z]+(?:\s[a-z0-9]+(\s*=\s*('.*?'|".*?"|\d+))?)*[\s\/]*>/gm,
        ' ');
    }

    // replace more than one space with a single space
    str = replace.call(str, /\s{2,}/g, ' ');
    // remove space between tags
    str = replace.call(str, />\s</g, '><');
    // remove lead space
    str = replace.call(str, /^\s+/, '');
    // remove trailing space
    str = replace.call(str, /\s+$/, '');
    return str;
  }

  /**
   * Get neighbour class type of paragraphs
   * */
  getNeighbour(index, paragraphs, ignoreNearGood, inc, boundary) {
    let checkIndex = index;
    while (Number(checkIndex + inc) !== Number(boundary)) {
      checkIndex = Number(checkIndex + inc);
      const classType = paragraphs[checkIndex].classType;
      if (['good', 'bad'].indexOf(classType) !== -1) {
        return classType;
      }

      if (classType === 'neargood' && !ignoreNearGood) {
        return classType;
      }
    }

    return 'bad';
  }

  /**
   * Return the class of the paragraph at the top end of the short/neargood
   * paragraphs block. If ignore_neargood is True, than only 'bad' or 'good'
   * can be returned, otherwise 'neargood' can be returned, too.
   * */
  getPrevNeighbour(index, paragraphs, ignoreNearGood) {
    return this.getNeighbour(index, paragraphs, ignoreNearGood, -1, -1);
  }

  /**
   * Return the class of the paragraph at the bottom end of the short/neargood
   * paragraphs block. If ignore_neargood is True, than only 'bad' or 'good'
   * can be returned, otherwise 'neargood' can be returned, too.
   * */
  getNextNeighbour(index, paragraphs, ignoreNearGood) {
    return this.getNeighbour(index, paragraphs, ignoreNearGood, 1, paragraphs.length);
  }

}

export default Core;
