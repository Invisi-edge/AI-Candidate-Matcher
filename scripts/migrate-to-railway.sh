#!/bin/bash

# Complete Migration Script
# Exports local database and imports to Railway in one step

set -e

echo "═══════════════════════════════════════════════════════"
echo "  AI Candidate Matcher - Database Migration to Railway"
echo "═══════════════════════════════════════════════════════"
echo ""

# Configuration
LOCAL_DB="ai_candidate_matcher"
LOCAL_USER="bruuu"
LOCAL_HOST="localhost"
TEMP_BACKUP="temp_migration_$(date +%Y%m%d_%H%M%S).sql"

# Step 1: Check local database
echo "📋 Step 1: Checking local database..."
if ! psql -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -c "\dt" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to local database"
    echo "   Make sure PostgreSQL is running and database exists"
    exit 1
fi

# Count records
JOBS_COUNT=$(psql -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -t -c "SELECT COUNT(*) FROM jobs" 2>/dev/null || echo "0")
ANALYSES_COUNT=$(psql -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -t -c "SELECT COUNT(*) FROM analysis_runs" 2>/dev/null || echo "0")
CANDIDATES_COUNT=$(psql -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -t -c "SELECT COUNT(*) FROM candidate_evaluations" 2>/dev/null || echo "0")

echo "✅ Local database connected"
echo "   Jobs: $JOBS_COUNT"
echo "   Analysis runs: $ANALYSES_COUNT"
echo "   Candidate evaluations: $CANDIDATES_COUNT"
echo ""

# Step 2: Export local database
echo "📋 Step 2: Exporting local database..."
pg_dump -h "$LOCAL_HOST" -U "$LOCAL_USER" -d "$LOCAL_DB" -F p --clean --if-exists -f "$TEMP_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Export successful ($(du -h "$TEMP_BACKUP" | cut -f1))"
else
    echo "❌ Export failed!"
    exit 1
fi
echo ""

# Step 3: Get Railway credentials
echo "📋 Step 3: Railway database connection..."
if [ -z "$RAILWAY_DATABASE_URL" ]; then
    echo "⚠️  RAILWAY_DATABASE_URL not found in environment"
    echo ""
    echo "To find your Railway DATABASE_URL:"
    echo "  1. Go to railway.app → Your Project"
    echo "  2. Click on PostgreSQL service"
    echo "  3. Go to 'Variables' tab"
    echo "  4. Copy the DATABASE_URL value"
    echo ""
    read -p "Enter Railway DATABASE_URL: " RAILWAY_DATABASE_URL
fi

if [ -z "$RAILWAY_DATABASE_URL" ]; then
    echo "❌ No DATABASE_URL provided"
    rm -f "$TEMP_BACKUP"
    exit 1
fi
echo ""

# Step 4: Confirm migration
echo "📋 Step 4: Confirm migration..."
echo "⚠️  WARNING: This will:"
echo "   - Drop existing tables in Railway database"
echo "   - Create fresh schema"
echo "   - Import all data from local database"
echo ""
read -p "Continue with migration? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Migration cancelled"
    rm -f "$TEMP_BACKUP"
    exit 0
fi
echo ""

# Step 5: Import to Railway
echo "📋 Step 5: Importing to Railway..."
psql "$RAILWAY_DATABASE_URL" < "$TEMP_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Import successful!"
else
    echo "❌ Import failed!"
    echo "   The backup file is saved at: $TEMP_BACKUP"
    echo "   You can retry manually with:"
    echo "   psql \"<RAILWAY_DATABASE_URL>\" < $TEMP_BACKUP"
    exit 1
fi
echo ""

# Step 6: Verify migration
echo "📋 Step 6: Verifying migration..."
RAILWAY_JOBS=$(psql "$RAILWAY_DATABASE_URL" -t -c "SELECT COUNT(*) FROM jobs" 2>/dev/null || echo "0")
RAILWAY_ANALYSES=$(psql "$RAILWAY_DATABASE_URL" -t -c "SELECT COUNT(*) FROM analysis_runs" 2>/dev/null || echo "0")
RAILWAY_CANDIDATES=$(psql "$RAILWAY_DATABASE_URL" -t -c "SELECT COUNT(*) FROM candidate_evaluations" 2>/dev/null || echo "0")

echo "Railway database:"
echo "   Jobs: $RAILWAY_JOBS (local: $JOBS_COUNT)"
echo "   Analysis runs: $RAILWAY_ANALYSES (local: $ANALYSES_COUNT)"
echo "   Candidate evaluations: $RAILWAY_CANDIDATES (local: $CANDIDATES_COUNT)"
echo ""

# Cleanup
rm -f "$TEMP_BACKUP"

# Summary
echo "═══════════════════════════════════════════════════════"
echo "✅ Migration completed successfully!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Verify data in Railway dashboard → PostgreSQL → Query"
echo "  2. Test your application deployment"
echo "  3. Update environment variables in Railway"
echo ""
