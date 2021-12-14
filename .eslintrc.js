module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  env: {
    es2021: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  overrides: [
    {
      files: ['index.js', './src/client/**'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: true,
        node: true, // needed because `process` etc. is used in client
      },

      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
      ],

      plugins: ['react'],
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['./src/game/**'],
      env: { node: false },
    },
    {
      files: ['./src/**/*.test.js'],
      env: { jest: true },
    },
  ],
};
