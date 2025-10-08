#!/bin/bash

echo "🚀 CodeBuddy Setup Script"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Warning: Node.js version 20 or higher is recommended. Current version: $(node -v)"
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env.local file
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your:"
    echo "   - Supabase URL and keys"
    echo "   - OpenAI API key"
    echo ""
    echo "Then run: npm run seed"
else
    echo "✅ .env.local exists"
    echo ""
    
    # Ask if user wants to seed the database
    read -p "Would you like to seed the database now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "🌱 Seeding database..."
        npm run seed
        
        if [ $? -eq 0 ]; then
            echo "✅ Database seeded successfully"
        else
            echo "❌ Database seeding failed. Check your Supabase credentials."
        fi
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your .env.local has all required API keys"
echo "2. Run the SQL schema in Supabase (server/db/schema.sql)"
echo "3. Seed the database: npm run seed"
echo "4. Start the development server: npm run dev"
echo ""
echo "Happy coding! 🎉"

