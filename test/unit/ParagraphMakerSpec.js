import { expect } from 'chai';
import ParagraphMaker from '../../src/ParagraphMaker';
import Core from '../../src/Core';

describe('ParagraphMaker', () => {
  describe('ParagraphMaker.makeParagraphs()', () => {
    function paragraphsEqual(paragraph, text, wordsCount, tagsCount, charsCountInLinks = 0) {
      expect(paragraph.text()).to.equal(text);
      expect(paragraph.wordsCount()).to.equal(wordsCount);
      expect(paragraph.tagsCount).to.equal(tagsCount);
      expect(paragraph.charsCountInLinks).to.equal(charsCountInLinks);
    }

    it('should return 0 when no paragraph', () => {
      const htmlString = '<html><body></body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(0);
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
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(3);
      paragraphsEqual(paragraphs[0], 'Header', 1, 0);
      const text = 'text and some other words that I have in my head now';
      paragraphsEqual(paragraphs[1], text, 12, 2);
      paragraphsEqual(paragraphs[2], 'footer', 1, 0);
    });

    it('should support whitespace handling', () => {
      const htmlString = '<html><body>' +
        '<p>pre<em>in</em>post \t pre  <span class="class"> in </span>  post</p>' +
        '<div>pre<em> in </em>post</div>' +
        '<pre>pre<em>in </em>post</pre>' +
        '<blockquote>pre<em> in</em>post</blockquote>' +
        '</body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(4);
      paragraphsEqual(paragraphs[0], 'preinpost pre in post', 4, 2);
      paragraphsEqual(paragraphs[1], 'pre in post', 3, 1);
      paragraphsEqual(paragraphs[2], 'prein post', 2, 1);
      paragraphsEqual(paragraphs[3], 'pre inpost', 2, 1);
    });

    it('should support multiple link break', () => {
      const htmlString = '<html><body>' +
        '  normal text   <br><br> another   text  ' +
        '</body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(2);
      paragraphsEqual(paragraphs[0], 'normal text', 2, 0);
      paragraphsEqual(paragraphs[1], 'another text', 2, 0);
    });

    it('should support inline text in body', () => {
      const htmlString = '<html><body>' +
        '<sup>I am <strong>top</strong>-inline\n\n\n\n and I am happy \n</sup>' +
        '<p>normal text</p>' +
        '<code>\nvar i = -INFINITY;\n</code>' +
        '<div>after text with variable <var>N</var> </div>' +
        '   I am inline\n\n\n\n and I am happy \n' +
        '</body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(5);
      paragraphsEqual(paragraphs[0], 'I am top-inline and I am happy', 7, 2);
      paragraphsEqual(paragraphs[1], 'normal text', 2, 0);
      paragraphsEqual(paragraphs[2], 'var i = -INFINITY;', 4, 1);
      paragraphsEqual(paragraphs[3], 'after text with variable N', 5, 1);
      paragraphsEqual(paragraphs[4], 'I am inline and I am happy', 7, 0);
    });

    it('support link', () => {
      const htmlString = '<html><body>' +
        '<a>I am <strong>top</strong>-inline\n\n\n\n and I am happy \n</a>' +
        '<p>normal text</p>' +
        '<code>\nvar i = -INFINITY;\n</code>' +
        '<div>after <a>text</a> with variable <var>N</var> </div>' +
        '   I am inline\n\n\n\n and I am happy \n' +
        '</body></html>';
      const core = new Core();
      const dom = core.htmlToDom(htmlString);
      const maker = new ParagraphMaker();
      const paragraphs = maker.makeParagraphs(dom);
      expect(paragraphs.length).to.equal(5);
      paragraphsEqual(paragraphs[0], 'I am top-inline and I am happy', 7, 2, 31);
      paragraphsEqual(paragraphs[1], 'normal text', 2, 0);
      paragraphsEqual(paragraphs[2], 'var i = -INFINITY;', 4, 1);
      paragraphsEqual(paragraphs[3], 'after text with variable N', 5, 2, 4);
      paragraphsEqual(paragraphs[4], 'I am inline and I am happy', 7, 0);
    });
  });
});
