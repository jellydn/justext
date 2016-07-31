import PathInfo from './PathInfo.js';
import Paragraph from './Paragraph.js';

const PARAGRAPH_TAGS = [
  'body', 'blockquote', 'caption', 'center', 'col', 'colgroup', 'dd',
  'div', 'dl', 'dt', 'fieldset', 'form', 'legend', 'optgroup', 'option',
  'p', 'pre', 'table', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr',
  'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
];
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
    this.br = false;
    this.startNewParagraph();
  }

  startNewParagraph() {
    if (this.paragraph && this.paragraph.containsText()) {
      this.paragraphs.push(this.paragraph);
    }

    this.paragraph = new Paragraph(this.path);
  }

  startElementNS(name) {
    this.path.append(name);
    if (PARAGRAPH_TAGS.indexOf(name) !== -1 || (name === 'br' && this.br)) {
      if (name === 'br') {
        this.paragraph.tagsCount -= 1;
      }

      this.startNewParagraph();
    } else {
      this.br = name === 'br';
      if (name === 'a') {
        this.link = true;
      }

      this.paragraph.tagsCount += 1;
    }
  }

  endElementNS(name) {
    this.path.pop();
    if (PARAGRAPH_TAGS.indexOf(name) !== -1) {
      this.startNewParagraph();
    }

    if (name === 'a') {
      this.link = false;
    }
  }

  characters(content) {
    const trim = String.prototype.trim;
    if (!!trim.call(content)) {
      const text = this.paragraph.appendText(content);
      if (this.link) {
        this.paragraph.charsCountInLinks += text.length;
      }
      this.br = false;
    }
  }

  parseHtmlDocument(root) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    root.forEach((dom) => {
      if (dom.type !== 'directive') {
        if (hasOwnProperty.call(dom, 'children')) {
          this.startElementNS(dom.name);
          this.parseHtmlDocument(dom.children);
          this.endElementNS(dom.name);
        } else {
          if (dom.type === 'text') {
            this.characters(dom.data);
          } else if (hasOwnProperty.call(dom, 'name')) {
            // support br for multiple lines
            this.startElementNS(dom.name);
          }
        }
      }
    });
  }

  /**
   * Converts root document into paragraphs.
   **/
  makeParagraphs(root) {
    this.parseHtmlDocument(root);
    console.log('makeParagraphs', this.paragraphs);
    return this.paragraphs;
  }
}

export default ParagraphMaker;
