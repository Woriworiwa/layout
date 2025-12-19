const nx = require('@nx/eslint-plugin');
const angularEslint = require('@angular-eslint/eslint-plugin');
const angularTemplateParser = require('@angular-eslint/template-parser');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  // Global ignores
  {
    ignores: ['**/dist', '**/node_modules', '**/coverage', '**/.nx'],
  },

  // Base TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@nx': nx,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  // Angular TypeScript files
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@nx': nx,
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularEslint,
    },
    rules: {
      ...angularEslint.configs.recommended.rules,
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },

  // Angular HTML templates
  {
    files: ['src/**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
    },
    rules: {
      ...require('@angular-eslint/eslint-plugin-template').configs.recommended.rules,
    },
  },

  // E2E Playwright files
  {
    files: ['e2e/**/*.ts', 'e2e/**/*.spec.ts'],
    plugins: {
      '@nx': nx,
      '@typescript-eslint': tsPlugin,
      playwright: playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      '@nx': nx,
    },
    rules: {},
  },
];
