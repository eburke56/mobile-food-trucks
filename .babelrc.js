const IS_PRODUCTION_LIKE = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    [
      '@nerdwallet/nw-app-build/babel',
      {
        /**
         * This repo makes use of lodash's _.chain function. `babel-plugin-lodash` does not support
         * use of this function due to bundle size issues but that shouldn't apply to query0:
         * https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba
         */
        'babel-plugin-lodash': false,
      },
    ],
  ],
  plugins: [
    IS_PRODUCTION_LIKE && 'babel-plugin-transform-remove-console',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./'],
        alias: {
          '@app': './src/app',
          '@network': './src/network',
          '@playground': './src/playground',
          '@services': './src/services',
          '@test': './test',
        },
      },
    ],
  ].filter(Boolean),
  sourceMaps: IS_PRODUCTION_LIKE ? false : 'inline',
};
