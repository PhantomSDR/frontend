module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    'eslint:recommended'
  ],
  overrides: [
    {
      files: [
        '**/*.svelte'
      ],
      processor: 'svelte3/svelte3'
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 2, maxEOF: 0 }] // standard
  },
  plugins: [
    'svelte3'
  ]
}
