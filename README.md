# AI Candidate Matcher

An intelligent candidate screening platform that uses AI to match resumes against job descriptions, providing detailed analysis, scoring, and interview question suggestions.

## Features

- 📄 **Resume Analysis**: Upload multiple resumes (PDF, DOCX) for automated screening
- 🎯 **Smart Matching**: AI-powered matching against job requirements
- 📊 **Comprehensive Scoring**: ML-based scoring with detailed breakdowns
- ⚠️ **Red Flag Detection**: Automatic identification of potential concerns
- 💡 **Interview Questions**: AI-generated contextual interview questions
- 📈 **Experience Parsing**: Intelligent extraction of skills and experience
- 🔄 **Analysis History**: Track and compare previous screening sessions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with pg driver
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **File Processing**: pdf-parse, mammoth
- **Validation**: Zod

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API key OR Anthropic API key

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-candidate-matcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Create a local PostgreSQL database:

```bash
# Using psql
createdb ai_candidate_matcher

# Or using PostgreSQL GUI tools like pgAdmin, Postico, etc.
```

### 4. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
AI_PROVIDER=anthropic  # or "openai"

# If using OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini

# If using Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_BASE_URL=https://api.anthropic.com/v1
ANTHROPIC_MODEL=claude-3-5-sonnet-latest

# Database
DATABASE_URL=postgresql://localhost:5432/ai_candidate_matcher
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application automatically creates the required database schema on first run. No manual migrations needed.

**Tables:**
- `jobs` - Job descriptions and metadata
- `analysis_runs` - Analysis session information
- `candidate_evaluations` - Detailed candidate analysis results

## Deployment

### Deploy to Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Install Railway CLI** (optional)
   ```bash
   npm install -g @railway/cli
   ```

3. **Create a new project** on Railway dashboard

4. **Add PostgreSQL database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL`

5. **Deploy the application**:
   - Connect your GitHub repository
   - Railway will auto-detect Next.js and deploy
   - Or use CLI: `railway up`

6. **Set environment variables** in Railway dashboard:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your_key_here
   ANTHROPIC_MODEL=claude-3-5-sonnet-latest
   ```
   (DATABASE_URL is automatically set by Railway)

7. **Access your deployment** via the generated Railway URL

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set up PostgreSQL** (use Railway, Supabase, or Neon)

4. **Configure environment variables** in Vercel dashboard

## Project Structure

```
ai-candidate-matcher/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── analyze/       # Main analysis endpoint
│   │   │   └── history/       # Analysis history
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── file-upload/       # File upload UI
│   │   ├── form/              # Form components
│   │   └── results/           # Results display
│   ├── lib/                   # Core logic
│   │   ├── analysis/          # Analysis algorithms
│   │   ├── experience/        # Experience parsing
│   │   ├── requirements/      # Requirement parsing
│   │   ├── skills/            # Skill extraction
│   │   ├── db.ts              # Database layer
│   │   ├── llm.ts             # AI/LLM integration
│   │   └── matcher.ts         # Matching logic
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
├── .env.example              # Environment template
├── next.config.ts            # Next.js config
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## Usage

1. **Enter Job Description**: Paste the job requirements or upload a JD file
2. **Upload Resumes**: Drag and drop or select multiple resume files
3. **Analyze**: Click "Analyze Candidates" to start the AI screening
4. **Review Results**: View scored candidates with detailed breakdowns
5. **Export/Share**: Use the analysis history for future reference

## API Endpoints

### POST `/api/analyze`
Analyze candidates against a job description.

**Request (multipart/form-data):**
- `jobDescription`: string
- `jobDescriptionFile`: File (optional)
- `resumes`: File[]

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "name": "candidate.pdf",
      "score": 85,
      "summary": "Strong match...",
      "matchedRequirements": [...],
      "missingRequirements": [...],
      "strengths": [...],
      "concerns": [...],
      "extractedSkills": [...],
      "redFlags": [...],
      "interviewQuestions": [...]
    }
  ]
}
```

### GET `/api/history`
Retrieve recent analysis sessions.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_PROVIDER` | Yes | AI provider: "openai" or "anthropic" |
| `OPENAI_API_KEY` | Conditional | Required if AI_PROVIDER=openai |
| `OPENAI_MODEL` | No | Default: gpt-4.1-mini |
| `ANTHROPIC_API_KEY` | Conditional | Required if AI_PROVIDER=anthropic |
| `ANTHROPIC_BASE_URL` | No | Default: https://api.anthropic.com/v1 |
| `ANTHROPIC_MODEL` | No | Default: claude-3-5-sonnet-latest |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Verify database exists: `psql -l`

### AI Provider Errors
- Verify API key is valid and has sufficient credits
- Check rate limits on your AI provider account
- Ensure the model name is correct

### File Upload Issues
- Supported formats: PDF, DOCX
- Maximum file size depends on your deployment platform
- Ensure files are not corrupted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your needs.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
