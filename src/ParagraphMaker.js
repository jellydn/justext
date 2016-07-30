import PathInfo from './PathInfo.js';
import Paragraph from './Paragraph.js';

// const PARAGRAPH_TAGS = [
//   'body', 'blockquote', 'caption', 'center', 'col', 'colgroup', 'dd',
//   'div', 'dl', 'dt', 'fieldset', 'form', 'legend', 'optgroup', 'option',
//   'p', 'pre', 'table', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr',
//   'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
// ];
/**
 * A class for converting a HTML page represented as a DOM object into a list
 * of paragraphs.
 * @class ParagraphMaker
 */
class ParagraphMaker {

  constructor() {
    this.path = new PathInfo();
    this.paragraphs = [];
    this.paragraph = null;
    this.link = false;
    this.br = this;
    this.startNewParagraph();
  }

  startNewParagraph() {
    if (this.paragraph && this.paragraph.containsText) {
      this.paragraphs.push(this.paragraph);
    }

    this.paragraph = new Paragraph(this.path);
  }

  /**
   * Converts DOM into paragraphs.
   **/
  makeParagraphs(root) {
    console.log('root', JSON.stringify(root, null, 2));
    return this.paragraphs;
  }

}

export default ParagraphMaker;
