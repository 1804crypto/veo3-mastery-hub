# 🚀 Quick Start - Local Testing

## Easiest Way: Use Free Supabase Database (2 minutes)

### Step 1: Get Free Database
1. Go to: https://supabase.com
2. Sign up (free)
3. Click **New Project**
4. Fill in:
   - Project name: `veo3-test`
   - Database password: (create a strong password, save it!)
   - Region: Choose closest to you
5. Click **Create new project**
6. Wait 2-3 minutes for database to provision

### Step 2: Get Database Connection String
1. Once project is ready, go to **Settings** (gear icon) → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
   - **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created!

### Step 3: Update Your Environment File
1. Open `server/.env`
2. Replace `DATABASE_URL` line with your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres.xxxxx:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### Step 4: Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Step 5: Set Up Database
```bash
# In server directory
npx prisma generate
npx prisma migrate dev --name init
```

### Step 6: Start Backend (Terminal 1)
```bash
# In server directory
npm run dev
```

You should see: `🚀 Server is running at http://localhost:8080`

### Step 7: Start Frontend (Terminal 2)
```bash
# In root directory (new terminal)
npm run dev
```

You should see: `Local: http://localhost:3000/`

### Step 8: Open App!
Open your browser: **http://localhost:3000** 🎉

---

## ✅ What to Test

1. ✅ Home page loads
2. ✅ Create account (Sign up)
3. ✅ Login
4. ✅ Try prompt generation
5. ✅ Check account settings
6. ✅ View learning journey

---

## 🆘 Problems?

**"Cannot connect to database"**
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check Supabase project is running (green status)

**"Port 8080 in use"**
- Change `PORT=8081` in `server/.env`
- Update `VITE_API_BASE_URL=http://localhost:8081` in `.env.local`

**"Prisma migrate failed"**
- Check `DATABASE_URL` is correct
- Try: `npx prisma migrate reset` (⚠️ deletes data)

