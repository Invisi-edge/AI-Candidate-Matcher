# Database Migration Scripts

Scripts to help migrate your local PostgreSQL database to Railway.

## Quick Start

### Full Migration (Recommended)

Run the complete migration in one command:

```bash
./scripts/migrate-to-railway.sh
```

This script will:
1. Check your local database connection
2. Export all data
3. Connect to Railway
4. Import data
5. Verify the migration

### Manual Migration

If you prefer to do it step-by-step:

**1. Export local database:**
```bash
./scripts/export-db.sh
```
This creates a backup file in `./backups/`

**2. Import to Railway:**
```bash
./scripts/import-db.sh backups/backup_YYYYMMDD_HHMMSS.sql
```

## Prerequisites

- PostgreSQL client tools installed (`psql`, `pg_dump`)
- Local database running
- Railway project with PostgreSQL service created

## Environment Variables

### For Railway Import

Set your Railway database URL:

```bash
export RAILWAY_DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"
```

Or the script will prompt you to enter it.

## Finding Your Railway Database URL

1. Go to [railway.app](https://railway.app)
2. Open your project
3. Click on the PostgreSQL service
4. Go to "Variables" tab
5. Copy the `DATABASE_URL` value

## Troubleshooting

### "psql: command not found"

Install PostgreSQL client tools:

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

### "Permission denied"

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### "Cannot connect to local database"

Ensure PostgreSQL is running:
```bash
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

### "Authentication failed"

Check your local PostgreSQL user and database:
```bash
psql -l  # List all databases
\du      # List all users
```

Update the script variables if needed (edit `scripts/migrate-to-railway.sh`):
```bash
LOCAL_DB="ai_candidate_matcher"
LOCAL_USER="your_username"
```

## Safety Notes

- Backups are stored in `./backups/` (excluded from git)
- Migration scripts use `--clean --if-exists` flags to avoid conflicts
- Always verify the migration before deleting local data
- Keep at least one backup file before deleting old ones

## Manual Commands

If you prefer manual control:

**Export:**
```bash
pg_dump -h localhost -U bruuu -d ai_candidate_matcher > backup.sql
```

**Import:**
```bash
psql "postgresql://postgres:PASSWORD@HOST:PORT/railway" < backup.sql
```

**Verify:**
```bash
psql "postgresql://postgres:PASSWORD@HOST:PORT/railway" -c "\dt"
psql "postgresql://postgres:PASSWORD@HOST:PORT/railway" -c "SELECT COUNT(*) FROM jobs"
```
