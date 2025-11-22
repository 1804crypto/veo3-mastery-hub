# 🚀 START HERE - Simple Guide

## ✅ You Already Have:
- Gemini API Key ✅
- Stripe API Keys ✅

## 🎯 What to Do RIGHT NOW:

### Step 1: Create Stripe Products (5 minutes)

1. Go to https://dashboard.stripe.com
2. Click **Products** (left menu)
3. Click **+ Add Product**

**Create Product 1:**
- Name: `Pro Plan`
- Description: `Monthly subscription`
- Pricing: `Recurring` → `$4.00` → `Monthly`
- Click **Save Product**
- **COPY the Price ID** (starts with `price_`)

**Create Product 2:**
- Name: `Lifetime Access`
- Description: `One-time payment`
- Pricing: `One-time` → `$49.99`
- Click **Save Product**
- **COPY the Price ID** (starts with `price_`)

### Step 2: Update Plans File (2 minutes)

1. Open `server/config/plans.json`
2. Replace `price_XXXXX` and `price_YYYYY` with your actual price IDs:

```json
{
  "pro_monthly": {
    "priceId": "price_1ABC123..."  ← Your monthly price ID here
  },
  "lifetime": {
    "priceId": "price_1XYZ789..."  ← Your lifetime price ID here
  }
}
```

### Step 3: What Do You Want to Do?

#### 🏠 A) Test Locally First (Easier to Debug)

**Next:** See `STEP_BY_STEP.md` → Option A

#### 🚀 B) Deploy to Production Now (Skip Local Testing)

**Next:** See `STEP_BY_STEP.md` → Option B

---

## 📝 Quick Reference - Where Your Keys Go:

### For Local Testing:
1. Create `server/.env` file:
   ```
   GEMINI_API_KEY=your_gemini_key
   STRIPE_SECRET_KEY=sk_test_your_key
   DATABASE_URL=postgres://...
   JWT_SECRET=s/DeS72Iqw3AyEwcu8XWqlBMsxK3r+yv9feyMW8J+iM=
   ```

2. Create `.env.local` in root:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

### For Production (Netlify + Railway/Render):

**Frontend (Netlify):**
- Add environment variables in Netlify dashboard
- `VITE_API_BASE_URL` = your backend URL
- `VITE_STRIPE_PUBLISHABLE_KEY` = your publishable key
- `VITE_GEMINI_API_KEY` = your Gemini key

**Backend (Railway/Render):**
- Add environment variables in Railway/Render dashboard
- `GEMINI_API_KEY` = your Gemini key
- `STRIPE_SECRET_KEY` = your Stripe secret key
- `DATABASE_URL` = from Railway/Render PostgreSQL
- `JWT_SECRET` = use the one provided or generate new

## 🆘 Need Help?

**Tell me:**
- "I'm on Step 1 - Stripe products" → I'll guide you
- "I want to test locally first" → I'll help set that up
- "I want to deploy now" → I'll walk you through deployment

