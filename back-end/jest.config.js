/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "repositories",
    "jest.GlobalMocks.ts",
    "<rootDir>/src/server.ts",
    "<rootDir>/src/utils",
    "<rootDir>/src/routers",
    "<rootDir>/src/controllers",
    "<rootDir>/src/middlewares",
    "<rootDir>/src/schemas",
    "<rootDir>/src/app.ts",
    "<rootDir>/src/database.ts",
    "<rootDir>/src/services/testService.ts",
    "<rootDir>/tests/factory",
  ],
};
