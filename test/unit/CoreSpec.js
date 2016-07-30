import { expect } from 'chai';
import Core from '../../src/Core';

describe('Core', () => {
  describe('core.preprocessor()', () => {
    it('should return true when clean comments', () => {
      const rawHtml = '<html><!-- comment --><body><h1>Header</h1>' +
        '<!-- comment --> text<p>footer</p></body></html>';
      const core = new Core();
      const dom = core.preprocessor(rawHtml, { comment: true });
      const expected = '<html><body><h1>Header</h1> text<p>footer</p></body></html>';
      expect(dom).to.be.equal(expected);
    });

    it('should return true when clean header tag', () => {
      const rawHtml = '<html><head><title>Title</title></head><body>' +
        '<h1>Header</h1>' +
        '<p><span>text</span></p>' +
        '<p>footer <em>like</em> a boss</p>' +
        '</body></html>';
      const core = new Core();
      const dom = core.preprocessor(rawHtml, { head: true });
      const expected = '<html><body>' +
        '<h1>Header</h1>' +
        '<p><span>text</span></p>' +
        '<p>footer <em>like</em> a boss</p>' +
        '</body></html>';
      expect(dom).to.be.equal(expected);
    });
  });
});
