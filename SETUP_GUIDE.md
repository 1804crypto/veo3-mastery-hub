# Setup Guide - Secure Credential Management

## ⚠️ IMPORTANT: Security Best Practices

**DO NOT** commit actual credentials to Git. Always use environment variables.

## Quick Setup Instructions

### Option 1: Share Information Securely (Recommended)

Instead of sharing secrets in chat, you can:

1. **Fill in the template files** I created:
   - `.env.example` (frontend)
   - `server/.env.example` (backend)

2. **Create local `.env` files** (these are in .gitignore):
   ```bash
   # Frontend
   cp .env.example .env.local
   
   # Backend  
   cd server
   cp .env.example .env
   ```

3. **Fill in your actual values** in these local files (they won't be committed)

4. **For deployment**, add these values directly in:
   - **Vercel**: Project Settings → Environment Variables
   - **Render**: Service → Environment → Secret Files

### Option 2: I Can Help Configure (Less Secure)

If you choose to share here, I can:
- Update `server/config/plans.json` with your Stripe price IDs
- Create configuration files with your values
- Guide you through the setup

**But remember**: After I configure files, you should:
1. Never commit files with real secrets to Git
2. Rotate any keys shared in chat after deployment
3. Use deployment platform's environment variables instead

## What Information I Need

### Required:

1. **Stripe Price IDs** (I'll update `server/config/plans.json`):
   - Monthly plan: `price_...`
   - Lifetime plan: `price_...`

2. **Stripe Publishable Key**: `pk_live_...` or `pk_test_...`

3. **Gemini API Key**: From Google AI Studio

4. **JWT Secret**: I can generate one for you, or you can provide one

5. **Stripe Secret Key**: `sk_live_...` or `sk_test_...`

### Optional (can be set later):
- Database URL (set up during deployment)
- Webhook Secret (get after webhook setup)
- Client URLs (get after frontend deployment)

## Next Steps

1. Tell me which approach you prefer
2. If you share info, I'll configure the files
3. I'll guide you through the deployment process

