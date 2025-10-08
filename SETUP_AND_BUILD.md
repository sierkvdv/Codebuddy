# CodeBuddy - Setup and Build Notes

## Final Deliverables

The CodeBuddy project includes everything needed for quick setup and deployment.

---

## 📦 Included Files

### `setup.sh` - Automated Setup Script

**Purpose**: One-command setup that handles all installation and configuration.

**What it does:**
1. ✅ Checks Node.js installation and version
2. ✅ Installs all npm dependencies (`npm install`)
3. ✅ Creates `.env.local` from embedded template
4. ✅ Guides through database migration (Supabase)
5. ✅ Seeds initial data using `scripts/seed.ts`
6. ✅ Starts the development server (`npm run dev`)

**Usage:**
```bash
chmod +x setup.sh  # Make executable (if needed)
bash setup.sh
```

**Features:**
- ✅ Executable shell script
- ✅ Error handling with clear messages
- ✅ Interactive prompts for manual steps
- ✅ Automatic environment file creation
- ✅ Database setup verification
- ✅ Comprehensive status messages

---

### `POST_BUILD.md` - Concise Setup Guide

**Purpose**: Quick reference for running the project in Cursor or any local environment.

**Steps Covered:**
1. Unzip the repository
2. Run `bash setup.sh` to install and configure
3. Edit `.env.local` with your credentials
4. Run database schema in Supabase SQL Editor
5. Start development server with `npm run dev`

**Target Audience:**
- Developers setting up locally
- Users in Cursor IDE
- Quick start for contributors

---

### Environment Variables

**Template** (embedded in `setup.sh`):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI API Key (Optional)
OPENAI_API_KEY=
```

**Security Notes:**
- ✅ `NEXT_PUBLIC_*` variables are safe for client-side use
- ✅ `OPENAI_API_KEY` is **only used in server code** (API routes)
- ✅ Never expose sensitive keys client-side
- ✅ `.env.local` is gitignored by default
- ✅ Template is created automatically by `setup.sh`

**Required Variables:**
1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxx.supabase.co`
   - Found: Supabase Dashboard → Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Supabase anonymous/public key
   - Safe to expose client-side (RLS protects data)
   - Found: Supabase Dashboard → Settings → API

**Optional Variables:**
3. **OPENAI_API_KEY**
   - OpenAI API key for GPT-4 feedback
   - Used only in `app/api/ai/feedback/route.ts`
   - If omitted, app uses intelligent mock feedback
   - Format: `sk-...`

---

## 🚀 Setup Process

### Automated Setup (Recommended)

```bash
# 1. Navigate to project
cd codebuddy

# 2. Run setup script
bash setup.sh

# The script will:
# - Install dependencies
# - Create .env.local template
# - Prompt for database setup
# - Seed initial data
# - Start dev server
```

### Manual Setup (Alternative)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
EOF

# 3. Edit .env.local with your credentials
nano .env.local  # or use your preferred editor

# 4. Set up database
# → Open Supabase SQL Editor
# → Run server/db/schema.sql

# 5. Seed database
npm run seed

# 6. Start development server
npm run dev
```

---

## 📊 Database Setup

### Supabase Migration Process

The project uses Supabase (PostgreSQL) with a comprehensive schema.

**Steps:**

1. **Create Supabase Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Set name, password, region
   - Wait for project to initialize

2. **Run SQL Schema**
   - Open SQL Editor in Supabase
   - Create new query
   - Copy **all contents** of `server/db/schema.sql`
   - Paste and execute

3. **Verify Tables Created**
   - Check Table Editor
   - Should see 9 tables:
     - `profiles`
     - `worlds`
     - `levels`
     - `challenges`
     - `submissions`
     - `progress`
     - `badges`
     - `user_badges`
     - `ai_feedback_logs`

4. **Verify RLS Enabled**
   - Check Authentication → Policies
   - Each table should have policies listed

**Schema Features:**
- ✅ 9 tables with proper relationships
- ✅ 12 indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Enums for status fields
- ✅ JSONB for flexible data (blocks, test cases)
- ✅ Triggers for auto-profile creation

---

## 🌱 Data Seeding

### Seed Script: `scripts/seed.ts`

**Purpose**: Populates database with initial content.

**What it seeds:**
- ✅ 5 themed worlds (If Forest, Loop Lagoon, etc.)
- ✅ 10 levels across worlds
- ✅ 10 coding challenges with test cases
- ✅ 7 achievement badges

**Running Manually:**
```bash
npm run seed
```

**Requirements:**
- ✅ `.env.local` configured with Supabase credentials
- ✅ Database schema already applied
- ✅ Supabase project active (not paused)

**Output:**
```
🌍 Seeding worlds...
✅ Seeded 5 worlds

📚 Seeding levels...
✅ Seeded 10 levels

🎯 Seeding challenges...
✅ Seeded 10 challenges

🏆 Seeding badges...
✅ Seeded 7 badges

