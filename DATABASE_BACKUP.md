# Database Backup Guide

## 🔄 How to Download/Backup Your Database

### Option 1: Using Command Line (pg_dump)

#### Prerequisites:
1. Install PostgreSQL client tools:
   ```bash
   # macOS
   brew install postgresql
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install postgresql-client
   
   # Windows
   # Download from: https://www.postgresql.org/download/windows/
   ```

#### Backup Commands:

##### For Railway Database:
```bash
# Get connection string from Railway Dashboard → PostgreSQL → Variables
# Format: postgres://user:password@host:port/database

# Full backup (everything):
pg_dump "postgres://user:password@host:port/database" > backup.sql

# Backup only schema (structure):
pg_dump "postgres://user:password@host:port/database" --schema-only > schema.sql

# Backup only data:
pg_dump "postgres://user:password@host:port/database" --data-only > data.sql

# Compressed backup:
pg_dump "postgres://user:password@host:port/database" | gzip > backup.sql.gz
```

##### For Render Database:
```bash
# Get Internal Connection String from Render → PostgreSQL → Info tab

# Full backup:
pg_dump "postgres://user:password@host:port/database" > backup.sql

# Backup with compression:
pg_dump "postgres://user:password@host:port/database" | gzip > backup.sql.gz
```

##### For Supabase Database:
```bash
# Get connection string from Supabase → Settings → Database → Connection String

# Full backup:
pg_dump "postgres://user:password@host:port/database" > backup.sql
```

##### For Local Database:
```bash
# If DATABASE_URL is in your .env file:
source server/.env
pg_dump "$DATABASE_URL" > backup.sql

# Or directly:
pg_dump postgresql://localhost:5432/your_database > backup.sql
```

### Option 2: Using Prisma Studio (Visual Browser)

If you just want to view/export data:

```bash
cd server
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all data
- Export individual tables as CSV
- Copy data manually

### Option 3: Using GUI Tools

#### pgAdmin (Free GUI Tool):
1. Download: https://www.pgadmin.org/download/
2. Add connection using your database URL
3. Right-click database → Backup
4. Choose output file and format

#### TablePlus (macOS/Windows):
1. Download: https://tableplus.com/
2. Add PostgreSQL connection
3. Database → Export → Choose format (SQL, CSV, etc.)

#### DBeaver (Free, Cross-platform):
1. Download: https://dbeaver.io/download/
2. Add PostgreSQL connection
3. Right-click database → Tools → Backup Database

### Option 4: Railway/Render Built-in Backup

#### Railway:
1. Go to Railway Dashboard → PostgreSQL service
2. Click on "Backup" tab
3. Create manual backup or set up automatic backups
4. Download backup file

#### Render:
1. Go to Render Dashboard → PostgreSQL
2. Go to "Backups" tab
3. Create backup
4. Download backup file

## 📦 What Gets Backed Up

### Full Backup Includes:
- ✅ Database schema (tables, columns, indexes, etc.)
- ✅ All data (users, subscriptions, prompts, etc.)
- ✅ Sequences
- ✅ Functions
- ✅ Triggers

### Partial Backups:
- **Schema only**: Structure without data (good for migrations)
- **Data only**: Data without structure (good for importing to existing schema)

## 🔄 Restoring from Backup

### Restore Full Backup:
```bash
psql "postgres://user:password@host:port/database" < backup.sql
```

### Restore Compressed Backup:
```bash
gunzip -c backup.sql.gz | psql "postgres://user:password@host:port/database"
```

### Restore to Local Database:
```bash
# Create local database first:
createdb my_local_db

# Restore:
psql my_local_db < backup.sql
```

## 📝 Quick Commands Reference

```bash
# 1. Get your database URL (from Railway/Render/Supabase)

# 2. Full backup:
pg_dump "YOUR_DATABASE_URL" > backup_$(date +%Y%m%d).sql

# 3. Compressed backup:
pg_dump "YOUR_DATABASE_URL" | gzip > backup_$(date +%Y%m%d).sql.gz

# 4. Schema only:
pg_dump "YOUR_DATABASE_URL" --schema-only > schema.sql

# 5. Data only:
pg_dump "YOUR_DATABASE_URL" --data-only > data.sql

# 6. Specific tables only:
pg_dump "YOUR_DATABASE_URL" --table=users --table=subscriptions > specific_tables.sql
```

## 🛠️ For This Project (Using Prisma)

### Export Schema:
```bash
cd server
npx prisma db pull  # Get current schema
npx prisma format   # Format schema.prisma
```

### Export Data:
```bash
cd server
# Using Prisma with pg_dump:
pg_dump "$DATABASE_URL" > backup.sql
```

## ⚠️ Important Notes

1. **Don't share backups publicly** - They contain sensitive user data
2. **Test restore** before deleting original database
3. **Regular backups** - Set up automated backups for production
4. **Secure storage** - Store backups securely (encrypted)
5. **Version control** - Don't commit backups to Git (add to .gitignore)

## 🔒 Security Best Practices

1. **Encrypt backups**:
   ```bash
   pg_dump "DATABASE_URL" | openssl enc -aes-256-cbc -salt -out backup.enc
   ```

2. **Compress and encrypt**:
   ```bash
   pg_dump "DATABASE_URL" | gzip | openssl enc -aes-256-cbc -salt -out backup.sql.gz.enc
   ```

3. **Store securely** - Use secure cloud storage, not public repositories

## 📋 Backup Checklist

- [ ] Full database backup created
- [ ] Schema backup created (optional)
- [ ] Backup file tested (verify restore works)
- [ ] Backup stored in secure location
- [ ] Backup filename includes date
- [ ] Automated backup schedule configured (for production)

