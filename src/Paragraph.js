import PathInfo from './PathInfo.js';

/**
 * Object representing one block of text in HTML.
 * @class Paragraph
 */
class Paragraph {

  constructor(path = PathInfo) {
    this.domPath = path.dom();
    this.xpath = path.xpath();
    this.textNodes = [];
    this.charsCountInLinks = 0;
    this.tagsCount = 0;
    this.classType = '';
  }

  isHeading() {
    const re = /\bh\d\b/;
    return this.domPath.search(re);
  }

  isBoilerplate() {
    return this.classType !== 'good';
  }

  text() {
    let str = '';
    str = this.textNodes.join('');
    // remove multi space to one space
    str = str.replace(/\s{2,}/g, ' ');
    // remove lead space
    str = str.replace(/^\s+/, '');
    // remove trailing space
    str = str.replace(/\s+$/, '');
    return str;
  }

  len() {
    return this.text().length;
  }

  wordsCount() {
    return this.text().split(' ').length;
  }

  containsText() {
    return this.textNodes.length > 0;
  }

  appendText(str = '') {
    const replace = String.prototype.replace;
    const text = replace.call(str, /\s{2,}/g, ' ');
    this.textNodes.push(text);
    return text;
  }

  stopwordsCount(stopwords = []) {
    let count = 0;
    for (const word of this.text().split(' ')) {
      if (stopwords.indexOf(word.toLowerCase()) !== -1) {
        count++;
      }
    }
    return count;
  }

  stopwordDesity(stopwords = []) {
    const count = this.wordsCount();
    if (count === 0) {
      return 0;
    }

    return this.stopwordsCount(stopwords) / count;
  }

  linksDesity() {
    const textLength = this.len();
    if (textLength === 0) {
      return 0;
    }

    return this.charsCountInLinks / textLength;
  }
}

export default Paragraph;
