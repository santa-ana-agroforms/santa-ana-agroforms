module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended", // Conjunto de reglas recomendadas por ESLint.
    "plugin:react/recommended", // Reglas recomendadas para React.
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas para TypeScript.
    "plugin:prettier/recommended", // Habilita Prettier y añade sus reglas recomendadas.
  ],
  plugins: ["react", "@typescript-eslint", "prettier"], // Plugins que amplían ESLint.
  parserOptions: {
    ecmaVersion: 2020, // Sintaxis moderna de JS.
    sourceType: "module", // Permite importar y exportar.
    ecmaFeatures: { jsx: true, tsx: true }, // Soporte para JSX y TSX.
  },
  rules: {
    "prettier/prettier": "error", // Trata errores de Prettier como errores de ESLint.
  },
  settings: {
    react: {
      version: "detect", // Detecta automáticamente la versión de React.
    },
  },
};
