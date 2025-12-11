/**
 * Environment configuration template for development
 *
 * This file is a template. Copy it to environment.ts and add your API keys.
 * The actual environment.ts file is gitignored to keep secrets safe.
 *
 * For local development:
 * 1. Copy this file to environment.ts
 * 2. Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key
 *
 * For CI/CD:
 * - Environment files are auto-generated from GitHub secrets
 * - See scripts/set-env.js for the generation logic
 */

export const environment = {
  production: false,
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'
};
