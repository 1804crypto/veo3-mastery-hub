# Google Sign-In Configuration Guide

## Current Status
- ✅ Email/Password Signup: **Working**
- ✅ Email/Password Login: **Working**
- ✅ Logout: **Working**
- ❌ Google Sign-In: **Needs Configuration**

## Why Google Sign-In Isn't Working

The error "Can't continue with google.com - Something went wrong" occurs because the Google OAuth app needs authorized origins configured for localhost.

## How to Fix Google Sign-In

### Step 1: Access Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Sign in with your Google account
3. Select your project (or create a new one)

### Step 2: Enable Google+ API
1. Go to **APIs & Services → Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: VEO3 Mastery Hub
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue**
5. Skip scopes (click **Save and Continue**)
6. Add test users if in testing mode (add the Google email you want to test with)
7. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client ID**
3. Choose **Web application**
4. Name it: "VEO3 Mastery Hub Local"
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
7. Click **Create**
8. **Copy the Client ID** shown in the popup

### Step 5: Update Your Environment Variables
1. Open `.env` file in the root directory
2. Update the line:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
   ```
3. Save the file
4. Restart the frontend dev server:
   ```bash
   # Stop the current dev server (Ctrl+C)
   npm run dev
   ```

### Step 6: Test Google Sign-In
1. Refresh http://localhost:3000
2. Click **Login**
3. Click **Continue with Google**
4. Sign in with your Google account
5. ✅ You should now be logged in!

## For Production Deployment

When deploying to production (Netlify), add these authorized origins:
- `https://veo3-mastery-hub.netlify.app`

And update the `VITE_GOOGLE_CLIENT_ID` environment variable in Netlify with the production OAuth client ID.

## Troubleshooting

**Error: "This app isn't verified"**
- This is normal for apps in testing mode
- Click "Advanced" → "Go to VEO3 Mastery Hub (unsafe)" to proceed
- To remove this warning, submit your app for verification (not needed for development)

**Error: "redirect_uri_mismatch"**
- Make sure you added the exact URLs to authorized origins and redirect URIs
- Wait 5-10 minutes after saving for changes to propagate

**Error: "Access blocked"**
- Add your email as a test user in OAuth consent screen
- Make sure the OAuth consent screen is configured
