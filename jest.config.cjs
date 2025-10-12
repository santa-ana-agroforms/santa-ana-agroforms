/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2020",
          parser: { syntax: "typescript", tsx: true, decorators: true },
          transform: { react: { runtime: "automatic" } },
        },
      },
    ],
  },
  moduleNameMapper: {
    // Mock de assets
    "^@/assets/.*\\.(png|jpe?g|gif|svg|webp|avif)(\\?url)?$":
      "<rootDir>/test/__mocks__/fileMock.cjs",
    "\\.(png|jpe?g|gif|svg|webp|avif)(\\?url)?$":
      "<rootDir>/test/__mocks__/fileMock.cjs",

    // Estilos
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // Alias
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironmentOptions: { url: "http://localhost/" },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/mocha_tests/",
    "/cypress/",
    "/selenium_tests/",
  ],
};
