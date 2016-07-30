import { expect } from 'chai';
import Core from '../../src/Core';
import Paragraph from '../../src/Paragraph';
import PathInfo from '../../src/PathInfo';

describe('Paragraph', () => {
  const repeat = String.prototype.repeat;
  const noHeading = false;
  const maxHeading = 200;

  let lengthLow = 70;
  let lengthHigh = 200;
  let stopwordsLow = 0.30;
  let stopwordsHigh = 0.32;
  let maxLinkDensity = 0.2;

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
    maxLinkDensity = 0.5;
    const result = core.classifyParagraphs(paragraphs, [],
      lengthLow, lengthHigh, stopwordsLow,
      stopwordsHigh, maxLinkDensity, maxHeading, noHeading);
    expect(result[0].cfClass).to.equal('short');
    expect(result[1].cfClass).to.equal('bad');
    expect(result[2].cfClass).to.equal('bad');
    expect(result[3].cfClass).to.equal('bad');
    expect(result[4].cfClass).to.equal('bad');
  });

  it('should test length low', () => {
    const paragraphs = [
      paragraphFixture({ text: repeat.call('0 1 2 3 4 5 6 7 8 9', 2), chars_count_in_links: 0 }),
      paragraphFixture({ text: repeat.call('0 1 2 3 4 5 6 7 8 9', 2), chars_count_in_links: 20 }),
    ];
    maxLinkDensity = 1;
    lengthLow = 1000;
    const core = new Core();
    const result = core.classifyParagraphs(paragraphs, [],
      lengthLow, lengthHigh, stopwordsLow,
      stopwordsHigh, maxLinkDensity, maxHeading, noHeading);
    expect(result[0].cfClass).to.equal('short');
    expect(result[1].cfClass).to.equal('bad');
  });

  it('should test stopwords high', () => {
    const paragraphs = [
      paragraphFixture({ text: repeat.call('0 1 2 3 4 5 6 7 8 9', 1) }),
      paragraphFixture({ text: repeat.call('0 1 2 3 4 5 6 7 8 9', 2) }),
    ];

    maxLinkDensity = 1;
    lengthLow = 0;
    stopwordsHigh = 0;
    lengthHigh = 20;
    const core = new Core();
    const result = core.classifyParagraphs(paragraphs, ['0'],
      lengthLow, lengthHigh, stopwordsLow,
      stopwordsHigh, maxLinkDensity, maxHeading, noHeading);
    expect(result[0].cfClass).to.equal('neargood');
    expect(result[1].cfClass).to.equal('good');
  });

  it('should test stopwords low', () => {
    const paragraphs = [
      paragraphFixture({ text: repeat.call('0 0 0 0 1 2 3 4 5 6 7 8 9', 1) }),
      paragraphFixture({ text: repeat.call('0 1 2 3 4 5 6 7 8 9', 1) }),
      paragraphFixture({ text: repeat.call('1 2 3 4 5 6 7 8 9', 1) }),
    ];

    maxLinkDensity = 1;
    lengthLow = 0;
    stopwordsHigh = 1000;
    stopwordsLow = 0.2;
    lengthHigh = 200;
    const core = new Core();
    const result = core.classifyParagraphs(paragraphs, ['0', '1'],
      lengthLow, lengthHigh, stopwordsLow,
      stopwordsHigh, maxLinkDensity, maxHeading, noHeading);
    expect(result[0].cfClass).to.equal('neargood');
    expect(result[1].cfClass).to.equal('neargood');
    expect(result[2].cfClass).to.equal('bad');
  });
});
