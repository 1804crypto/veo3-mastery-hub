# 🌐 Deployment Guide

Complete guide for deploying VEO3 Mastery Hub to production.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Netlify      │────▶│     Render      │────▶│    Supabase     │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Step 1: Database (Supabase)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database** → **Connection string**
4. Copy the URI (use "Transaction pooler" for production)
5. Save as `DATABASE_URL`

## Step 2: Backend (Render)

1. Create account at [render.com](https://render.com)
2. New → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `veo3-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secure-random-string
   GOOGLE_CLIENT_ID=your-google-client-id
   GEMINI_API_KEY=your-gemini-api-key
   STRIPE_SECRET_KEY=sk_live_...
   CLIENT_ORIGIN=https://your-app.netlify.app
   NODE_ENV=production
   ```
6. Deploy

Copy your Render URL (e.g., `https://veo3-backend.onrender.com`)

## Step 3: Frontend (Netlify)

1. Create account at [netlify.com](https://netlify.com)
2. New site → Import from Git
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-render-url.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```
5. Deploy

## Step 4: Post-Deployment

### Update Google OAuth

Add your production URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-app.netlify.app`

### Update CORS

Ensure backend allows your frontend origin in `server/src/index.ts`:
```typescript
allowedOrigins: [
  'https://your-app.netlify.app',
  // ... other origins
]
```

### Run Database Migrations

```bash
cd server
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

## Monitoring

- **Render Dashboard:** View backend logs
- **Netlify Dashboard:** View deploy logs
- **Supabase Dashboard:** View database queries

## Costs (Estimated)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Netlify | 100GB bandwidth | $19/mo |
| Render | Sleeps after 15min | $7/mo |
| Supabase | 500MB storage | $25/mo |

**Recommended for MVP:** Stay on free tiers, upgrade Render to $7/mo when you have paying users.

## Troubleshooting

### Backend returns 503
- Render free tier sleeps after 15min
- First request takes 30-60s to wake
- Solution: Upgrade to Starter plan

### CORS errors
- Check `CLIENT_ORIGIN` in Render matches your Netlify URL exactly
- Include protocol: `https://`

### Database connection timeouts
- Use Supabase's "Transaction pooler" connection string
- Not the "Direct Connection"
