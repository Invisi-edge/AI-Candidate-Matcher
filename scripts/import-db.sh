#!/bin/bash

# Database Import Script
# Imports SQL backup to Railway PostgreSQL database

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified"
    echo "Usage: ./scripts/import-db.sh <backup-file.sql>"
    echo ""
    echo "Example:"
    echo "  ./scripts/import-db.sh backups/backup_20260413_120000.sql"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if RAILWAY_DATABASE_URL is set
if [ -z "$RAILWAY_DATABASE_URL" ]; then
    echo "⚠️  RAILWAY_DATABASE_URL not found in environment"
    echo ""
    echo "Please provide your Railway PostgreSQL connection string:"
    echo "(Find it in Railway dashboard → PostgreSQL → Variables → DATABASE_URL)"
    echo ""
    read -p "Enter DATABASE_URL: " RAILWAY_DATABASE_URL
fi

echo "🚀 Starting database import..."
echo "📦 Source file: $BACKUP_FILE"
echo "🎯 Target: Railway PostgreSQL"
echo ""
echo "⚠️  WARNING: This will overwrite existing data in the Railway database!"
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Import cancelled"
    exit 0
fi

# Import to Railway
psql "$RAILWAY_DATABASE_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Import successful!"
    echo ""
    echo "Your data has been migrated to Railway."
    echo "Verify the import in Railway dashboard → PostgreSQL → Query"
else
    echo "❌ Import failed!"
    exit 1
fi
