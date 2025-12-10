# 🚀 Quick Fix Guide

## ✅ Backend is Running!

Your backend server is running on `http://localhost:8080` and responding correctly.

## 🔧 Common Issues & Quick Fixes

### Issue 1: Opening HTML File Directly (file://)

**Problem:** If you open `index-standalone-complete.html` directly from your file system, the browser blocks API requests due to CORS and security policies.

**✅ Solution: Serve the file via HTTP**

**Option A: Using Python (Easiest)**
```bash
# In the project root directory
cd "/Users/freeemall/Downloads/veo3-mastery-hub (3)"
python3 -m http.server 8000
```
Then open: `http://localhost:8000/index-standalone-complete.html`

**Option B: Using Node.js**
```bash
# In the project root directory
npx serve .
```
Then open the URL shown (usually `http://localhost:3000`)

**Option C: Using PHP**
```bash
# In the project root directory
php -S localhost:8000
```
Then open: `http://localhost:8000/index-standalone-complete.html`

### Issue 2: Database Connection Error

**Problem:** Backend returns "Internal server error" when trying to register/login

**✅ Solution: Check Database Connection**

1. **Check if database is configured:**
   ```bash
   cd server
   cat .env | grep DATABASE_URL
   ```

2. **Test database connection:**
   ```bash
   cd server
   npx prisma db push
   ```

3. **If using Supabase:**
   - Make sure the connection string is correct
   - Format: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres`
   - Replace `YOUR_PASSWORD` with your actual password

4. **If database connection fails:**
   - Check your Supabase project is active
   - Verify the password is correct
   - Check network connection

### Issue 3: Missing Environment Variables

**Problem:** Backend needs certain environment variables

**✅ Solution: Check Required Variables**

Make sure `server/.env` has:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Any random string (e.g., `your-secret-key-here`)
- `GEMINI_API_KEY` - Your Gemini API key (optional for testing)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (optional)
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth secret (optional)

### Issue 4: CORS Errors in Browser

**Problem:** Browser console shows CORS errors

**✅ Solution:**
1. Make sure you're accessing the frontend via `http://localhost` (not `file://`)
2. Backend CORS is now configured to allow all localhost ports
3. Restart the backend server if you just updated CORS settings:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   cd server
   npm run dev
   ```

## 🎯 Step-by-Step Setup

### 1. Start Backend Server
```bash
cd server
npm run dev
```
You should see: `🚀 Server is running at http://localhost:8080`

### 2. Check Database Connection
```bash
cd server
npx prisma db push
```
Should show: `Database synchronized` or similar

### 3. Serve Frontend via HTTP
```bash
# In project root
python3 -m http.server 8000
```

### 4. Open in Browser
Open: `http://localhost:8000/index-standalone-complete.html`

### 5. Test the App
- Try to register a new account
- Try to login
- Try to generate a prompt

## 🔍 Debugging Steps

### Check Backend is Running:
```bash
curl http://localhost:8080/health
# Should return: {"ok":true,"message":"Server is healthy"}
```

### Check Backend Logs:
Look at the terminal where you ran `npm run dev` in the server directory. Check for:
- Database connection errors
- Missing environment variable errors
- API errors

### Check Browser Console:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for:
   - CORS errors
   - Network errors
   - JavaScript errors

### Check Network Tab:
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try to register/login
4. Check if API requests are being made
5. Check the response status codes

## 📋 Quick Checklist

- [ ] Backend server running (`npm run dev` in server directory)
- [ ] Database connection working (`npx prisma db push` succeeds)
- [ ] Frontend served via HTTP (not file://)
- [ ] Opening `http://localhost:8000/index-standalone-complete.html`
- [ ] Browser console shows no CORS errors
- [ ] Backend logs show no errors

## 🆘 Still Not Working?

1. **Check backend logs** - Look at the terminal running `npm run dev`
2. **Check browser console** - Look for error messages
3. **Test backend directly** - Use `curl` to test API endpoints
4. **Verify database** - Make sure database is accessible
5. **Check environment variables** - Make sure all required vars are set

## 💡 Pro Tips

1. **Always serve HTML files via HTTP** - Never open them directly (file://)
2. **Check both backend and browser logs** - Errors can be in either place
3. **Test backend independently** - Use `curl` to test API endpoints
4. **Use browser DevTools** - Network and Console tabs are your friends
5. **Restart backend after changes** - Some changes require a restart

## 🎉 Success Indicators

When everything is working:
- ✅ Backend shows: `🚀 Server is running at http://localhost:8080`
- ✅ `curl http://localhost:8080/health` returns success
- ✅ Frontend loads without errors
- ✅ Can register new users
- ✅ Can login
- ✅ Can generate prompts

If you see all of these, you're good to go! 🚀

