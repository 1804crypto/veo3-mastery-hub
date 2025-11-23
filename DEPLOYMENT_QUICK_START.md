# Quick Deployment Guide 🚀

**5-Minute Setup for Netlify + Render**

---

## Prerequisites ✅

- [ ] Code pushed to GitHub
- [ ] Netlify account: https://netlify.com
- [ ] Render account: https://render.com
- [ ] All API keys ready (see `.env` files)

---

## Part 1: Deploy Backend (Render) - 3 minutes

1. **Create Web Service:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo

2. **Configure:**
   ```
   Name: veo3-mastery-hub-api
   Root Directory: server
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables:**
   Copy from `server/.env`:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=5000`

4. **Deploy!** 
   - Click "Create Web Service"
   - Copy your URL: `https://your-app.onrender.com`

---

## Part 2: Deploy Frontend (Netlify) - 2 minutes

1. **Create Site:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub repo

2. **Configure:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL=https://veo3-mastery-hub-api.onrender.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_GOOGLE_CLIENT_ID=675312284371-...
   VITE_GEMINI_API_KEY=AIzaSyBzm8lIg2Tjhw6b2uVEuoDvAXLUjKqKHuQ
   ```

4. **Deploy!**
   - Click "Deploy site"
   - Copy your URL: `https://your-site.netlify.app`

---

## Part 3: Connect Frontend & Backend - 30 seconds

1. **Update Render Environment:**
   - Add these variables in Render:
   ```
   CLIENT_ORIGIN=https://veo3-mastery-hub.netlify.app
   CLIENT_SUCCESS_URL=https://veo3-mastery-hub.netlify.app?payment=success
   CLIENT_CANCEL_URL=https://veo3-mastery-hub.netlify.app?payment=cancelled
   ```

2. **Save** (triggers auto-redeploy)

---

## Part 4: Update External Services

### Google OAuth (1 minute)
1. Go to https://console.cloud.google.com
2. Add to Authorized origins:
   - `https://your-netlify-site.netlify.app`

### Stripe Webhook (1 minute)
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint:
   - URL: `https://your-render-url.onrender.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
3. Copy signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Render

---

## Testing ✅

1. **Frontend:** Visit `https://your-netlify-site.netlify.app`
2. **Backend:** Visit `https://your-render-url.onrender.com/health`
3. **Test:**
   - [ ] Login with Google
   - [ ] View videos
   - [ ] Make a test payment

---

## Done! 🎉

Your app is live!

**See `COMPLETE_DEPLOYMENT_GUIDE.md` for:**
- Detailed troubleshooting
- Monitoring & maintenance
- Advanced configuration
- Custom domains

---

## Support

- **Issues?** Check `COMPLETE_DEPLOYMENT_GUIDE.md` → Troubleshooting
- **Render Logs:** Dashboard → Your Service → Logs
- **Netlify Logs:** Dashboard → Deploys → Latest deploy
