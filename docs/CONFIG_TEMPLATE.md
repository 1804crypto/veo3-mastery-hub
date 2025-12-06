# Configuration Template - Copy These Values

## 🔑 Quick Reference: All Keys Needed

### Required Keys:

1. **Stripe Publishable Key**: `pk_test_...` or `pk_live_...`
2. **Stripe Secret Key**: `sk_test_...` or `sk_live_...`
3. **Stripe Monthly Price ID**: `price_...`
4. **Stripe Lifetime Price ID**: `price_...`
5. **JWT Secret**: `s/DeS72Iqw3AyEwcu8XWqlBMsxK3r+yv9feyMW8J+iM=` (or generate new one)
6. **Database URL**: `postgres://user:password@host:port/database`

### Optional Keys (App Works Without):

7. **Gemini API Key**: `your_google_ai_studio_api_key` (free tier works!)
8. **Stripe Webhook Secret**: `whsec_...` (get after webhook setup)

## 📝 Files to Update

### 1. `server/config/plans.json`
Replace with your Stripe price IDs:
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

### 2. Frontend Environment Variables (for Netlify)
Add these in Netlify → Site Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
VITE_GEMINI_API_KEY=your_gemini_key (optional)
```

### 3. Backend Environment Variables (for Railway/Render)
Add these in Railway/Render → Project Settings → Environment Variables:
```
DATABASE_URL=postgres://user:password@host:5432/database
JWT_SECRET=s/DeS72Iqw3AyEwcu8XWqlBMsxK3r+yv9feyMW8J+iM=
GEMINI_API_KEY=your_gemini_key (optional - works with free tier!)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
CLIENT_ORIGIN=https://your-app.netlify.app
CLIENT_SUCCESS_URL=https://your-app.netlify.app?payment=success
CLIENT_CANCEL_URL=https://your-app.netlify.app?payment=cancelled
PORT=8080
NODE_ENV=production
```

## ✅ Steps to Fill In

1. **Get Stripe Keys**:
   - Go to https://dashboard.stripe.com
   - Developers → API Keys
   - Copy Publishable Key and Secret Key

2. **Create Stripe Products**:
   - Products → Add Product
   - Create "Pro Plan" (Monthly, $4/month)
   - Create "Lifetime Access" (One-time, $49.99)
   - Copy the `price_...` IDs

3. **Get Gemini API Key**:
   - Go to https://aistudio.google.com/apikey
   - Create API Key
   - Copy the key
   - **Note**: Free tier works! App handles quota limits gracefully

4. **Get Database URL**:
   - Railway/Render/Supabase provides this automatically
   - Copy the connection string

5. **Generate JWT Secret** (if you want a new one):
   ```bash
   openssl rand -base64 32
   ```

6. **Get Webhook Secret** (after deploying backend):
   - Stripe Dashboard → Developers → Webhooks
   - Create endpoint with your backend URL
   - Copy the signing secret (`whsec_...`)

## 🎯 Quick Setup Checklist

- [ ] Stripe account created
- [ ] Stripe products created (monthly + lifetime)
- [ ] Stripe price IDs copied to `server/config/plans.json`
- [ ] Stripe publishable key obtained
- [ ] Stripe secret key obtained
- [ ] JWT secret generated (use provided one or generate new)
- [ ] Database URL obtained
- [ ] Gemini API key obtained (optional but recommended)
- [ ] All values ready to add to Netlify/Railway/Render

## 🚀 Next Steps

See `NETLIFY_DEPLOYMENT.md` for complete deployment instructions!

