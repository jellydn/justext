import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
  babel(babelrc()),
  nodeResolve({ jsnext: true }),
  commonjs(),
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: 'lib/index.js',
  plugins: plugins,
  globals: {
    loglevel: 'loglevel',
    axios: 'axios',
    htmlparser: 'htmlparser',
    string: 'string',
    'html-entities': 'html-entities',
    'sprintf-js': 'sprintf-js',
  },
  external: external,
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
