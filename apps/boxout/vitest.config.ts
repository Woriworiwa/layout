/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import * as path from 'node:path';

export default defineConfig({
  root: __dirname,
  plugins: [
    angular({
      tsconfig: path.resolve(__dirname, 'tsconfig.spec.json'),
    }),
  ],
  resolve: {
    alias: {
      '@layout/canvas': path.resolve(__dirname, '../../libs/canvas/src/index.ts'),
    },
  },
  test: {
    // Environment
    environment: 'happy-dom',

    // Global test utilities
    globals: true,

    // Setup files - Zone.js must be imported before test-setup
    setupFiles: [
      'zone.js',
      'zone.js/testing',
      path.resolve(__dirname, 'src/test-setup.ts'),
    ],

    // Test match patterns
    include: [path.resolve(__dirname, 'src/**/*.{test,spec}.ts')],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
      ],
    },

    // Parallel execution
    pool: 'threads',

    // Timeout
    testTimeout: 10000,
  },
});
