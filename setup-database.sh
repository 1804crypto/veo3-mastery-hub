#!/bin/bash

# Database Setup Helper Script
# This script helps you set up your database connection

echo "🗄️  Database Setup Helper"
echo "=========================="
echo ""
echo "This script will help you set up your database."
echo ""

# Check if DATABASE_URL is already set
if [ -f "server/.env" ]; then
    source server/.env
    if [ ! -z "$DATABASE_URL" ] && [[ "$DATABASE_URL" != *"localhost"* ]] && [[ "$DATABASE_URL" != *"user:password"* ]]; then
        echo "✅ DATABASE_URL is already configured in server/.env"
        echo "   Current: ${DATABASE_URL:0:50}..."
        echo ""
        read -p "Do you want to test the connection? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🧪 Testing database connection..."
            cd server
            if npx prisma db pull 2>&1 | grep -q "Introspecting"; then
                echo "✅ Database connection successful!"
                echo ""
                echo "Running migrations..."
                npx prisma migrate dev --name init
                echo ""
                echo "✅ Database setup complete!"
            else
                echo "❌ Database connection failed. Please check your DATABASE_URL."
            fi
            cd ..
        fi
        exit 0
    fi
fi

echo "📋 Database Setup Options:"
echo ""
echo "1. Supabase (Free, Cloud, Recommended) - 2 minutes"
echo "2. Railway (Free, Cloud) - 3 minutes"
echo "3. Render (Free, Cloud) - 3 minutes"
echo "4. Manual (You provide connection string)"
echo ""
read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Setting up Supabase Database..."
        echo ""
        echo "Step 1: Go to https://supabase.com"
        echo "Step 2: Sign up (free)"
        echo "Step 3: Click 'New Project'"
        echo "Step 4: Fill in:"
        echo "   - Project name: veo3-test"
        echo "   - Database password: (create a strong password, save it!)"
        echo "   - Region: Choose closest to you"
        echo "Step 5: Click 'Create new project'"
        echo "Step 6: Wait 2-3 minutes for database to provision"
        echo ""
        echo "Once your project is ready:"
        echo "Step 7: Go to Settings (gear icon) → Database"
        echo "Step 8: Scroll to 'Connection String' section"
        echo "Step 9: Select 'URI' tab"
        echo "Step 10: Copy the connection string"
        echo ""
        read -p "Press Enter when you have the connection string..."
        echo ""
        read -p "Paste your Supabase connection string: " db_url
        echo ""
        echo "Updating server/.env..."
        
        # Update DATABASE_URL in server/.env
        if [ -f "server/.env" ]; then
            # Replace DATABASE_URL line
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            else
                # Linux
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            fi
            echo "✅ DATABASE_URL updated in server/.env"
        else
            echo "DATABASE_URL=$db_url" >> server/.env
            echo "✅ Created server/.env with DATABASE_URL"
        fi
        
        echo ""
        echo "🧪 Testing connection..."
        cd server
        if npx prisma db pull 2>&1 | head -5; then
            echo ""
            echo "Running migrations..."
            npx prisma migrate dev --name init
            echo ""
            echo "✅ Database setup complete!"
        else
            echo "⚠️  Could not test connection. Please verify your connection string."
        fi
        cd ..
        ;;
    2)
        echo ""
        echo "🚀 Setting up Railway Database..."
        echo ""
        echo "Step 1: Go to https://railway.app"
        echo "Step 2: Sign in with GitHub"
        echo "Step 3: Click 'New Project'"
        echo "Step 4: Click 'Provision PostgreSQL'"
        echo "Step 5: Wait for database to provision"
        echo "Step 6: Click on PostgreSQL service → Variables tab"
        echo "Step 7: Copy the DATABASE_URL value"
        echo ""
        read -p "Press Enter when you have the connection string..."
        echo ""
        read -p "Paste your Railway DATABASE_URL: " db_url
        echo ""
        echo "Updating server/.env..."
        
        if [ -f "server/.env" ]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            fi
        else
            echo "DATABASE_URL=$db_url" >> server/.env
        fi
        
        echo "✅ DATABASE_URL updated"
        echo ""
        echo "🧪 Testing connection and running migrations..."
        cd server
        npx prisma migrate dev --name init
        cd ..
        ;;
    3)
        echo ""
        echo "🚀 Setting up Render Database..."
        echo ""
        echo "Step 1: Go to https://render.com"
        echo "Step 2: Sign up"
        echo "Step 3: Click 'New +' → 'PostgreSQL'"
        echo "Step 4: Fill in database name, select free tier"
        echo "Step 5: Click 'Create Database'"
        echo "Step 6: Go to Info tab → Copy 'Internal Connection String'"
        echo ""
        read -p "Press Enter when you have the connection string..."
        echo ""
        read -p "Paste your Render connection string: " db_url
        echo ""
        echo "Updating server/.env..."
        
        if [ -f "server/.env" ]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            fi
        else
            echo "DATABASE_URL=$db_url" >> server/.env
        fi
        
        echo "✅ DATABASE_URL updated"
        echo ""
        echo "🧪 Testing connection and running migrations..."
        cd server
        npx prisma migrate dev --name init
        cd ..
        ;;
    4)
        echo ""
        read -p "Paste your PostgreSQL connection string: " db_url
        echo ""
        echo "Updating server/.env..."
        
        if [ -f "server/.env" ]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" server/.env
            fi
        else
            echo "DATABASE_URL=$db_url" >> server/.env
        fi
        
        echo "✅ DATABASE_URL updated"
        echo ""
        echo "🧪 Testing connection and running migrations..."
        cd server
        npx prisma migrate dev --name init
        cd ..
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: cd server && npm run dev"
echo "2. Start frontend: npm run dev"
echo "3. Open: http://localhost:3000"

