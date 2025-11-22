# 🎯 Step-by-Step: What to Do Next

## ✅ You Have:
- ✅ Gemini API Key
- ✅ Stripe API Keys

## 📝 What You Need Next:

### 1. Stripe Products & Price IDs
Before we can deploy, you need to create products in Stripe:

**Go to Stripe Dashboard → Products → Add Product**

Create **TWO products**:

#### Product 1: Monthly Subscription
- **Name**: "Pro Plan"
- **Type**: Recurring subscription
- **Price**: $4.00/month
- **Copy the Price ID** (looks like `price_1ABC123...`)

#### Product 2: Lifetime Access
- **Name**: "Lifetime Access"
- **Type**: One-time payment
- **Price**: $49.99
- **Copy the Price ID** (looks like `price_1XYZ789...`)

### 2. Update `server/config/plans.json`

Open `server/config/plans.json` and replace the placeholders:

```json
{
  "pro_monthly": {
    "priceId": "price_YOUR_MONTHLY_PRICE_ID_HERE"
  },
  "lifetime": {
    "priceId": "price_YOUR_LIFETIME_PRICE_ID_HERE"
  }
}
```

## 🚀 Next Steps (Choose Your Path):

### Option A: Test Locally First (Recommended)

**Step 1: Create local environment files**

Create `server/.env` file:
```bash
cd server
cp .env.example .env
# Or just create .env file manually
```

**Step 2: Fill in `server/.env`:**

```env
# Database (you'll get this when you create database later)
DATABASE_URL=postgres://user:password@localhost:5432/veo3db

# Security
JWT_SECRET=s/DeS72Iqw3AyEwcu8XWqlBMsxK3r+yv9feyMW8J+iM=

# Gemini API Key (you have this!)
GEMINI_API_KEY=your_gemini_api_key_here

# Stripe (you have these!)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_... (we'll get this later)

# Client URLs (update after deploying)
CLIENT_ORIGIN=http://localhost:3000
CLIENT_SUCCESS_URL=http://localhost:3000?payment=success
CLIENT_CANCEL_URL=http://localhost:3000?payment=cancelled

PORT=8080
NODE_ENV=development
```

**Step 3: Set up local database**

```bash
# Install PostgreSQL locally, or use Docker:
cd server
docker-compose up -d db

# Run migrations:
npx prisma migrate dev
```

**Step 4: Start backend**
```bash
cd server
npm install
npm run dev
```

**Step 5: Create frontend `.env.local` file**

In the root directory, create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Step 6: Start frontend**
```bash
# In root directory
npm install
npm run dev
```

Visit `http://localhost:3000` to test!

---

### Option B: Deploy Directly (Skip Local Testing)

#### Step 1: Create Stripe Products
(Do this first - see above)

#### Step 2: Update `server/config/plans.json`
(Do this second - see above)

#### Step 3: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### Step 4: Deploy Database (Railway or Render)

**Railway:**
1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Provision PostgreSQL
4. Copy the `DATABASE_URL` from Variables tab

**Render:**
1. Go to https://render.com
2. New → PostgreSQL
3. Create database
4. Copy Internal Connection String

#### Step 5: Deploy Backend

**Railway:**
1. New Project → Deploy from GitHub
2. Select your repo
3. Set Root Directory: `server`
4. Add Environment Variables (see list below)
5. Deploy!

**Render:**
1. New → Web Service
2. Connect GitHub repo
3. Root Directory: `server`
4. Build: `npm install && npx prisma generate && npm run build`
5. Start: `npm start`
6. Add Environment Variables
7. Deploy!

**Backend Environment Variables:**
```
DATABASE_URL=postgres://... (from step 4)
JWT_SECRET=s/DeS72Iqw3AyEwcu8XWqlBMsxK3r+yv9feyMW8J+iM=
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_ORIGIN=https://your-app.netlify.app (update after frontend deploy)
CLIENT_SUCCESS_URL=https://your-app.netlify.app?payment=success
CLIENT_CANCEL_URL=https://your-app.netlify.app?payment=cancelled
PORT=8080
NODE_ENV=production
```

#### Step 6: Run Database Migrations

**Railway Shell:**
```bash
npx prisma migrate deploy
```

**Render Shell:**
```bash
npx prisma migrate deploy
```

#### Step 7: Deploy Frontend (Netlify)

1. Go to https://app.netlify.com
2. Add new site → Import from GitHub
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app (from step 5)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```
7. Deploy!

#### Step 8: Update Backend with Frontend URL

Go back to Railway/Render and update:
```
CLIENT_ORIGIN=https://your-app.netlify.app
CLIENT_SUCCESS_URL=https://your-app.netlify.app?payment=success
CLIENT_CANCEL_URL=https://your-app.netlify.app?payment=cancelled
```

#### Step 9: Set Up Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.railway.app/api/payments/stripe-webhook`
3. Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the webhook secret (`whsec_...`)
5. Add to backend environment variables: `STRIPE_WEBHOOK_SECRET=whsec_...`

## 📋 Quick Checklist:

- [ ] Created Stripe products (monthly + lifetime)
- [ ] Got Stripe price IDs (`price_...`)
- [ ] Updated `server/config/plans.json` with price IDs
- [ ] Pushed code to GitHub
- [ ] Created database (Railway/Render)
- [ ] Deployed backend (Railway/Render)
- [ ] Added backend environment variables
- [ ] Ran database migrations
- [ ] Deployed frontend (Netlify)
- [ ] Added frontend environment variables
- [ ] Updated backend with frontend URL
- [ ] Set up Stripe webhook
- [ ] Added webhook secret to backend

## ❓ Still Confused?

**Tell me which step you're on and I'll help!**

Examples:
- "I'm stuck on creating Stripe products"
- "I don't know where to put my Gemini key"
- "How do I deploy to Railway?"
- "What's a price ID?"

