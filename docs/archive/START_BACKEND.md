# 🚀 Quick Start: Backend Server

## Step 1: Check if server is already running
```bash
# Check if port 8080 is in use
lsof -ti:8080

# If something is running, test it
curl http://localhost:8080/health
```

## Step 2: Install Dependencies (if needed)
```bash
cd server
npm install
```

## Step 3: Check Environment Variables
Make sure `server/.env` has:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret string (generate one if missing)
- `GEMINI_API_KEY` - Your Gemini API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key (optional for testing)
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth secret (optional)

## Step 4: Setup Database
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

## Step 5: Start the Server

### Option A: Development Mode (with auto-reload)
```bash
cd server
npm run dev
```

### Option B: Production Mode (build first)
```bash
cd server
npm run build
npm start
```

## Step 6: Verify Server is Running
```bash
# Should return: {"ok":true,"message":"Server is healthy"}
curl http://localhost:8080/health
```

## 🔧 Troubleshooting

### "Port 8080 already in use"
```bash
# Kill the process using port 8080
kill -9 $(lsof -ti:8080)

# Or change the port in server/.env
PORT=8081
```

### "Cannot connect to database"
- Check `DATABASE_URL` in `server/.env`
- Make sure database is running (Supabase/local PostgreSQL)
- Test connection: `npx prisma db push`

### "Module not found"
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"
```bash
cd server
npx prisma generate
```

## ✅ Success Indicators

When the server starts successfully, you should see:
```
🚀 Server is running at http://localhost:8080
```

And `curl http://localhost:8080/health` should return:
```json
{"ok":true,"message":"Server is healthy"}
```

## 📝 Next Steps

1. Backend running on `http://localhost:8080` ✅
2. Frontend should use `API_BASE_URL=http://localhost:8080`
3. Test authentication endpoints
4. Test prompt generation

