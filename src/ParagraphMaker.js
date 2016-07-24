import PathInfo from './PathInfo.js';

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
