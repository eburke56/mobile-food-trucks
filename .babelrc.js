const IS_PRODUCTION_LIKE = process.env.NODE_ENV === 'production';

module.exports = {
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
