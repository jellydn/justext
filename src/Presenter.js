import sprintf from 'sprintf-js';
import entities from 'html-entities';

class Presenter {

  /**
   * Outputs the paragraphs as:
   * <tag> text of the first paragraph
   * <tag> text of the second paragraph
   * ...
   * where <tag> is <p>, <h> or <b> which indicates
   * standard paragraph, heading or boilerplate respecitvely.
   * */
  defaultOuptut(paragraphs, noBoilerPlate = true) {
    const result = [];
    const htmlDecoding = new entities.AllHtmlEntities();

    paragraphs.forEach((paragraph) => {
      let tag = '';
      if (paragraph.classType === 'good') {
        if (paragraph.isHeading()) {
          tag = 'h';
        } else {
          tag = 'p';
        }
      } else if (!noBoilerPlate) {
        tag = 'b';
      }
      if (tag !== '') {
        result.push(sprintf.sprintf('<%s> %s', tag, htmlDecoding.encode(paragraph.text())));
      }
    });
    return result.join('\r\n');
  }

  /**
   * Same as output_default, but only <p> tags are used and the following
   * attributes are added: class, cfclass and heading.
   * */
  detailOuptut(paragraphs, stopwords = []) {
    const result = [];
    const htmlDecoding = new entities.AllHtmlEntities();

    paragraphs.forEach((paragraph) => {
      const format = '<p class="%s" cfclass="%s" heading="%i" xpath="%s"' +
        ' length="%i" charsCountInLinks="%i" linksDesity="%i"' +
        ' wordsCount="%i" stopwordDesity="%f" stopwordsCount="%i"> %s';
      result.push(sprintf.sprintf(
        format,
        paragraph.classType,
        paragraph.cfClass,
        Number(paragraph.isHeading(), 10),
        paragraph.xpath,
        Number(paragraph.len(), 10),
        paragraph.charsCountInLinks,
        Number(paragraph.linksDesity(), 10),
        Number(paragraph.wordsCount(), 10),
        Number(paragraph.stopwordDesity(stopwords), 10),
        Number(paragraph.stopwordsCount(stopwords), 10),
        htmlDecoding.encode(paragraph.text())
      ));
    });
    console.log('result', result);
    return result.join('\r\n');
  }

  /**
   * Outputs the paragraphs in a KrdWrd compatible format:
   * class<TAB>first text node
   * class<TAB>second text node
   * ...
   * where class is 1, 2 or 3 which means
   * boilerplate, undecided or good respectively. Headings are output as
   * undecided.
   * */
  krdwrdOuptut(paragraphs) {
    const result = [];
    paragraphs.forEach((paragraph) => {
      let cls = 1;
      if (['good', 'neargood'].indexOf(paragraph.classType) !== -1) {
        if (paragraph.isHeading()) {
          cls = 2;
        } else {
          cls = 3;
        }
      }

      for (let index = 0; index < paragraph.textNodes.length; index++) {
        let str = paragraph.textNodes[index];
        // remove lead space
        str = str.replace(/^\s+/, '');
        // remove trailing space
        str = str.replace(/\s+$/, '');
        result.push(sprintf.sprintf('%i\t%s', cls, str));
      }
    });
    return result.join('\r\n');
  }

}

export default Presenter;
