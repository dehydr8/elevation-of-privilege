module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  env: {
    es2021: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  rules: {
    'prettier/prettier': 0,
  },
  
  overrides: [
    {
      // all typescript files
      files: ['./src/**/*.ts', './src/**/*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
    },
    {
      // all client files
      files: ['./src/index.tsx', './src/client/**'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: true,
        node: true, // needed because `process` etc. is used in client
      },
      extends: ['plugin:react/recommended'],
      plugins: ['react'],
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      // client typescript files
      files: ['./src/index.tsx', './src/client/**/*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      // non-client typescript files
      files: [
        './src/server/**/*.ts',
        './src/game/**/*.ts',
        './src/utils/**/*.ts',
      ],
      parserOptions: {
        module: 'tsconfig.server.json',
      },
    },
    {
      // all server files
      files: ['./src/server/**'],
      env: {
        node: true,
      },
    },
    {
      // test files
      files: ['./src/**/*.test.*'],
      env: { jest: true },
    },
    {
      // configuration files
      files: ['./.eslintrc.cjs', './.prettierrc.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
