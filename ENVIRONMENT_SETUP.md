# Environment Setup Guide

This guide explains how environment variables and API keys are managed in this project.

## Overview

The project uses **Google Gemini API** for AI-powered layout generation. The API key is managed differently for local development vs. CI/CD:

- **Local Development**: API key stored in local environment files (gitignored)
- **CI/CD (GitHub Actions)**: API key injected from GitHub Secrets during build

## Local Development Setup

### First-Time Setup

1. **Copy the template files**:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
   ```

2. **Add your API key**:
   - Open `src/environments/environment.ts`
   - Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual Gemini API key
   - Repeat for `environment.prod.ts`

3. **Verify setup**:
   ```bash
   npm start
   ```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it into your environment files

## CI/CD Setup (GitHub Actions)

The project uses GitHub Secrets to securely inject the API key during automated builds.

### How It Works

1. **GitHub Secret**: `GEMINI_API_KEY` is stored in repository secrets
2. **Build Process**:
   - GitHub Actions workflow runs `npm run build`
   - The `prebuild` script (`scripts/set-env.js`) runs first
   - Environment files are auto-generated from the `GEMINI_API_KEY` secret
   - Build proceeds with the generated environment files

### Adding/Updating the GitHub Secret

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** (or edit existing)
4. Name: `GEMINI_API_KEY`
5. Value: Your Gemini API key
6. Click **Add secret**

## File Structure

```
src/environments/
├── environment.template.ts      # Template for development (committed)
├── environment.prod.template.ts # Template for production (committed)
├── environment.ts              # Actual dev config (gitignored)
└── environment.prod.ts         # Actual prod config (gitignored)
```

## Scripts

### `scripts/set-env.js`

Generates environment files from the `GEMINI_API_KEY` environment variable.

**Usage**:
```bash
# With environment variable
GEMINI_API_KEY='your-key-here' node scripts/set-env.js

# Environment variable is set automatically in GitHub Actions
```

**When it runs**:
- Automatically before every `npm run build` (via `prebuild` script)
- Manually when you run the script directly

## Important Notes

### Security Considerations

⚠️ **Client-Side Exposure**: Since this is a browser-based application, the API key will be visible in the compiled JavaScript bundle. This is a known limitation of client-side apps.

**Current Protection**:
- API key not committed to repository
- GitHub Secrets used in CI/CD
- API key restrictions recommended in Google Cloud Console

**Recommended Additional Security**:
1. **API Key Restrictions** (Google Cloud Console):
   - Restrict by HTTP referrer (your domain only)
   - Enable only Generative Language API
   - Set daily quota limits

2. **Future Enhancement**: Implement a backend proxy (Firebase Cloud Functions) to keep the API key server-side

### Troubleshooting

**Problem**: Build fails with "GEMINI_API_KEY environment variable not set"
- **Local**: Make sure you've created `environment.ts` from the template
- **CI/CD**: Verify the GitHub Secret is set correctly

**Problem**: Environment files show up as uncommitted changes in Git
- **Solution**: They should be gitignored. Run `git status` to verify

**Problem**: API key not working in production
- **Solution**: Verify the GitHub Secret `GEMINI_API_KEY` contains the correct key

## Development Workflow

### Starting Development
```bash
npm start  # Uses environment.ts
```

### Building
```bash
npm run build  # Runs prebuild script first, then builds
```

### Testing in Production Mode
```bash
npm run build -- --configuration production  # Uses environment.prod.ts
```

## Migration Notes

If you're setting up this project after the environment system was implemented:

1. The old `environment.ts` and `environment.prod.ts` with hardcoded keys have been removed from version control
2. You must create them locally from the templates
3. They will never be committed (gitignored)
4. CI/CD handles environment file generation automatically

## Questions?

If you need help with environment setup:
1. Check if template files exist: `ls src/environments/*.template.ts`
2. Verify gitignore: `cat .gitignore | grep environment`
3. Test the script: `GEMINI_API_KEY='test' node scripts/set-env.js`
