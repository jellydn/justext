import Core from './Core.js';
import Presenter from './Presenter.js';

const MAX_LINK_DENSITY_DEFAULT = 0.2;
const LENGTH_LOW_DEFAULT = 70;
const LENGTH_HIGH_DEFAULT = 200;
const STOPWORDS_LOW_DEFAULT = 0.30;
const STOPWORDS_HIGH_DEFAULT = 0.32;
const NO_HEADINGS_DEFAULT = false;
const MAX_HEADING_DISTANCE_DEFAULT = 200;

export default function main(htmlText, stoplist = [], format = 'default', options = {
  lengthLow: LENGTH_LOW_DEFAULT, lengthHigh: LENGTH_HIGH_DEFAULT,
  stopwordsLow: STOPWORDS_LOW_DEFAULT, stopwordsHigh: STOPWORDS_HIGH_DEFAULT,
  maxLinkDensity: MAX_LINK_DENSITY_DEFAULT, maxHeadingDistance: MAX_HEADING_DISTANCE_DEFAULT,
  noHeadings: NO_HEADINGS_DEFAULT,
}) {
  let stopwordsLow = options.stopwordsLow;
  let stopwordsHigh = options.stopwordsHigh;
  if (stoplist.length === 0) {
    // empty stoplist, switch to language-independent mode
    console.warn('No stoplist specified.');
    stopwordsHigh = 0;
    stopwordsLow = 0;
  }
  const core = new Core();
  const presenter = new Presenter();
  const paragrahps = core.jusText(htmlText, stoplist, options.lengthLow, options.lengthHigh,
    stopwordsLow, stopwordsHigh, options.maxLinkDensity,
    options.maxHeadingDistance, options.noHeadings);
  switch (format) {
    case 'default':
      return presenter.defaultOuptut(paragrahps);
    case 'boilerplate':
      return presenter.defaultOuptut(paragrahps, false);
    case 'detailed':
      return presenter.detailOuptut(paragrahps);
    case 'krdwrd':
      return presenter.krdwrdOuptut(paragrahps);
    default:
      throw new Error('Unknown format');
  }
}
