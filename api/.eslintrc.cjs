/* eslint-env node */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['import', 'prettier'],
  rules: {
    'func-names': ['warn', 'as-needed'],
    'import/extensions': 'off',
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
      },
    ],
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'prettier/prettier': 'warn',
  },
};
