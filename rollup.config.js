import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import nodeResolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
  babel(babelrc()),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    modulesOnly: true,
  }),
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: 'lib/index.js',
  context: 'window',
  plugins: plugins,
  external: external,
  globals: {
    loglevel: 'loglevel',
    axios: 'axios',
    htmlparser: 'htmlparser',
    string: 'string',
    'html-entities': 'html-entities',
    'sprintf-js': 'sprintf-js',
  },
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'justext',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
