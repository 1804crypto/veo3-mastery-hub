#!/bin/bash

echo "🚀 Starting Render build process..."

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🏗️  Building TypeScript..."
npm run build

echo "✅ Build complete! Server is ready to deploy."
