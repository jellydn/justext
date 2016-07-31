const fsx = require('fs-extra');
const jetpack = require('fs-jetpack');

const items = [];
fsx.walk('./src/stoplists')
  .on('data', (item) => {
    const extPos = item.path.indexOf('.txt');
    const slashPos = item.path.lastIndexOf('/');
    if (extPos !== - 1) {
      const name = item.path.substr(slashPos + 1, extPos - slashPos - 1);
      const data = jetpack.read(item.path);
      items.push({
        name, data,
      });
    }
  })
  .on('end', () => {
    fsx.outputJson('./src/stoplists.json', items, (err) => {
      if (err) {
        console.warn(err);
      }
    });
    console.log('done');
  });
