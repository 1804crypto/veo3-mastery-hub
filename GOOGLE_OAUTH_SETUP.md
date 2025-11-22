# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for your VEO3 Mastery Hub application.

## Prerequisites

- A Google Cloud Platform (GCP) account
- Access to Google Cloud Console

## Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, Developer contact)
   - Add your email to test users if needed
   - Save and continue
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `VEO3 Mastery Hub` (or your preferred name)
   - **Authorized JavaScript origins**:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - Click **Create**
7. Copy the **Client ID** (it looks like: `xxxxx.apps.googleusercontent.com`)

## Step 2: Configure Environment Variables

### Frontend (`.env.local`)

Add your Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Backend (`server/.env`)

Add your Google Client ID (must match the frontend):

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Step 3: Update Database Schema

The database schema has already been updated to support Google OAuth. If you need to apply migrations:

```bash
cd server
npx prisma generate
npx prisma db push
```

## Step 4: Test Google Sign-In

1. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start your frontend:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`
4. Click "Login" or "Sign Up"
5. Click "Continue with Google"
6. Select your Google account
7. You should be logged in successfully!

## Troubleshooting

### "Google Sign-In is not configured"
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart your frontend server after adding the environment variable

### "Google authentication failed"
- Check that `GOOGLE_CLIENT_ID` is set in `server/.env`
- Verify the Client ID matches in both frontend and backend
- Check that `http://localhost:3000` is in the authorized JavaScript origins

### "Invalid origin"
- Make sure your domain is added to **Authorized JavaScript origins** in Google Cloud Console
- For local development, use `http://localhost:3000`
- For production, use your production domain (e.g., `https://veo3-mastery-hub.vercel.app`)

### "CORS error"
- Check that your backend CORS configuration allows requests from your frontend origin
- For local development, the backend should automatically allow `http://localhost:3000`

## Security Notes

- Never commit your Google Client ID or Client Secret to version control
- Use environment variables for all sensitive configuration
- In production, ensure your authorized origins only include your production domain
- Regularly review and rotate OAuth credentials if needed

## Production Deployment

When deploying to production:

1. Add your production domain to **Authorized JavaScript origins** in Google Cloud Console
2. Update `VITE_GOOGLE_CLIENT_ID` in your production environment variables
3. Update `GOOGLE_CLIENT_ID` in your backend production environment
4. Ensure your backend CORS configuration includes your production domain

## Features

- Users can sign in with their Google account
- Users can also create accounts with email/password
- Google accounts are linked to user profiles automatically
- Existing email/password accounts can be linked to Google accounts

