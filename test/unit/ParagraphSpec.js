import { expect } from 'chai';
import Core from '../../src/Core';
import Paragraph from '../../src/Paragraph';
import PathInfo from '../../src/PathInfo';
const MAX_LINK_DENSITY_DEFAULT = 0.2;
const LENGTH_LOW_DEFAULT = 70;
const LENGTH_HIGH_DEFAULT = 200;
const STOPWORDS_LOW_DEFAULT = 0.30;
const STOPWORDS_HIGH_DEFAULT = 0.32;
const NO_HEADINGS_DEFAULT = false;
const MAX_HEADING_DISTANCE_DEFAULT = 200;

describe('Paragraph', () => {
  function paragraphFixture(options = { text: '', chars_count_in_links: 0, max_link_density: 0 }) {
    const path = new PathInfo();
    path.append('body').append('p');
    const paragraph = new Paragraph(path);
    if (options.text) {
      paragraph.appendText(options.text);
    }

    if (options.chars_count_in_links) {
      paragraph.charsCountInLinks = options.chars_count_in_links;
    }

    if (options.max_link_density) {
      paragraph.charsCountInLinks = options.chars_count_in_links;
    }

    return paragraph;
  }

  it('should test max link desity', () => {
    const paragraphs = [
      paragraphFixture({ text: '0123456789' * 2, chars_count_in_links: 0 }),
      paragraphFixture({ text: '0123456789' * 2, chars_count_in_links: 20 }),
      paragraphFixture({ text: '0123456789' * 8, chars_count_in_links: 40 }),
      paragraphFixture({ text: '0123456789' * 8, chars_count_in_links: 39 }),
      paragraphFixture({ text: '0123456789' * 8, chars_count_in_links: 41 }),
    ];

    const core = new Core();
    const result = core.classifyParagraphs(paragraphs, [],
      LENGTH_LOW_DEFAULT, LENGTH_HIGH_DEFAULT, STOPWORDS_LOW_DEFAULT,
      STOPWORDS_HIGH_DEFAULT, 0.5, MAX_HEADING_DISTANCE_DEFAULT, NO_HEADINGS_DEFAULT);
    console.log('result', result);
    expect(result[0].cfClass).to.equal('short');
    expect(result[1].cfClass).to.equal('bad');
    expect(result[2].cfClass).to.equal('bad');
    expect(result[3].cfClass).to.equal('bad');
    expect(result[4].cfClass).to.equal('bad');
  });
});
