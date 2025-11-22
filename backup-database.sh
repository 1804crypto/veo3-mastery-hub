#!/bin/bash

# Database Backup Script
# Usage: ./backup-database.sh [DATABASE_URL]

echo "🔄 Database Backup Script"
echo "=========================="
echo ""

# Check if DATABASE_URL is provided as argument or in .env file
if [ -z "$1" ]; then
    # Try to load from server/.env file
    if [ -f "server/.env" ]; then
        source server/.env
    elif [ -f ".env" ]; then
        source .env
    fi
fi

# Use provided URL or from environment
DB_URL="${1:-$DATABASE_URL}"

if [ -z "$DB_URL" ]; then
    echo "❌ Error: DATABASE_URL not found!"
    echo ""
    echo "Usage:"
    echo "  ./backup-database.sh [DATABASE_URL]"
    echo ""
    echo "Or set DATABASE_URL in server/.env file"
    echo ""
    echo "Example:"
    echo "  ./backup-database.sh postgres://user:password@host:5432/database"
    exit 1
fi

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump not found!"
    echo ""
    echo "Install PostgreSQL client tools:"
    echo ""
    echo "  macOS:"
    echo "    brew install postgresql"
    echo ""
    echo "  Linux (Ubuntu/Debian):"
    echo "    sudo apt-get install postgresql-client"
    echo ""
    echo "  Windows:"
    echo "    Download from: https://www.postgresql.org/download/windows/"
    exit 1
fi

# Create backups directory
mkdir -p backups

# Generate filename with date
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${DATE}.sql"
COMPRESSED_FILE="backups/backup_${DATE}.sql.gz"

echo "📦 Creating backup..."
echo "   Database: $DB_URL"
echo "   File: $BACKUP_FILE"
echo ""

# Create backup
if pg_dump "$DB_URL" > "$BACKUP_FILE" 2>&1; then
    echo "✅ Backup created successfully!"
    echo "   Location: $BACKUP_FILE"
    echo "   Size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo ""
    
    # Ask if user wants compressed version
    read -p "Create compressed backup? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Compressing backup..."
        gzip -c "$BACKUP_FILE" > "$COMPRESSED_FILE"
        echo "✅ Compressed backup created!"
        echo "   Location: $COMPRESSED_FILE"
        echo "   Size: $(du -h "$COMPRESSED_FILE" | cut -f1)"
        echo ""
        
        # Ask if user wants to remove uncompressed version
        read -p "Remove uncompressed backup? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$BACKUP_FILE"
            echo "🗑️  Removed uncompressed backup"
        fi
    fi
    
    echo ""
    echo "🎉 Backup complete!"
    echo "   Files saved in: backups/"
else
    echo "❌ Backup failed!"
    echo "   Check your DATABASE_URL and connection"
    exit 1
fi

