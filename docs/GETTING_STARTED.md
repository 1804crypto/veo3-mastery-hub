# 🚀 Getting Started with VEO3 Mastery Hub

This guide covers everything you need to run and develop VEO3 Mastery Hub locally.

## Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL database (or Supabase account)
- Google Cloud Console account (for OAuth)
- Stripe account (for payments)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/1804crypto/veo3-mastery-hub.git
cd veo3-mastery-hub
npm install
cd server && npm install
```

### 2. Environment Setup

Create `.env` in root:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Create `server/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secure-random-string
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your-gemini-api-key
STRIPE_SECRET_KEY=sk_test_...
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 4. Run Development Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
veo3-mastery-hub/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── lib/                # Utilities (API client, query client)
│   └── types/              # TypeScript types
├── server/                 # Backend Express app
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, rate limiting, etc.
│   │   └── utils/          # Gemini AI, email, etc.
│   └── prisma/             # Database schema
└── docs/                   # Documentation
```

## Common Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run tests

# Backend
cd server
npm run dev          # Start backend
npm run build        # Build for production
npx prisma studio    # Database GUI
```

## Troubleshooting

### "Failed to connect to server"
- Ensure backend is running on port 5000
- Check CORS settings in `server/src/index.ts`

### Google Login "Access blocked"
- Add your URL to Google Cloud Console → Authorized Origins
- Both `http://localhost:3000` AND `http://127.0.0.1:3000`

### Database connection fails
- Verify DATABASE_URL in server/.env
- Run `npx prisma db push` to sync schema
