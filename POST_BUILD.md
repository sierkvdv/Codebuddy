# CodeBuddy - Quick Start Guide

This guide will help you run CodeBuddy locally in Cursor or any development environment.

## Prerequisites

- Node.js 20+ ([download here](https://nodejs.org))
- A Supabase account ([sign up free](https://supabase.com))
- (Optional) OpenAI API key ([get one here](https://platform.openai.com/api-keys))

---

## Setup Steps

### 1. Unzip the Repository

Extract the CodeBuddy project to your desired location.

### 2. Run the Setup Script

Open a terminal in the project root and run:

```bash
bash setup.sh
```

This script will:
- ✅ Install all npm dependencies
- ✅ Check your Node.js version
- ✅ Create `.env.local` from template
- ✅ Guide you through database setup
- ✅ Seed the database with initial content
- ✅ Start the development server

### 3. Configure Environment Variables

Create a `.env.local` file in the project root with the following content:

```env
# Supabase Configuration
# Get these from: https://app.supabase.com → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI API Key (Optional)
# Get from: https://platform.openai.com/api-keys
# Note: If not provided, the app will use mock AI feedback
OPENAI_API_KEY=
```

**Then fill in your credentials:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
OPENAI_API_KEY=sk-your_openai_key_here
```

**Where to find these:**

- **Supabase URL & Key**: 
  1. Go to [app.supabase.com](https://app.supabase.com)
  2. Select your project
  3. Go to Settings → API
  4. Copy `Project URL` and `anon public` key

- **OpenAI API Key** (optional):
  1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  2. Create a new API key
  3. **Note**: If you don't provide this key, the app will use mock AI feedback

### 4. Set Up the Database

**Important**: You must manually run the SQL schema in Supabase:

1. Open [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Open `server/db/schema.sql` from this project
6. Copy the **entire contents** of that file
7. Paste into the Supabase SQL Editor
8. Click **Run** or press `Ctrl+Enter`

You should see success messages indicating all tables were created.

### 5. Start Development Server

If the setup script is still running, the server is already started.

If not, run:

```bash
npm run dev
```

The application will be available at:
**http://localhost:3000**

---

## Manual Setup (Alternative)

If you prefer to run commands manually instead of using the setup script:

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Set up database
# Run server/db/schema.sql in Supabase SQL Editor

# 4. Seed database
npm run seed

# 5. Start development server
npm run dev
```

---

## Verification

After setup, verify everything works:

1. **Open the app**: http://localhost:3000
2. **Sign up**: Create a new account
3. **Check profile**: Your profile should be auto-created
4. **Browse worlds**: Click "Start Your Adventure"
5. **Try a challenge**: Click "If Forest" → "The First Decision"
6. **Submit code**: Write a solution and submit
7. **Check feedback**: You should receive AI feedback (or mock if no OpenAI key)

---

## Troubleshooting

### Setup Script Fails

**Issue**: `bash: ./setup.sh: Permission denied`

**Solution**: Make the script executable:
```bash
chmod +x setup.sh
bash setup.sh
```

### Database Seeding Fails

**Issue**: "Connection error" or "Invalid credentials"

**Solution**:
1. Check your `.env.local` has correct Supabase credentials
2. Verify you ran `schema.sql` in Supabase SQL Editor
3. Ensure your Supabase project is active (not paused)

### OpenAI Errors

**Issue**: AI feedback not working

**Solution**:
- If you don't have an OpenAI key, that's OK! The app will use mock feedback
- If you have a key but it's not working:
  1. Verify `OPENAI_API_KEY` is set in `.env.local`
  2. Check you have API credits at [platform.openai.com/account/billing](https://platform.openai.com/account/billing)

### Port 3000 Already in Use

**Issue**: "Port 3000 is already in use"

**Solution**: Run on a different port:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors

**Issue**: Import errors or missing modules

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
codebuddy/
├── app/              # Next.js pages and routes
├── components/       # React components
├── server/          # Backend (tRPC, database)
├── lib/             # Utilities
├── types/           # TypeScript types
├── content/         # Seed data (JSON)
├── scripts/         # Setup and seed scripts
├── .env.local       # Your environment variables (create this!)
└── server/db/schema.sql  # Database schema (run in Supabase)
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
npm run seed     # Seed database with initial data
```

---

## Next Steps

Once everything is running:

1. 🎮 **Play the game**: Complete challenges and earn XP
2. 📚 **Read the docs**: Check `README.md` for detailed documentation
3. 🛠️ **Customize**: Add new challenges in `content/challenges.json`
4. 🚀 **Deploy**: When ready, deploy to Vercel or your preferred platform

---

## Support

For more detailed information:
- **Full Documentation**: See `README.md`
- **API Reference**: See `API_ROUTES.md`
- **Component Guide**: See `COMPONENT_DOCUMENTATION.md`
- **Architecture**: See `ARCHITECTURE.md`

---

**Enjoy teaching the world to code with CodeBuddy! 🤖✨**
