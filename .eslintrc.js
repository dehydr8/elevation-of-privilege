module.exports = {
  parserOptions: {
    sourceType: 'module',
  },

  env: {
    es2021: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  overrides: [
    {
      files: ['./src/client/**'],
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: { browser: true, node: false, es2021: true },

      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
      ],

      plugins: ['react'],
    },
    {
      files: ['./src/server/**'],
      env: { browser: false, node: true, es2021: true },
    },
    {
      files: ['./src/game/**'],
      env: { browser: false, node: false, es2021: true },
    },
  ],
};
