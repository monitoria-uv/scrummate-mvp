// jest.config.ts
const nextJest = require('next/jest');

/**
 * Este es el método de `next/jest` para crear una configuración extendida con soporte para:
 * - TypeScript
 * - JSX
 * - App Router de Next.js
 * - Alias como "@/components"
 */
const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testTimeout: 10000,
  testPathIgnorePatterns: ['/node_modules/'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Cambiado a jsdom para pruebas con DOM
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/db/(.*)$': '<rootDir>/db/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },

  collectCoverage: true,
  collectCoverageFrom: ['components/ui/**/*.{js,jsx,ts,tsx}', 'lib/**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/components/ui/(?!features)'],
  coverageProvider: 'v8',
};

module.exports = createJestConfig(customJestConfig);
