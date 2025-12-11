/**
 * Environment configuration template for production
 *
 * This file is a template. Copy it to environment.prod.ts and add your API keys.
 * The actual environment.prod.ts file is gitignored to keep secrets safe.
 *
 * For local development:
 * 1. Copy this file to environment.prod.ts
 * 2. Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key
 *
 * For CI/CD:
 * - Environment files are auto-generated from GitHub secrets
 * - See scripts/set-env.js for the generation logic
 */

export const environment = {
  production: true,
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'
};
