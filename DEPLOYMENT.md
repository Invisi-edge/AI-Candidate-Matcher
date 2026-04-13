# Deployment Guide

This guide covers deploying the AI Candidate Matcher to Railway.

## Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app))
- AI API key (OpenAI or Anthropic)

## Environment Variables

Configure these in your Railway project settings:

### Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Auto-provided by Railway | PostgreSQL connection string (auto-set when you add PostgreSQL service) |
| `AI_PROVIDER` | `anthropic` | Choose "openai" or "anthropic" |

### AI Provider Variables (choose one)

**For Anthropic (recommended):**
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_BASE_URL=https://api.anthropic.com/v1
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

**For OpenAI:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

## Railway Deployment Steps

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `ai-candidate-matcher` repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically:
   - Provision a PostgreSQL instance
   - Create a `DATABASE_URL` environment variable
   - Link it to your application

### Step 3: Configure Environment Variables

1. Click on your application service (not the database)
2. Go to "Variables" tab
3. Add the following variables:

**For Anthropic:**
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_actual_key_here
ANTHROPIC_BASE_URL=https://api.anthropic.com/v1
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

**For OpenAI:**
```
AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_key_here
OPENAI_MODEL=gpt-4.1-mini
```

4. Click "Add" for each variable

### Step 4: Deploy

Railway will automatically:
1. Detect Next.js project
2. Install dependencies (`npm install`)
3. Build the application (`npm run build`)
4. Start the server (`npm start`)

The deployment will be live at: `https://your-project.up.railway.app`

### Step 5: Verify Database Schema

The application automatically creates the required database tables on first run. To verify:

1. Go to your PostgreSQL service in Railway
2. Click "Query" tab (or use Railway CLI with `railway run psql`)
3. Run:
   ```sql
   \dt
   ```
4. You should see: `jobs`, `analysis_runs`, `candidate_evaluations`

## Database Migration (Local to Railway)

If you have existing data in your local PostgreSQL and want to migrate it to Railway:

### Option 1: Using pg_dump (Recommended)

1. **Export local database:**
   ```bash
   pg_dump -h localhost -U bruuu -d ai_candidate_matcher -F c -f local_backup.dump
   ```

2. **Get Railway database credentials:**
   - In Railway, click on PostgreSQL service
   - Copy the connection string from Variables tab

3. **Import to Railway:**
   ```bash
   pg_restore -d "postgresql://postgres:PASSWORD@HOST:PORT/railway" -c local_backup.dump
   ```

### Option 2: Using SQL Export

1. **Export local data:**
   ```bash
   pg_dump -h localhost -U bruuu -d ai_candidate_matcher > local_data.sql
   ```

2. **Import to Railway:**
   ```bash
   psql "postgresql://postgres:PASSWORD@HOST:PORT/railway" < local_data.sql
   ```

### Option 3: Using Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Link to project:**
   ```bash
   cd /Users/bruuu/Desktop/ai-candidate-matcher
   railway link
   ```

3. **Run migration:**
   ```bash
   # Export from local
   pg_dump -h localhost -U bruuu -d ai_candidate_matcher > backup.sql

   # Import to Railway
   railway run psql < backup.sql
   ```

## Monitoring and Logs

### View Deployment Logs
1. In Railway dashboard, click on your service
2. Go to "Deployments" tab
3. Click on the latest deployment to see logs

### View Runtime Logs
1. Click on your service
2. Go to "Logs" tab
3. Filter by severity (info, error, etc.)

### Database Metrics
1. Click on PostgreSQL service
2. Go to "Metrics" tab
3. Monitor connections, queries, and storage

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check `package.json` dependencies
- Ensure all dependencies are in `dependencies`, not `devDependencies`

**Error: Build timeout**
- Railway has a 10-minute build timeout
- Optimize build by removing unnecessary files

### Runtime Errors

**Error: Cannot connect to database**
- Verify `DATABASE_URL` is set
- Check PostgreSQL service is running
- Ensure database and app are in the same Railway project

**Error: AI API key invalid**
- Verify `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is correct
- Check API key has sufficient credits
- Ensure `AI_PROVIDER` matches the key you're using

**Error: 502 Bad Gateway**
- Check application logs for startup errors
- Verify `npm start` command works locally
- Ensure PORT is not hardcoded (Railway provides PORT env var)

### Database Issues

**Tables not created**
- The app auto-creates tables on first run
- Check logs for any database errors during startup
- Manually connect to DB and verify schema

**Connection pool exhausted**
- Default pool size is usually sufficient
- If needed, set `PG_POOL_SIZE` environment variable

## Scaling and Performance

### Horizontal Scaling
Railway supports horizontal scaling in paid plans:
1. Go to your service settings
2. Increase replica count

### Database Scaling
1. Click on PostgreSQL service
2. Go to "Settings" → "Resources"
3. Upgrade plan for more storage/connections

### Optimization Tips
- Enable Next.js caching
- Use CDN for static assets
- Monitor database query performance
- Consider connection pooling with PgBouncer for high traffic

## Cost Estimation

### Railway Costs (as of 2026)
- **Free Trial**: $5 worth of resources
- **Hobby Plan**: ~$5-10/month for small apps
- **Database**: Included in usage-based pricing

### AI API Costs
- **Anthropic Claude**: ~$3-15 per 1M tokens (varies by model)
- **OpenAI GPT-4**: ~$2-10 per 1M tokens (varies by model)

Monitor your AI usage to control costs.

## Security Best Practices

1. **Never commit secrets**: Always use environment variables
2. **Rotate API keys**: Periodically update AI API keys
3. **Use HTTPS**: Railway provides SSL by default
4. **Limit API access**: Set rate limits if needed
5. **Monitor logs**: Check for unusual activity
6. **Backup database**: Use Railway's automatic backups or pg_dump

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Domains" tab
3. Click "Add Domain"
4. Follow instructions to add CNAME record

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Quick Reference Commands

```bash
# Railway CLI
railway login
railway link
railway logs
railway run <command>
railway open  # Open project in browser

# Database backup
pg_dump -h HOST -U USER -d DB > backup.sql
psql -h HOST -U USER -d DB < backup.sql

# Check deployment
curl https://your-app.up.railway.app/api/health
```

## Health Check Endpoint (Optional)

Consider adding a health check endpoint for monitoring:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
```

This allows you to monitor your deployment with:
```bash
curl https://your-app.up.railway.app/api/health
```
