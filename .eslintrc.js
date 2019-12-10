const { readFileSync } = require('fs');
const schemaString = readFileSync('./data/schema.graphql', 'utf8');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'jest',
    '@typescript-eslint',
    'graphql',
  ],
  overrides: [
    {
      files: ['@app/e2e/cypress/**'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
    'no-console': 0,
    'no-confusing-arrow': 0,
    'no-else-return': 0,
    'no-return-assign': [2, 'except-parens'],
    'no-underscore-dangle': 0,
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,
    camelcase: 0,
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
      },
    ],
    'class-methods-use-this': 0,
    'no-restricted-syntax': 0,

    'import/no-extraneous-dependencies': 0,

    'graphql/template-strings': [
      'error',
      {
        env: 'literal',
        schemaString,
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        schemaString,
      },
    ],
    'graphql/required-fields': [
      'error',
      {
        env: 'literal',
        schemaString,
        requiredFields: ['nodeId', 'id'],
      },
    ],

    'arrow-body-style': 0,
    'no-nested-ternary': 0,
  },
};
