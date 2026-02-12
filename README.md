# Interview Coder

A comprehensive interview preparation platform for DSA, Low-Level Design, System Design, and Behavioral interviews.

## What is it?

Interview Coder is a full-stack web app that helps you prepare for technical interviews across multiple domains:

- **DSA (Data Structures & Algorithms)**: Solve coding problems with an integrated code editor and test runner
- **LLD (Low-Level Design)**: Practice object-oriented design and design patterns
- **HLD (System Design)**: Draw system architecture diagrams and document design decisions
- **Behavioral**: Prepare answers using the STAR framework

## Key Features

- **Interactive Code Editor**: Write and run TypeScript code with real-time feedback
- **Diagram Drawing**: Design system architectures with Excalidraw integration
- **AI-Powered Hints**: Get Socratic guidance from multiple AI providers (OpenAI, Anthropic, Google, etc.)
- **Spaced Repetition**: Review concepts using Anki-style flashcards and MCQ quizzes
- **Progress Tracking**: Track your progress across all problem categories
- **LeetCode Import**: Import problems directly from LeetCode

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Vite
- **Editor**: Monaco Editor (VS Code), Excalidraw
- **Backend**: Supabase (PostgreSQL, Auth)
- **Deployment**: Vercel
- **AI**: OpenAI, Anthropic, Google Gemini, DeepSeek, Qwen

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interview-coder.git
cd interview-coder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to start using the app.

## Usage

### Solving Problems

1. Select a category (DSA, LLD, HLD, or Behavioral) from the home page
2. Browse problems by difficulty, pattern, or status
3. Click on a problem to open the workspace
4. For DSA/LLD: Write code and run test cases
5. For HLD: Draw system diagrams or write architecture notes
6. For Behavioral: Structure answers using STAR framework

### Using AI Assistance

1. Click the AI chat icon in the problem workspace
2. Configure your AI provider and API key in settings
3. Ask questions and get Socratic hints (no spoilers!)
4. For local development: Use Claude Code, Codex, or Gemini CLI without API keys

### Spaced Repetition Review

1. Navigate to the Review page (`/:category/review`)
2. Review flashcards and answer MCQ questions
3. Rate your recall (Again, Hard, Good, Easy)
4. System schedules next review based on your performance

### Importing LeetCode Problems

1. Go to `/dsa/import`
2. Enter the LeetCode problem slug (e.g., "two-sum")
3. Problem details are automatically fetched and added

## Project Structure

```
interview-coder/
├── src/
│   ├── pages/          # Main routes (Home, Dashboard, ProblemView, etc.)
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks for business logic
│   ├── contexts/       # React contexts (Auth, Category)
│   ├── data/           # Problem datasets (JSON files)
│   └── lib/            # Utilities (Supabase, LeetCode API)
├── server/             # Express server for local AI CLI tools (dev only)
└── supabase/           # Database migrations and config
```

## Development

### Available Commands

```bash
npm run dev              # Start frontend + backend dev servers
npm run dev:frontend     # Start only frontend (Vite)
npm run server           # Start only backend (CLI proxy)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Configuration

- **TypeScript**: Non-strict mode for faster development
- **Vite**: Fast dev server with HMR
- **TailwindCSS**: Utility-first styling with dark theme
- **React Router**: Category-aware routing (`/:category/*`)

## Deployment

The app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables (Supabase URL and key)
4. Deploy

Vercel automatically handles builds and deployments on push to main.

## License

MIT License

---

Built with React 19, TypeScript, and Vite. Deployed on Vercel.
