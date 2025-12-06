# 🧪 Local Testing Setup Guide

## Option 1: Use Free Cloud Database (Easiest - Recommended)

### Step 1: Create Free Supabase Database
1. Go to https://supabase.com
2. Sign up (free)
3. Create New Project
4. Wait for database to provision (2-3 minutes)
5. Go to **Settings** → **Database**
6. Copy **Connection String** (URI mode)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password (shown on setup)

### Step 2: Update Database URL
1. Open `server/.env`
2. Replace `DATABASE_URL` with your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 3: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Step 4: Run Database Migrations
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### Step 5: Start Backend Server
```bash
# In server directory
npm run dev
```

Backend will run on `http://localhost:8080`

### Step 6: Start Frontend (New Terminal)
```bash
# In root directory (new terminal window)
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 7: Test!
Open browser: `http://localhost:3000`

---

## Option 2: Install PostgreSQL Locally

### macOS:
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb veo3db

# Update server/.env
DATABASE_URL=postgresql://localhost:5432/veo3db
```

### Linux (Ubuntu/Debian):
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres createdb veo3db

# Update server/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/veo3db
```

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Create database using pgAdmin or command line
4. Update `DATABASE_URL` in `server/.env`

Then follow Steps 3-7 from Option 1 above.

---

## Option 3: Use Docker (If You Install It)

### Install Docker:
- macOS: https://docs.docker.com/desktop/install/mac-install/
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Linux: https://docs.docker.com/desktop/install/linux-install/

### Then:
```bash
cd server

# Create .env file for docker-compose (or use existing)
echo "POSTGRES_USER=veo3user" > .env.docker
echo "POSTGRES_PASSWORD=veo3password" >> .env.docker
echo "POSTGRES_DB=veo3db" >> .env.docker

# Start database only
docker-compose up -d db

# Update server/.env
DATABASE_URL=postgresql://veo3user:veo3password@localhost:5432/veo3db

# Then follow Steps 3-7 from Option 1
```

---

## ✅ Quick Checklist

- [ ] Database created (Supabase/local/Docker)
- [ ] `DATABASE_URL` updated in `server/.env`
- [ ] Dependencies installed (`npm install` in root and `server`)
- [ ] Database migrations run (`npx prisma migrate dev`)
- [ ] Backend started (`cd server && npm run dev`)
- [ ] Frontend started (`npm run dev`)
- [ ] App opens at `http://localhost:3000`

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct in `server/.env`
- For Supabase: Make sure password is replaced (not `[YOUR-PASSWORD]`)
- For local: Make sure PostgreSQL is running

### "Prisma migrate failed"
- Make sure database exists
- Check `DATABASE_URL` is correct
- Try: `npx prisma migrate reset` (⚠️ deletes all data)

### "Port 8080 already in use"
- Another process is using port 8080
- Change `PORT=8080` to another port in `server/.env`
- Update `VITE_API_BASE_URL` in `.env.local` to match

### "Port 3000 already in use"
- Another process is using port 3000
- Vite will auto-use next available port (3001, 3002, etc.)
- Or change port in `vite.config.ts`

---

## 🎉 Once Running

Test these features:
- ✅ Home page loads
- ✅ User registration
- ✅ User login
- ✅ Prompt generation (with Gemini API)
- ✅ Account settings
- ✅ Subscription modal (Stripe integration)

---

## 📝 Notes

- **Supabase free tier** includes 500MB database (perfect for testing)
- **Local database** requires PostgreSQL installation
- **Docker** is easiest if you want everything contained
- All environment variables are already set in `.env` files!

