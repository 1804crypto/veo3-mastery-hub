# Free Deployment Guide - Netlify + Railway/Render

This guide uses **100% FREE** hosting services:
- **Frontend**: Netlify (free tier)
- **Backend**: Railway or Render (free tiers available)
- **Database**: Included with Railway/Render or free PostgreSQL providers

## 🎯 Prerequisites

- GitHub account (free)
- Netlify account (free - sign up at https://netlify.com)
- Railway account (free - sign up at https://railway.app) OR Render account (free - sign up at https://render.com)
- Stripe account (free)
- Google AI Studio account (free)

## 📋 Step 1: Prepare Your Code

1. **Update Stripe Price IDs** in `server/config/plans.json`:
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

2. **Get all your API keys** (see `API_KEYS_GUIDE.md`)

3. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## 🗄️ Step 2: Deploy Database

### Option A: Railway (Recommended - Easier)

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project** → **Provision PostgreSQL**
3. Wait for database to provision
4. Click on PostgreSQL service → **Variables** tab
5. Copy the `DATABASE_URL` value

### Option B: Render

1. Go to https://render.com and sign up
2. Click **New +** → **PostgreSQL**
3. Fill in database name and select free tier
4. Click **Create Database**
5. Once created, go to **Info** tab → copy **Internal Connection String** (this is your `DATABASE_URL`)

### Option C: Supabase (Free PostgreSQL)

1. Go to https://supabase.com and create account
2. Create new project
3. Go to **Settings** → **Database**
4. Copy connection string from **Connection String** section

## ⚙️ Step 3: Deploy Backend

### Railway Deployment:

1. In Railway dashboard, click **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Railway will detect it's a Node.js project
4. Add these **Environment Variables**:
   ```
   DATABASE_URL=your_database_url_from_step_2
   JWT_SECRET=your_generated_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   CLIENT_ORIGIN=https://your-app.netlify.app (update after frontend deploy)
   CLIENT_SUCCESS_URL=https://your-app.netlify.app?payment=success
   CLIENT_CANCEL_URL=https://your-app.netlify.app?payment=cancelled
   PORT=8080
   NODE_ENV=production
   ```

5. Click on your service → **Settings** tab
6. Set **Root Directory** to: `server`
7. Set **Start Command** to: `npm start`
8. Railway will auto-deploy!
9. Once deployed, copy your Railway service URL (e.g., `https://your-app.up.railway.app`)

### Render Deployment:

1. In Render dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `veo3-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

4. Add **Environment Variables** (same as Railway above)
5. Click **Create Web Service**
6. Once deployed, copy your Render URL (e.g., `https://your-app.onrender.com`)

## 🎨 Step 4: Deploy Frontend to Netlify

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: (leave empty - root is fine)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Click **Show advanced** and add **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app (or .onrender.com)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
   ```

6. Click **Deploy site**
7. Wait for deployment to complete
8. Copy your Netlify URL (e.g., `https://your-app.netlify.app`)

## 🔗 Step 5: Update Backend with Frontend URL

1. Go back to Railway/Render backend settings
2. Update `CLIENT_ORIGIN` to your Netlify URL
3. Update `CLIENT_SUCCESS_URL` and `CLIENT_CANCEL_URL` accordingly
4. Redeploy backend

## 🔔 Step 6: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-backend-url.railway.app/api/payments/stripe-webhook`
4. **Events to listen to**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click **Reveal** on the signing secret
7. Copy the `whsec_...` value
8. Go to Railway/Render backend → Environment Variables
9. Add/Update: `STRIPE_WEBHOOK_SECRET=whsec_your_secret`

## ✅ Step 7: Run Database Migrations

### Railway:
1. Go to your backend service → **Settings** → **Deploy**
2. Click **Open Shell**
3. Run: `npx prisma migrate deploy`

### Render:
1. Go to your web service → **Shell** tab
2. Run: `npx prisma migrate deploy`

## 🧪 Step 8: Test Your Deployment

1. Visit your Netlify URL
2. Test user registration/login
3. Test prompt generation (works even with free tier!)
4. Test payment flow with Stripe test cards:
   - Card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

## 🎉 You're Live!

Your app is now deployed and working! 

## 📝 Notes:

- **Free Tier Limits**: 
  - Railway: 500 hours/month (enough for small apps)
  - Render: Sleeps after 15 min inactivity (wakes on request)
  - Netlify: 100GB bandwidth/month (generous)

- **Gemini Free Tier**: App works perfectly even when quota exceeded!
- **Database**: Free tiers usually include enough storage for thousands of users

## 🔄 Updating Your App

1. Push changes to GitHub
2. Netlify and Railway/Render will auto-deploy
3. That's it!

## 🆘 Troubleshooting

- **Backend not connecting**: Check `VITE_API_BASE_URL` matches your backend URL
- **Payments not working**: Verify Stripe keys and webhook secret
- **Database errors**: Run migrations in Railway/Render shell
- **Build fails**: Check environment variables are set correctly

