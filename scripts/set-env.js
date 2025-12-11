#!/usr/bin/env node

/**
 * Script to generate environment files from environment variables
 * Used during CI/CD to inject secrets into the build
 */

const fs = require('fs');
const path = require('path');

// Get the API key from environment variable
const geminiApiKey = process.env.GEMINI_API_KEY || '';

if (!geminiApiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY environment variable not set!');
  console.warn('⚠️  The application will build without an API key.');
}

// Define environment files
const environments = [
  {
    path: path.join(__dirname, '../src/environments/environment.ts'),
    production: false,
  },
  {
    path: path.join(__dirname, '../src/environments/environment.prod.ts'),
    production: true,
  }
];

// Generate each environment file
environments.forEach(env => {
  const content = `export const environment = {
  production: ${env.production},
  geminiApiKey: '${geminiApiKey}'
};
`;

  fs.writeFileSync(env.path, content);
  console.log(`✅ Generated: ${path.basename(env.path)}`);
});

console.log('✅ Environment files generated successfully');
