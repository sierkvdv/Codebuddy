# 🎮 CodeBuddy

**Learn to code through interactive games!**

CodeBuddy is a web application designed to teach absolute beginners how to code through engaging, game-like challenges. Travel through themed worlds (If Forest, Loop Lagoon, Function Factory, and more) accompanied by your friendly robot buddy. Each level introduces a coding challenge with immediate AI-powered feedback.

## ✨ Features

- 🌍 **Themed Worlds**: Journey through 5 unique coding worlds
- 🤖 **Robot Buddy**: Visual feedback as your robot reacts to your code
- 💡 **AI Feedback**: Get personalized hints powered by OpenAI
- 🏆 **Progression System**: Earn XP, unlock badges, track your progress
- 📝 **Interactive Editor**: Write and test code in a built-in Monaco editor
- 🎨 **Beautiful UI**: Modern, responsive design with Framer Motion animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: tRPC for type-safe APIs
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API (GPT-4)
- **Code Editor**: Monaco Editor
- **Validation**: Zod

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── worlds/            # World and level routes
│   ├── api/               # API routes (tRPC, AI feedback)
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── server/                # tRPC backend
│   ├── routers/          # API route handlers
│   └── db/               # Database helpers and schema
├── lib/                   # Shared utilities
├── types/                 # TypeScript types and Zod schemas
├── content/               # Seed data (worlds, levels, challenges)
└── scripts/               # Setup and seeding scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase account ([sign up free](https://supabase.com))
- An OpenAI API key ([get one here](https://platform.openai.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codebuddy.git
   cd codebuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   - Go to your Supabase project dashboard
   - Open the SQL Editor
   - Copy and paste the contents of `server/db/schema.sql`
   - Run the SQL script to create all tables and policies

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Beginner Mode

For absolute beginners, CodeBuddy now includes enhanced learning features:

### Quick Setup

1. **Run database migrations**
   ```bash
   # In Supabase SQL Editor, run:
   # scripts/migrations/001_add_beginner_fields.sql
   ```

2. **Configure environment**
   ```bash
   # Fill in .env.local with:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   OPENAI_API_KEY=your_openai_api_key  # Optional for AI hints
   ```

3. **Seed with beginner content**
   ```bash
   npm run seed
   ```

4. **Start learning**
   ```bash
   npm run dev
   # or deploy to Vercel
   ```

### Beginner Features

- 📝 **Starter Code**: Pre-filled code templates to get you started
- 🎯 **Step-by-Step Guide**: Clear instructions broken into simple steps
- 💡 **AI Hints**: Get help without seeing the solution
- 🤖 **Robot Buddy**: Visual feedback as you code
- 🎓 **Onboarding Tour**: Welcome guide for new users
- 🌍 **Simple Language**: No jargon, just clear instructions

## 🎯 How It Works

1. **Choose a World**: Start with If Forest or explore other worlds
2. **Select a Level**: Each level has a coding challenge
3. **Write Code**: Use the Monaco editor to write your solution
4. **Run & Test**: See your robot buddy react to your code in real-time
5. **Submit**: Get AI-powered feedback and hints
6. **Progress**: Earn XP, unlock badges, and master coding!

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database with initial content

### Adding New Content

#### New World

1. Add to `content/worlds.json`
2. Run `npm run seed`

#### New Level

1. Create challenge in `content/challenges.json`
2. Add level to `content/levels.json` referencing the challenge
3. Run `npm run seed`

## 📚 Database Schema

Key tables:
- `users` - User profiles and XP
- `worlds` - Coding worlds (If Forest, Loop Lagoon, etc.)
- `levels` - Individual challenges within worlds
- `challenges` - Challenge prompts, tests, and solutions
- `submissions` - User code submissions
- `user_progress` - Track completed levels and stars
- `badges` - Achievement badges
- `user_badges` - Earned badges per user

See `server/db/schema.sql` for full schema.

## 🔐 Authentication

CodeBuddy uses Supabase Auth with Row Level Security (RLS) policies:
- Users can only read/write their own data
- Public content (worlds, levels) is read-only
- Service role is used for admin operations

## 🤖 AI Feedback

The AI feedback system:
1. Analyzes user code and test results
2. Sends context to OpenAI GPT-4
3. Returns beginner-friendly, encouraging feedback
4. Provides specific hints without giving away solutions

## 🎨 UI Components

Built with shadcn/ui and custom components:
- `WorldCard` - Display world info and progress
- `LevelCard` - Show level details and lock status
- `Editor` - Monaco-based code editor
- `RobotSandbox` - Visual code execution feedback
- `FeedbackPanel` - AI feedback display
- `ProgressHeader` - XP, level, and badge tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

CodeBuddy is a standard Next.js app and can be deployed to any platform that supports Next.js 14+.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [TailwindCSS](https://tailwindcss.com)
- Database by [Supabase](https://supabase.com)
- AI by [OpenAI](https://openai.com)
- Icons from [Lucide](https://lucide.dev)

---

**Happy coding! Learn, play, and grow with CodeBuddy! 🚀**

