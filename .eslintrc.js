module.exports = {
  'rules': {
    'indent': [2,2, {'SwitchCase': 1}],
    'quotes': [2, 'single'],
    'linebreak-style': [2, 'unix' ],
    'semi': [2,'always'],
    'no-unused-vars': [1, {'vars': 'all', 'varsIgnorePattern': 'colors', 'argsIgnorePattern': 'stderr'}],
    'no-console': 0,
    'space-before-blocks': 2,
    'no-extra-boolean-cast': 0
  },
  'env': {
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended'
};
