# 🔧 Troubleshooting Guide

## Backend Server is Running ✅

Your backend server is running and responding correctly at `http://localhost:8080`.

## Common Issues & Solutions

### Issue 1: "Cannot connect to server" Error

**Problem:** Frontend can't connect to backend

**Solutions:**

1. **Check if you're opening the HTML file correctly:**
   - ❌ **Wrong:** Opening `index-standalone-complete.html` directly (file://)
   - ✅ **Correct:** Serve it via a web server

   **Quick Fix - Use Python:**
   ```bash
   # In the project root directory
   python3 -m http.server 8000
   # Then open: http://localhost:8000/index-standalone-complete.html
   ```

   **Or use Node.js:**
   ```bash
   npx serve .
   # Then open the URL shown (usually http://localhost:3000)
   ```

2. **Check API_BASE_URL in the HTML file:**
   - Open `index-standalone-complete.html`
   - Find the configuration script (around line 139-144)
   - Make sure it says: `window.API_BASE_URL = 'http://localhost:8080';`

3. **Check browser console:**
   - Open browser Developer Tools (F12)
   - Check Console tab for errors
   - Look for CORS errors or network errors

### Issue 2: CORS Errors

**Problem:** Browser blocks requests due to CORS policy

**Solution:** The backend is configured to allow localhost. If you see CORS errors:
1. Make sure you're accessing the frontend via `http://localhost` (not `file://`)
2. Check that the backend is running on port 8080
3. Verify CORS settings in `server/src/index.ts`

### Issue 3: "API server is not configured" Error

**Problem:** API_BASE_URL is not set in the HTML file

**Solution:**
1. Open `index-standalone-complete.html`
2. Find the configuration script at the top (around line 139-144)
3. Make sure it includes:
   ```html
   <script>
     window.API_BASE_URL = 'http://localhost:8080';
     window.STRIPE_PUBLISHABLE_KEY = 'your-stripe-key';
     window.GOOGLE_CLIENT_ID = 'your-google-client-id';
   </script>
   ```

### Issue 4: Authentication Not Working

**Problem:** Can't sign up or login

**Solutions:**

1. **Check database connection:**
   ```bash
   cd server
   npx prisma db push
   ```

2. **Check backend logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for database connection errors
   - Check for missing environment variables

3. **Test backend directly:**
   ```bash
   # Test registration
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123456"}'
   ```

### Issue 5: Prompt Generation Not Working

**Problem:** Can't generate prompts

**Solutions:**

1. **Check Gemini API key:**
   - Make sure `GEMINI_API_KEY` is set in `server/.env`
   - Verify the key is valid

2. **Check backend logs:**
   - Look for API errors in the terminal
   - Check for quota exceeded errors

3. **Test backend endpoint:**
   ```bash
   # First, get an auth token by logging in
   # Then test prompt generation
   curl -X POST http://localhost:8080/api/generate-prompt \
     -H "Content-Type: application/json" \
     -H "Cookie: token=your-auth-token" \
     -d '{"idea":"A beautiful sunset over the ocean"}'
   ```

## Quick Diagnostic Commands

### Check if backend is running:
```bash
curl http://localhost:8080/health
# Should return: {"ok":true,"message":"Server is healthy"}
```

### Check if port 8080 is in use:
```bash
lsof -ti:8080
# Should show a process ID
```

### Check backend logs:
```bash
# In the server directory
npm run dev
# Watch for errors in the terminal
```

### Test database connection:
```bash
cd server
npx prisma db push
# Should show: "Database synchronized"
```

## Step-by-Step Verification

1. ✅ **Backend is running**
   ```bash
   curl http://localhost:8080/health
   ```

2. ✅ **Frontend is served via HTTP (not file://)**
   - Use `python3 -m http.server 8000` or `npx serve`
   - Open `http://localhost:8000/index-standalone-complete.html`

3. ✅ **API_BASE_URL is configured**
   - Check the configuration script in the HTML file
   - Should be: `window.API_BASE_URL = 'http://localhost:8080';`

4. ✅ **Database is connected**
   ```bash
   cd server
   npx prisma db push
   ```

5. ✅ **Environment variables are set**
   - Check `server/.env` has all required variables
   - Especially: `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`

## Still Having Issues?

1. **Check browser console:**
   - Open Developer Tools (F12)
   - Check Console and Network tabs
   - Look for error messages

2. **Check backend logs:**
   - Look at the terminal running `npm run dev`
   - Check for error messages

3. **Test backend directly:**
   ```bash
   # Health check
   curl http://localhost:8080/health
   
   # Test registration (should work even without frontend)
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123456"}'
   ```

4. **Verify CORS settings:**
   - Backend allows `http://localhost:3000`, `http://localhost:5173`, and `http://localhost:8000`
   - If using a different port, update `server/src/index.ts`

## Quick Start Checklist

- [ ] Backend server running (`npm run dev` in server directory)
- [ ] Database connected (test with `npx prisma db push`)
- [ ] Frontend served via HTTP (not file://)
- [ ] API_BASE_URL configured in HTML file
- [ ] Browser console shows no errors
- [ ] Backend logs show no errors

## Need More Help?

Check these files:
- `START_BACKEND.md` - How to start the backend
- `LOCAL_TESTING.md` - Complete local testing guide
- `QUICK_START_LOCAL.md` - Quick start guide

