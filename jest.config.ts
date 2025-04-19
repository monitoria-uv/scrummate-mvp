module.exports = {
  testTimeout: 10000,
  testPathIgnorePatterns: ['/node_modules/'],

  // For TypeScript
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Config to load env variables
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
