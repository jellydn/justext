import htmlparser from 'htmlparser';
import ParagraphMaker from './ParagraphMaker';
import Paragraph from './Paragraph.js';

const MAX_LINK_DENSITY_DEFAULT = 0.2;
const LENGTH_LOW_DEFAULT = 70;
const LENGTH_HIGH_DEFAULT = 200;
const STOPWORDS_LOW_DEFAULT = 0.30;
const STOPWORDS_HIGH_DEFAULT = 0.32;
const NO_HEADINGS_DEFAULT = false;
const MAX_HEADING_DISTANCE_DEFAULT = 200;
// const PARAGRAPH_TAGS = [
//   'body', 'blockquote', 'caption', 'center', 'col', 'colgroup', 'dd',
//   'div', 'dl', 'dt', 'fieldset', 'form', 'legend', 'optgroup', 'option',
//   'p', 'pre', 'table', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr',
//   'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
// ];
// const CHARSET_META_TAG_PATTERN = /<meta[^>]+charset=["']?([^'"/>\s]+)/i;

class Core {
  /**
   * Converts an HTML page into a list of classified paragraphs. Each paragraph
   * is represented as instance of class ˙˙justext.paragraph.Paragraph˙˙.
   **/
  jusText(htmlText, stoplist = [], lengthLow = LENGTH_LOW_DEFAULT,
    lengthHigh = LENGTH_HIGH_DEFAULT, stopwordsLow = STOPWORDS_LOW_DEFAULT,
    stopwordsHigh = STOPWORDS_HIGH_DEFAULT, maxLinkDensity = MAX_LINK_DENSITY_DEFAULT,
    maxHeadingDistance = MAX_HEADING_DISTANCE_DEFAULT, noHeadings = NO_HEADINGS_DEFAULT) {
    const cleanHtml = this.preprocessor(htmlText);
    const htmlDocument = this.htmlToDom(cleanHtml);
    let paragraphs = ParagraphMaker.makeParagraphs(htmlDocument);
    paragraphs = this.classifyParagraphs(paragraphs, stoplist, lengthLow, lengthHigh,
      stopwordsLow, stopwordsHigh, maxLinkDensity, noHeadings);
    paragraphs = this.reviseParagraphClassification(paragraphs, maxHeadingDistance);

    return paragraphs;
  }

  /**
   * Context-free paragraph classification.
   **/
  classifyParagraphs(paragraphs = [Paragraph], stoplist = [], lengthLow = LENGTH_LOW_DEFAULT,
    lengthHigh = LENGTH_HIGH_DEFAULT, stopwordsLow = STOPWORDS_LOW_DEFAULT,
    stopwordsHigh = STOPWORDS_HIGH_DEFAULT, maxLinkDensity = MAX_LINK_DENSITY_DEFAULT,
    maxHeadingDistance = MAX_HEADING_DISTANCE_DEFAULT, noHeadings = NO_HEADINGS_DEFAULT) {
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
    maxHeadingDistance = MAX_HEADING_DISTANCE_DEFAULT) {
    console.log(maxHeadingDistance);
    return paragraphs;
  }

  /**
   * Convert html string to HTML Document
   * rawHtml: string
   **/
  htmlToDom(rawHtml) {
    // TODO: process encode for html string
    const htmlHandler = new htmlparser.DefaultHandler((error, dom) => {
      if (error) {
        console.warn(error);
      } else {
        console.log('dom', JSON.stringify(dom, null, 2));
      }
    });
    const htmlParser = new htmlparser.Parser(htmlHandler);
    htmlParser.parseComplete(rawHtml);
    return htmlParser.dom;
  }

  /**
   * Removes unwanted parts of HTML.
   * rawHtml: string
   **/
  preprocessor(rawHtml,
    options = {
      html: false,
      head: false,
      script: true,
      iframe: true,
      style: true,
      comment: true,
    }) {
    // TODO: Process XML format
    // removes script section entirely
    const replace = String.prototype.replace;
    let str = rawHtml;
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

    // removes style section entirely
    if (options.style) {
      str = replace.call(str, /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
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
    str = replace.call(str, /\s{2,}/g, '');
    // remove space between tags
    str = replace.call(str, />\s</g, '><');
    // remove lead space
    str = replace.call(str, /^\s+/, '');
    // remove trailing space
    str = replace.call(str, /\s+$/, '');
    return str;
  }

}

export default Core;