✨ Database seeding completed successfully!
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev      # Start dev server (http://localhost:3000)

# Production
npm run build    # Build optimized production bundle
npm run start    # Start production server

# Quality
npm run lint     # Run ESLint code checks

# Database
npm run seed     # Seed database with initial data

# Setup
bash setup.sh    # Complete automated setup
```

---

## ⚙️ Configuration Files

### `package.json`
- Dependencies: All required npm packages
- Scripts: dev, build, start, lint, seed
- Node version: 20+

### `tsconfig.json`
- TypeScript configuration
- Strict mode enabled
- Path aliases configured (@/...)

### `tailwind.config.ts`
- TailwindCSS configuration
- Custom colors and theme
- shadcn/ui compatible

### `next.config.js`
- Next.js 14 configuration
- React strict mode enabled
- SWC minification

---

## 🔒 Security Considerations

### Client-Side Safety
- ✅ Only `NEXT_PUBLIC_*` variables exposed to client
- ✅ RLS prevents unauthorized data access
- ✅ Input validation on all forms
- ✅ XSS protection (React auto-escaping)

### Server-Side Safety
- ✅ `OPENAI_API_KEY` only in API routes
- ✅ Service role key never exposed
- ✅ Code sandbox prevents dangerous execution
- ✅ SQL injection protection (parameterized queries)

### Best Practices
- ✅ `.env.local` in `.gitignore`
- ✅ Environment variables validated at runtime
- ✅ Error messages don't leak sensitive info
- ✅ HTTPS required in production

---

## 📱 Platform Support

### Development
- ✅ macOS (bash, zsh)
- ✅ Linux (bash)
- ✅ Windows (Git Bash, WSL)

### Deployment
- ✅ Vercel (recommended, one-click)
- ✅ Any Node.js hosting (Netlify, Railway, etc.)
- ✅ Docker containers
- ✅ Self-hosted (VPS, EC2, etc.)

---

## 🎯 Post-Setup Verification

After running `setup.sh`, verify everything works:

### 1. Application Loads
```
✅ http://localhost:3000 shows landing page
✅ No console errors
✅ Styles load correctly
```

### 2. Database Connected
```
✅ Sign up creates new account
✅ Profile auto-created
✅ Worlds display on /worlds
```

### 3. Features Work
```
✅ Can navigate to challenge
✅ Can write and run code
✅ Can submit solution
✅ Receives feedback (AI or mock)
✅ XP awarded on completion
```

### 4. API Endpoints
```
✅ tRPC endpoints respond
✅ AI feedback works (or mock fallback)
✅ Progress tracking updates
```

---

## 🐛 Common Issues

### Setup Script Won't Run

**Symptom**: "Permission denied" or "command not found"

**Solution**:
```bash
# Make executable
chmod +x setup.sh

# Run with bash explicitly
bash setup.sh
```

### Node Version Too Old

**Symptom**: "Node.js 20+ is recommended"

**Solution**:
```bash
# Install Node.js 20+ from https://nodejs.org
# Or use nvm:
nvm install 20
nvm use 20
```

### Database Connection Fails

**Symptom**: "Connection error" during seed

**Solution**:
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Confirm schema.sql was executed
4. Check for typos in environment variables

### OpenAI Not Working

**Symptom**: Generic feedback instead of AI feedback

**Solution**:
- This is expected if `OPENAI_API_KEY` is not set
- App works perfectly with mock feedback
- To enable AI: Add valid OpenAI key to `.env.local`

---

## 📦 Distribution

When distributing the project:

1. **Include**:
   - ✅ All source code
   - ✅ `setup.sh` script
   - ✅ `POST_BUILD.md` guide
   - ✅ `server/db/schema.sql`
   - ✅ `content/*.json` seed data
   - ✅ All documentation (*.md files)

2. **Exclude**:
   - ❌ `node_modules/`
   - ❌ `.env.local` or `.env`
   - ❌ `.next/` build folder
   - ❌ Any secrets or credentials

3. **Zip Structure**:
   ```
   codebuddy.zip
   ├── app/
   ├── components/
   ├── server/
   ├── lib/
   ├── types/
   ├── content/
   ├── scripts/
   ├── setup.sh          ← Executable
   ├── POST_BUILD.md     ← Quick start
   ├── README.md         ← Full docs
   └── package.json
   ```

---

## ✅ Setup Checklist

Before distributing or deploying:

- [ ] `setup.sh` is executable (`chmod +x setup.sh`)
- [ ] `POST_BUILD.md` has clear instructions
- [ ] `server/db/schema.sql` is complete
- [ ] `scripts/seed.ts` works correctly
- [ ] `.env.local` is gitignored
- [ ] `.env.example` template is documented
- [ ] All dependencies in `package.json`
- [ ] Documentation is up to date
- [ ] Test clean install: `bash setup.sh` works

---

**The CodeBuddy project is fully configured for easy setup and deployment!** 🚀

