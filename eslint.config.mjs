import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  reactRecommended,
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ),
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Reglas base
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',

      // Reglas de Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Reglas específicas del proyecto
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-floating-promises': 'error',

      // Exclusiones importantes
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  prettierConfig,
  {
    ignores: [
      '**/node_modules/',
      '**/.next/',
      '**/out/',
      '**/dist/',
      '**/build/',
      '.eslintrc.*',
      'postcss.config.mjs',
      'eslint.config.mjs',
      '**/schema/*.ts',
      '**/coverage/**',
      'jest.setup.ts',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
];
