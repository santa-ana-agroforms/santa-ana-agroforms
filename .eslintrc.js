module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended', // Recommended rules for ESLint.
      'plugin:react/recommended', // Recommended rules for React.
      'plugin:@typescript-eslint/recommended', // TypeScript rules.
      'plugin:prettier/recommended' // Adds Prettier's recommended rules and its features.
    ],
    plugins: ['react', '@typescript-eslint', 'prettier'], // Plugins for ESLint.
    parserOptions: {
      ecmaVersion: 2020, // JS's modern syntax.
      sourceType: 'module', // Allows import and export.
      ecmaFeatures: { jsx: true, tsx: true } // JSX and TSX support.
    },
    rules: {
      'prettier/prettier': 'error' // Deals Prettier errors as ESLint errors.
    },
    settings: {
      react: {
        version: 'detect' // Automaticaly detects React's version.
      }
    }
  }
  