# API Keys & Configuration Guide

## 🔑 Complete List of API Keys Needed

### ✅ Required for Production:

1. **Stripe Keys** (for payments)
   - Publishable Key: `pk_test_...` or `pk_live_...`
   - Secret Key: `sk_test_...` or `sk_live_...`
   - Webhook Secret: `whsec_...` (get after webhook setup)
   - Price IDs: `price_...` (for monthly and lifetime plans)

2. **JWT Secret** (for authentication)
   - Generate with: `openssl rand -base64 32`
   - Or: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

3. **Database URL** (PostgreSQL connection string)
   - Format: `postgres://user:password@host:port/database`

### ⚠️ Optional (App Works Without These):

4. **Gemini API Key** (for prompt generation)
   - **FREE TIER WORKS!** ✅
   - The app gracefully falls back to mock responses if:
     - API key is missing
     - Free tier quota is exceeded
     - API calls fail for any reason
   - Users can still use all features, just with example prompts

5. **Client-side Gemini API Key** (only for Community Hub AI chat)
   - Only needed if you want the AI chat assistant in Community Hub
   - If missing, chat shows helpful error messages instead

## 📝 How to Get Each Key

### Stripe Keys:
1. Go to https://dashboard.stripe.com
2. Create account or login
3. Navigate to **Developers** → **API Keys**
4. Copy **Publishable key** and **Secret key**
5. For test mode, use keys starting with `pk_test_` and `sk_test_`
6. For production, use keys starting with `pk_live_` and `sk_live_`

### Stripe Products & Prices:
1. In Stripe Dashboard → **Products**
2. Create two products:
   - **Pro Plan** (Monthly Subscription)
     - Type: Recurring
     - Billing: Monthly
     - Price: $4.00/month
     - Copy the `price_...` ID
   - **Lifetime Access** (One-time Payment)
     - Type: One-time
     - Price: $49.99
     - Copy the `price_...` ID
3. Update `server/config/plans.json` with these price IDs

### Gemini API Key:
1. Go to https://aistudio.google.com
2. Sign in with Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the key
5. **Note**: Free tier has limits, but the app handles this gracefully!

### JWT Secret:
Run in terminal:
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Database URL:
1. Sign up for free PostgreSQL hosting:
   - **Railway**: https://railway.app (free tier available)
   - **Render**: https://render.com (free tier available)
   - **Supabase**: https://supabase.com (free tier available)
   - **Neon**: https://neon.tech (free tier available)
2. Create a PostgreSQL database
3. Copy the connection string (usually provided automatically)

## 🚀 Setup Steps

### Step 1: Create Local Config Files

```bash
# Frontend
cp .env.local.example .env.local

# Backend
cd server
cp .env.example .env
```

### Step 2: Fill in the Values

Edit `.env.local` and `server/.env` with your actual keys (use the placeholders as guides).

### Step 3: Update Stripe Price IDs

Edit `server/config/plans.json`:
```json
{
  "pro_monthly": {
    "priceId": "price_YOUR_MONTHLY_PRICE_ID"
  },
  "lifetime": {
    "priceId": "price_YOUR_LIFETIME_PRICE_ID"
  }
}
```

### Step 4: Deploy

For **Netlify** (Frontend):
- Add environment variables in Site Settings → Environment Variables
- Use the same names from `.env.local.example`

For **Railway/Render** (Backend):
- Add environment variables in Project Settings
- Use the same names from `server/.env.example`

## ✅ Free Tier Compatibility

### Gemini Free Tier:
- ✅ **App works perfectly** even when free tier quota is exceeded
- ✅ Automatically falls back to mock/example prompts
- ✅ Users see helpful messages instead of errors
- ✅ All other features continue working

### What Happens When Free Tier Expires:
1. Prompt generation returns example prompts (still functional)
2. Video Studio uses user's own API key (not affected)
3. Community Hub AI chat shows error message (optional feature)
4. All other features work normally

## 🔒 Security Best Practices

1. **Never commit** `.env` or `.env.local` files to Git (they're in .gitignore)
2. **Never share** API keys in chat or public forums
3. **Rotate keys** if you accidentally expose them
4. **Use test keys** for development, live keys only for production
5. **Set environment variables** in deployment platform UI, not in code

## 📋 Quick Checklist

- [ ] Stripe account created
- [ ] Stripe publishable key obtained
- [ ] Stripe secret key obtained
- [ ] Stripe products created (monthly + lifetime)
- [ ] Stripe price IDs copied to `server/config/plans.json`
- [ ] JWT secret generated
- [ ] PostgreSQL database created
- [ ] Database URL obtained
- [ ] Gemini API key obtained (optional, but recommended)
- [ ] All values added to `.env.local` and `server/.env`
- [ ] Ready to deploy!

