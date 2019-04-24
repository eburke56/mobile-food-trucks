module.exports = {
  bail: false, // stop running tests after the first failure
  globals: {
    'ts-jest': { useBabelrc: true, enableTsDiagnostics: false },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  // moduleNameMapper: {
  //   // stub out resources
  //   '\\.(css|less)$': 'identity-obj-proxy',
  //   '\\.(jpg|jpeg|png|svg|ttf)$': '<rootDir>/Tests/__mocks__/fileMock.js',
  // },
  notify: true, // activates notifications for test results
  // preset: 'react-native',
  setupFiles: ['./test/setup.js'],
  testEnvironment: 'node',
  testRegex:
    '(test/(unit-tests|snapshot-tests)/.*|/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '/build/archive',
    '/node_modules/',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
