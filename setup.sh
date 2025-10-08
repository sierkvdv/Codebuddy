#!/bin/bash

# CodeBuddy Setup Script
# This script installs dependencies, sets up the database, seeds data, and starts the dev server

set -e  # Exit on error

echo "================================================"
echo "🤖 CodeBuddy - Automated Setup"
echo "================================================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Warning: Node.js 20+ is recommended. Current version: $(node -v)"
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1/4: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Check for .env file
echo "🔐 Step 2/4: Checking environment configuration..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  No .env.local or .env file found"
    echo "📝 Creating .env.local template..."
    
    # Create .env.local with template
    cat > .env.local << 'EOF'
# Supabase Configuration
# Get these from: https://app.supabase.com → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI API Key (Optional)
# Get from: https://platform.openai.com/api-keys
# Note: If not provided, the app will use mock AI feedback
OPENAI_API_KEY=
EOF
    
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: You must edit .env.local with your credentials:"
    echo "   1. NEXT_PUBLIC_SUPABASE_URL"
    echo "   2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   3. OPENAI_API_KEY (optional - mock fallback available)"
    echo ""
    echo "Then run the following manually:"
    echo "   1. Run the SQL schema in your Supabase SQL Editor:"
    echo "      → Open server/db/schema.sql"
    echo "      → Copy and paste into Supabase SQL Editor"
    echo "      → Execute the SQL"
    echo "   2. Run: npm run seed"
    echo "   3. Run: npm run dev"
    echo ""
    exit 0
else
    echo "✅ Environment file found"
fi
echo ""

# Step 3: Database migrations
echo "🗄️  Step 3/4: Setting up database..."
echo ""
echo "⚠️  MANUAL STEP REQUIRED:"
echo "Before continuing, ensure you have:"
echo "   1. Created a Supabase project"
echo "   2. Opened the SQL Editor in Supabase"
echo "   3. Run the contents of server/db/schema.sql"
echo ""
echo "Have you completed the database setup? (y/n)"
read -r db_response

if [[ ! "$db_response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please complete the database setup:"
    echo "   1. Go to https://app.supabase.com"
    echo "   2. Open your project → SQL Editor"
    echo "   3. Copy contents of server/db/schema.sql"
    echo "   4. Paste and execute in SQL Editor"
    echo "   5. Re-run this script: bash setup.sh"
    exit 0
fi

# Step 4: Seed database
echo ""
echo "🌱 Step 4/4: Seeding database with initial data..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Database seeding failed"
    echo "Please check:"
    echo "   - Your .env.local has correct Supabase credentials"
    echo "   - You ran the schema.sql in Supabase SQL Editor"
    echo "   - Your Supabase project is active (not paused)"
    exit 1
fi

echo ""
echo "================================================"
echo "✨ Setup Complete!"
echo "================================================"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "The app will be available at:"
echo "   → http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "================================================"
echo ""

# Start development server
npm run dev

