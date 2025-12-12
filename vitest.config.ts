/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    // Environment
    environment: 'happy-dom',

    // Global test utilities
    globals: true,

    // Setup files - Zone.js must be imported before test-setup
    setupFiles: ['zone.js', 'zone.js/testing', 'src/test-setup.ts'],

    // Test match patterns
    include: ['src/**/*.{test,spec}.ts'],

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
