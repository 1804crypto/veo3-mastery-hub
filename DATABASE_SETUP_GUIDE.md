# 🗄️ Database Setup Guide

## Quick Setup (Recommended: Supabase - 2 minutes)

I can help you set up the database! Here are your options:

### Option 1: Interactive Setup Script (Easiest)

Run this command and follow the prompts:
```bash
./setup-database.sh
```

This will guide you through:
1. Choosing a database provider
2. Getting your connection string
3. Updating your `.env` file
4. Running migrations automatically

---

### Option 2: Manual Setup - Supabase (Free, Recommended)

#### Step 1: Create Supabase Account
1. Go to: **https://supabase.com**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (easiest) or email
4. Verify your email if needed

#### Step 2: Create Database Project
1. Click **"New Project"**
2. Fill in:
   - **Organization**: Create new or select existing
   - **Name**: `veo3-test` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. Wait 2-3 minutes for database to provision

#### Step 3: Get Connection String
1. Once project is ready, click **Settings** (gear icon, bottom left)
2. Click **Database** (left menu)
3. Scroll to **"Connection string"** section
4. Click **"URI"** tab
5. Copy the connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
   - **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password!

#### Step 4: Update Your .env File

**I can do this for you!** Just paste your connection string here and I'll update it.

Or manually:
1. Open `server/.env`
2. Find the line: `DATABASE_URL=postgres://...`
3. Replace it with your Supabase connection string (with password replaced)

#### Step 5: Run Migrations

**I can do this for you!** Just tell me when your DATABASE_URL is set.

Or manually:
```bash
cd server
npx prisma migrate dev --name init
```

---

### Option 3: Railway (Free, Easy)

1. Go to: **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Click **"Provision PostgreSQL"**
5. Wait for database to provision
6. Click on PostgreSQL service → **Variables** tab
7. Copy the `DATABASE_URL` value
8. Paste it in `server/.env` as `DATABASE_URL=...`
9. Run migrations: `cd server && npx prisma migrate dev --name init`

---

### Option 4: Render (Free)

1. Go to: **https://render.com**
2. Sign up
3. Click **"New +"** → **"PostgreSQL"**
4. Fill in database name, select free tier
5. Click **"Create Database"**
6. Go to **Info** tab → Copy **"Internal Connection String"**
7. Paste it in `server/.env` as `DATABASE_URL=...`
8. Run migrations: `cd server && npx prisma migrate dev --name init`

---

## 🚀 What I Can Do For You

Once you have your connection string, I can:

1. ✅ Update `server/.env` with your DATABASE_URL
2. ✅ Test the database connection
3. ✅ Run migrations automatically
4. ✅ Verify everything is working

**Just paste your connection string and I'll set it up!**

---

## 📝 Quick Test

After setup, test the connection:

```bash
cd server
npx prisma db pull
```

If this works, your database is connected! 🎉

---

## ⚠️ Important Notes

- **Free tiers** are perfect for testing (Supabase, Railway, Render all offer free tiers)
- **Connection strings** contain passwords - keep them secure
- **Don't commit** `.env` files to Git (they're already in .gitignore)
- **Replace `[YOUR-PASSWORD]`** in Supabase connection strings with your actual password

---

## 🆘 Need Help?

Tell me:
- "I'm creating a Supabase account" → I'll guide you step-by-step
- "I have my connection string" → Paste it and I'll set it up
- "I'm using Railway/Render" → I'll help you get the connection string

