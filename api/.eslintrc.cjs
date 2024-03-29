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
    'no-shadow': 'off',
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
    'no-case-declarations': 'off',
    'no-underscore-dangle': 'off',
    'import/no-dynamic-require': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'prettier/prettier': 'warn',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'jsdoc/no-undefined-types': 'off',
  },
};
