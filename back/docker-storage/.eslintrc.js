module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js.old'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-var': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'prefer-const': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-unneeded-ternary': 'error',
    'no-restricted-syntax': [
      'error',
      {
        'selector': 'BinaryExpression[operator=/^(==|===|!=|!==)$/][left.raw=/^(true|false)$/], BinaryExpression[operator=/^(==|===|!=|!==)$/][right.raw=/^(true|false)$/]',
        'message': 'Don\'t compare for equality against boolean literals',
      },
    ],
  },
};
