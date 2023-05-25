/* eslint-env node */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:import/recommended',
    'airbnb-base',
    'plugin:jsdoc/recommended',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['import', 'prettier'],
  rules: {
    'func-names': ['warn', 'as-needed'],
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        'alphabetize': {
          caseInsensitive: false,
          order: 'asc',
        },
        'groups': [
          'external',
          'builtin',
          'internal',
          'sibling',
          'parent',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        'pathGroups': [
          {
            group: 'internal',
            pattern: '@/*',
          },
        ],
      },
    ],
    'no-unused-vars': 'warn',
    'jsdoc/require-jsdoc': 'warn',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          '@': './src',
        },
        extensions: ['.js', '.vue'],
      },
    },
  },
};
