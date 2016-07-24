import { expect } from 'chai';
import ParagraphMaker from '../../src/ParagraphMaker';
import Core from '../../src/Core';

describe('ParagraphMaker', () => {
  describe('ParagraphMaker.makeParagraphs()', () => {
    function paragraphsEqual(paragraph, text, wordsCount, tagsCount) {
      expect(paragraph.text).to.equal(text);
      expect(paragraph.wordsCount).to.equal(wordsCount);
      expect(paragraph.tagsCount).to.equal(tagsCount);
    }

    it('should return 0 when no paragraph', () => {
      const htmlString = '<html><body></body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const paragraphs = ParagraphMaker.makeParagraphs(dom);
      expect(paragraphs.length).to.not.equal(0);
    });

    it('should return 3 paragraphs including text, words count', () => {
      const htmlString = '<html><body>' +
        '<h1>Header</h1>' +
        '<p>text and some <em>other</em> words ' +
        '<span class="class">that I</span> have in my head now</p>' +
        '<p>footer</p>' +
        '</body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const paragraphs = ParagraphMaker.makeParagraphs(dom);
      expect(paragraphs.length).to.not.equal(3);
      paragraphsEqual(paragraphs[0], 'Header', 1, 0);
      const text = 'text and some other words that I have in my head now';
      paragraphsEqual(paragraphs[1], text, 12, 2);
      paragraphsEqual(paragraphs[0], 'Footer', 1, 0);
    });
  });
});
