# 🔐 Authentication Guide

This document covers Google OAuth setup and authentication troubleshooting.

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API

### 2. Create OAuth Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Select **Web application**
4. Configure:
   - **Name:** VEO3 Mastery Hub
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
     - `https://your-netlify-app.netlify.app`
   - **Authorized redirect URIs:** (usually not needed for popup flow)

### 3. Configure Environment Variables

**Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Backend (server/.env):**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Netlify Dashboard:**
- Add `VITE_GOOGLE_CLIENT_ID` to Environment Variables

## Authentication Flow

1. User clicks "Continue with Google"
2. Google popup opens → user selects account
3. Frontend receives access_token
4. Frontend fetches user info from Google's API
5. Frontend sends token + userInfo to backend
6. Backend creates/updates user in database
7. Backend returns JWT cookie
8. User is logged in

## Common Issues

### "Access blocked: This app's request is invalid"
**Cause:** Your origin is not in Google Console's authorized origins
**Fix:** Add your exact URL (including protocol and port) to Authorized JavaScript origins

### "popup_closed_by_user"
**Cause:** User closed the popup, or browser blocked it
**Fix:** Ensure popups are allowed for your site

### "Failed to connect to server"
**Cause:** Backend is unreachable or CORS misconfigured
**Fix:** 
- Check backend is running
- Verify CORS allows your frontend origin

### SecurityError about cross-origin frame
**Cause:** Missing COOP headers
**Fix:** Add to both frontend and backend:
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

## Test Accounts

For testing Pro features, these emails auto-upgrade to Pro:
- `freeemallfilms@gmail.com`
- `testuser1764850225@example.com`
