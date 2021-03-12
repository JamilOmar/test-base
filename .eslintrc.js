module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none', // none - do not check arguments
        varsIgnorePattern: 'inject|(\\w+)Bindings',
        ignoreRestSiblings: true
      }
    ],
    'no-unused-expressions': 'error', // tslint:no-unused-expression
    'no-var': 'error', // tslint:no-var-keyword
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-invalid-this': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'mocha/no-identical-title': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-undef': 'off',
    'no-global-assign': 'off',
    'no-case-declarations': 'off',
    'prefer-const': 'off',
    'no-shadow': 'off',
    'no-return-await':'off',
    'no-var':'off',
    'no-void': 'off',
    'no-prototype-builtins' :'off',
    '@typescript-eslint/ban-ts-comment' : 'off',
    'eqeqeq':'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/return-await': 'off'
  },
    ignorePatterns: ['.eslintrc.js'],
};
