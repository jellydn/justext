import PathInfo from './PathInfo.js';
/**
 * A class for converting a HTML page represented as a DOM object into a list
 * of paragraphs.
 * @class ParagraphMaker
 */
class ParagraphMaker {

  constructor() {
    this.path = new PathInfo();
    this.paragraphs = [];
    this.paragraph = '';
    this.link = false;
    this.br = this;
    this.startNewParagraph();
  }

  startNewParagraph() {

  }

  /**
   * Converts DOM into paragraphs.
   **/
  makeParagraphs(dom) {
    return dom;
  }

}

export default ParagraphMaker;
