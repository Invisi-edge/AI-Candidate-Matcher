#!/bin/bash

# Database Export Script
# Exports local PostgreSQL database to a file

set -e

# Configuration
LOCAL_DB="ai_candidate_matcher"
LOCAL_USER="bruuu"
LOCAL_HOST="localhost"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
BACKUP_DIR="./backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting database export..."
echo "📦 Database: $LOCAL_DB"
echo "👤 User: $LOCAL_USER"
echo "💾 Output: $BACKUP_DIR/$BACKUP_FILE"

# Export database
pg_dump -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -F p -f "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Export successful!"
    echo "📁 Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
    echo ""
    echo "File size: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
    echo ""
    echo "To import this backup to Railway, run:"
    echo "  ./scripts/import-db.sh $BACKUP_DIR/$BACKUP_FILE"
else
    echo "❌ Export failed!"
    exit 1
fi
