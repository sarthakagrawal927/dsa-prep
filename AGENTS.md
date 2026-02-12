# Interview Coder - AI Agent Context

## Project Overview

**Interview Coder** is a comprehensive, full-stack interview preparation platform supporting multiple interview categories: DSA (Data Structures & Algorithms), LLD (Low-Level Design), HLD (High-Level Design/System Design), and Behavioral interviews. Built with React 19, TypeScript, Vite, and Supabase, featuring an integrated AI advisor powered by multiple LLM providers.

**Primary Purpose**: Provide a unified, interactive workspace for interview preparation with code execution, diagram drawing, spaced repetition learning (Anki-style), MCQ quizzes, and AI-assisted problem-solving.

**Current Project State**: Production-ready application deployed on Vercel with full authentication, multi-category support, and AI integration. The project is actively maintained with regular updates to AI models and feature enhancements.

---

## Table of Contents

1. [Architectural Evolution](#architectural-evolution)
2. [Core Architecture](#core-architecture)
3. [File Structure & Locations](#file-structure--locations)
4. [Key Technical Patterns](#key-technical-patterns)
5. [Development Guidelines](#development-guidelines)
6. [Common Tasks & Workflows](#common-tasks--workflows)
7. [Technical Decisions & Rationale](#technical-decisions--rationale)
8. [Coding Conventions](#coding-conventions)
9. [Testing & Debugging](#testing--debugging)
10. [Deployment & Production](#deployment--production)

---

## Architectural Evolution

Understanding the commit history helps you make changes that align with existing patterns.

### Phase 1: Foundation (Initial - Feb 7)
- **Initial commit**: Started as "DSA Prep Studio" with Blind 75 problems
- Pure React + Vite setup with basic problem-solving interface
- Single-category focus on DSA problems

### Phase 2: Feature Expansion (Feb 7-8)
- **Code execution engine**: Added TypeScript executor using Sucrase
- **LeetCode integration**: Import problems directly from LeetCode, open in LeetCode button
- **Syntax highlighting**: Monaco Editor integration for code editing
- **Auto-save**: Debounced code persistence to localStorage
- **Mobile responsive**: Fixed horizontal scroll issues, improved mobile UX

### Phase 3: TypeScript Migration & AI (Feb 8)
- **Full TypeScript conversion**: Migrated entire codebase from JavaScript
- **AI Advisor Panel**: Integrated multiple AI providers (OpenAI, Anthropic, Google)
- **Provider expansion**: Added DeepSeek and Qwen support
- **Model updates**: Regular updates to latest AI models (GPT-4.5, Claude Opus 4.6, Gemini 3)

### Phase 4: Authentication & Review System (Feb 8-9)
- **Supabase auth**: Google OAuth with guest mode fallback
- **Anki review system**: Spaced repetition for Anki cards
- **MCQ quiz mode**: Multiple-choice questions integrated into review flow
- **Local CLI server**: Express proxy for Claude Code, Codex, Gemini CLI tools
- **Import workflow**: Simplified to one-click, session-only imported problems

### Phase 5: Multi-Category Architecture (Feb 9)
- **Major refactor**: Overhauled to support 4 interview categories (DSA, LLD, HLD, Behavioral)
- **Unified Problem type**: Single interface with optional category-specific fields
- **Category-aware routing**: Dynamic `/:category/*` routes with CategoryProvider context
- **Data organization**: Separate JSON files per category with lazy loading
- **Conditional UI**: Category-specific features (code editor for DSA/LLD, diagrams for HLD)

### Phase 6: UX Enhancements (Feb 9-10)
- **Resizable panels**: React-resizable-panels for code/diagram workspace
- **DiagramEditor**: Lazy-loaded Excalidraw with localStorage persistence
- **Code/Draw toggle**: Exclusive to HLD category for system design diagrams
- **Pattern resources**: Added learning materials (articles, videos, courses) to patterns
- **Pattern navigation**: Clickable badges link to Patterns page with pre-expanded sections
- **Resource links**: Direct access to learning materials from ProblemView

### Phase 7: Developer Experience (Feb 9-10)
- **CLI bridge submodule**: Replaced inline server with git submodule for AI proxy
- **Build optimization**: Hide local CLI providers in production builds
- **TypeScript cleanup**: Fixed pre-existing errors (useRef types, missing imports)
- **Icon standardization**: Replaced text names with emojis, deduplicated icons

### Phase 8: Content & AI Enhancements (Feb 10-12)
- **HLD MCQ cards**: Added multiple-choice questions for system design
- **Diagram text extraction**: Convert Excalidraw diagrams to text for AI context
- **API key privacy**: Added disclaimer in AI settings about key storage
- **Data expansion**: Renamed to "interview-coder", populated all category datasets

---

## Core Architecture

### Technology Stack

#### Frontend
- **React 19**: Latest features and performance improvements
- **TypeScript**: Type-safe development with flexible strictness (`strict: false`)
- **Vite**: Lightning-fast dev server and optimized builds
- **TailwindCSS v4**: Utility-first styling with dark theme
- **React Router v7**: Category-aware routing

#### UI Components
- **Monaco Editor**: VS Code-powered code editor (lazy-loaded)
- **Excalidraw**: Interactive diagram drawing (lazy-loaded)
- **Lucide React**: Consistent icon set
- **React Resizable Panels**: Split-pane workspace

#### Backend & Services
- **Supabase**: Authentication, PostgreSQL database, real-time sync
- **Express**: Local CLI proxy server for AI providers (dev only)
- **Vercel**: Deployment platform with edge functions

#### Development Tools
- **ESLint**: Code quality and consistency
- **Sucrase**: Fast TypeScript-to-JavaScript transpilation for code execution
- **npm**: Package management

---

## File Structure & Locations

### Directory Tree

```
/Users/sarthakagrawal/Desktop/swe-interview-prep/
├── src/
│   ├── pages/                     # Route components (React Router)
│   │   ├── Home.tsx               # Category selection landing page
│   │   ├── Dashboard.tsx          # Problem list with filters, search, pattern grouping
│   │   ├── Patterns.tsx           # Pattern browser with expandable cards and resources
│   │   ├── ProblemView.tsx        # Main workspace (code editor, diagram, AI chat, test runner)
│   │   ├── AnkiReview.tsx         # Spaced repetition review with Anki cards and MCQs
│   │   ├── ImportProblem.tsx      # LeetCode problem import via slug
│   │   └── Login.tsx              # Authentication page
│   ├── components/                # Reusable UI components
│   │   ├── Layout.tsx             # Navigation bar, category switcher, auth UI
│   │   └── DiagramEditor.tsx      # Lazy-loaded Excalidraw wrapper with localStorage
│   ├── hooks/                     # Custom React hooks (business logic)
│   │   ├── useProblems.ts         # Problem data management, lazy loading, custom problems
│   │   ├── useProgress.ts         # Progress tracking, notes, bookmarks (localStorage + Supabase)
│   │   ├── useAI.ts               # Multi-provider AI chat, SSE streaming, config management
│   │   ├── useCodeExecution.ts    # Run TypeScript code with Sucrase, handle test cases
│   │   ├── useSpacedRepetition.ts # SM-2 algorithm for Anki review scheduling
│   │   ├── useNotes.ts            # Per-problem notes with localStorage persistence
│   │   └── useSpeechRecognition.ts # Speech-to-text for behavioral interview practice
│   ├── contexts/                  # React contexts (global state)
│   │   ├── AuthContext.tsx        # Supabase auth, Google OAuth, guest mode
│   │   └── CategoryContext.tsx    # Extracts category from URL params, provides to children
│   ├── data/                      # Problem datasets (JSON)
│   │   ├── problems.json          # DSA problem set (Blind 75 + extended) - BUNDLED
│   │   ├── lld-problems.json      # Low-level design problems (OOP, design patterns)
│   │   ├── hld-problems.json      # System design problems (scalability, architecture)
│   │   ├── behavioral-problems.json # Behavioral interview questions (STAR framework)
│   │   └── mcq-cards.ts           # Multiple-choice quiz questions
│   ├── lib/                       # Utilities and integrations
│   │   ├── supabase.ts            # Supabase client initialization
│   │   ├── leetcode.ts            # LeetCode API integration for problem import
│   │   └── diagramToText.ts       # Convert Excalidraw diagrams to text for AI context
│   ├── types.ts                   # TypeScript type definitions (single source of truth)
│   ├── App.tsx                    # Root component, routing, auth guard
│   └── main.tsx                   # Entry point, BrowserRouter, AuthProvider wrapper
├── server/                        # Express CLI proxy (dev only)
│   ├── index.mjs                  # SSE streaming server for local AI providers
│   └── package.json               # Server dependencies (express, cors)
├── supabase/                      # Supabase configuration and migrations
│   └── migrations/                # Database schema migrations
├── public/                        # Static assets
├── dist/                          # Production build output (generated)
├── node_modules/                  # Dependencies (generated)
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.js                 # Vite build configuration
├── eslint.config.js               # ESLint configuration
├── vercel.json                    # Vercel deployment configuration
├── .env.local                     # Environment variables (Supabase credentials)
├── .gitignore                     # Git ignore rules
├── AGENTS.md                      # This file (AI agent documentation)
└── README.md                      # Human-readable project documentation
```

### Key Files and Their Roles

#### Core Application Files

**`src/main.tsx`** - Application entry point
- Initializes React app with React 19's `createRoot`
- Wraps app in `BrowserRouter` for routing
- Provides `AuthProvider` for authentication context
- Renders `App` component

**`src/App.tsx`** - Root component and routing
- Defines all application routes using React Router v7
- Top-level route structure: `/:category/*` for category-aware routing
- Auth guard logic for protected routes
- Imports `CategoryRoutes` component for nested category routes

**`src/types.ts`** - Single source of truth for TypeScript types
- All interfaces and types defined here
- `Problem` interface: Unified type with optional category-specific fields
- `ProblemsData` interface: Container for patterns and problems
- `CategoryConfig` interface: Category metadata (icon, color, feature flags)
- Constants: `CATEGORIES` array with all category configs
- Helper functions: `getCategoryConfig(id)`

#### Context Providers

**`src/contexts/AuthContext.tsx`** - Authentication state management
- Supabase authentication with Google OAuth
- Guest mode fallback (no login required)
- User state management
- Auth methods: `signIn()`, `signOut()`, `user` object
- Session persistence across page reloads

**`src/contexts/CategoryContext.tsx`** - Category-aware routing
- Extracts current category from URL params
- Provides `category` to all child components via `useCategory()` hook
- Used by all pages to determine which category data to load
- Validates category exists in `CATEGORIES` array

#### Custom Hooks (Business Logic)

**`src/hooks/useProblems.ts`** - Problem data management
- **Lazy loading**: DSA bundled by default, other categories loaded on demand
- **Data cache**: Module-level cache prevents re-fetching (`dataCache`)
- **Custom problems**: Module-level store using `useSyncExternalStore`
- **Supabase sync**: Load imported problems from database on mount
- Key functions:
  - `getById(id)`: Find problem by ID
  - `getBySlug(slug)`: Find problem by LeetCode slug
  - `getByPattern(patternId)`: Filter problems by pattern
  - `search(query)`: Search problems by title, pattern, or difficulty
  - `getPatternStats()`: Calculate problem count per pattern
  - `getAllAnkiCards()`: Extract all Anki cards with metadata
  - `addCustomProblem(problem)`: Add imported problem to store and Supabase

**`src/hooks/useProgress.ts`** - Progress tracking
- **localStorage**: Primary storage for progress data
- **Supabase**: Optional sync for authenticated users
- Track problem status: Not Started, In Progress, Completed, Reviewing
- Store per-problem: code, notes, language selection, bookmark status
- Debounced saves to prevent excessive writes
- Key functions:
  - `getStatus(problemId)`: Get problem status
  - `setStatus(problemId, status)`: Update problem status
  - `toggleBookmark(problemId)`: Toggle bookmark flag
  - `getNotes(problemId)`: Get problem notes
  - `setNotes(problemId, notes)`: Save problem notes

**`src/hooks/useAI.ts`** - Multi-provider AI chat
- **Providers supported**:
  - **Local CLI** (dev only): claude-code, codex, gemini-cli
  - **API-based**: openai, anthropic, google, deepseek, qwen
- **SSE streaming**: Server-Sent Events for real-time responses
- **Config persistence**: localStorage for API keys and model selection
- **Chat history**: Per-problem chat history (localStorage for guests, Supabase for users)
- **System prompt**: Pre-configured tutor persona (no full solutions, Socratic hints)
- Key functions:
  - `ask(userMessage, config, systemContext, signal)`: Send message and stream response
  - `clearMessages()`: Clear chat history for current problem
  - State: `messages`, `isStreaming`, `error`

**`src/hooks/useCodeExecution.ts`** - Code execution engine
- **Sucrase transpiler**: Convert TypeScript to JavaScript
- **Isolated evaluation**: Run code in try-catch with limited scope
- **Test case runner**: Execute code against predefined test cases
- **Error handling**: Display syntax errors and runtime errors
- Key functions:
  - `runCode(code, testCases?)`: Execute code and return results
  - State: `output`, `isRunning`, `error`

**`src/hooks/useSpacedRepetition.ts`** - Anki review system
- **SM-2 algorithm**: Calculates next review date based on recall quality
- **Review states**: New, Learning, Reviewing
- **Ease factor**: Adjusts difficulty based on performance
- **Interval calculation**: Exponential backoff for successful reviews
- Key functions:
  - `getDueCards()`: Get cards due for review today
  - `recordReview(cardId, quality)`: Update card state after review
  - `getNextReviewDate(cardId)`: Calculate next review date

**`src/hooks/useNotes.ts`** - Per-problem notes
- **localStorage persistence**: Auto-save notes with debouncing
- **Markdown support**: Notes rendered as Markdown
- Key functions:
  - `notes`: Current problem notes
  - `setNotes(text)`: Update notes
  - `clearNotes()`: Delete notes for current problem

#### Pages (React Router Routes)

**`src/pages/Home.tsx`** - Category selection
- Route: `/`
- Displays 4 category cards (DSA, LLD, HLD, Behavioral)
- Category metadata: icon, name, description, color
- Navigates to `/:category` on card click

**`src/pages/Dashboard.tsx`** - Problem list
- Route: `/:category`
- Displays filterable, searchable problem list
- Features:
  - Filter by difficulty (Easy, Medium, Hard)
  - Filter by pattern (dropdown)
  - Filter by status (Not Started, In Progress, Completed, Bookmarked)
  - Search by title
  - Pattern grouping (collapsible sections)
- Shows problem metadata: difficulty badge, status icon, bookmark icon
- Click problem to navigate to `/:category/problem/:id`

**`src/pages/Patterns.tsx`** - Pattern browser
- Route: `/:category/patterns`
- Expandable pattern cards with descriptions
- Learning resources: articles, videos, courses, docs
- Problem count per pattern
- Click pattern to expand and see problem list
- Pattern badges link back to Dashboard with filter applied

**`src/pages/ProblemView.tsx`** - Main workspace
- Route: `/:category/problem/:id`
- **Layout**: Resizable panels (React Resizable Panels)
- **Category-specific UI**:
  - **DSA/LLD**: Monaco Editor, test case runner, code execution
  - **HLD**: Code/Draw toggle, DiagramEditor (Excalidraw)
  - **Behavioral**: STAR framework hints, speech recognition
- **AI Chat Panel**: Collapsible right sidebar with multi-provider chat
- **Features**:
  - Auto-save code to localStorage (debounced)
  - Run test cases and display results
  - Toggle between code and diagram modes (HLD only)
  - Add notes (collapsible section)
  - Bookmark problem
  - Open in LeetCode (DSA only)
  - Navigate to previous/next problem
- **State management**: Combines multiple hooks (useProblems, useProgress, useCodeExecution, useAI)

**`src/pages/AnkiReview.tsx`** - Spaced repetition
- Route: `/:category/review`
- Displays Anki cards and MCQ questions
- **Card types**: Flashcards (front/back) and Multiple Choice Questions
- **Review quality**: Again, Hard, Good, Easy (SM-2 algorithm)
- **Progress tracking**: Cards due today, total cards reviewed
- Shows next review date after rating
- Navigates back to Dashboard when no cards due

**`src/pages/ImportProblem.tsx`** - LeetCode import
- Route: `/:category/import` (primarily for DSA)
- Input LeetCode problem slug (e.g., "two-sum")
- Fetches problem data via LeetCode API
- Auto-populates: title, description, difficulty, test cases, starter code
- Session-only by default (stored in module-level custom problems store)
- Optional Supabase sync for authenticated users

#### Components

**`src/components/Layout.tsx`** - Navigation and layout
- Top navigation bar with category tabs
- Auth UI: Google sign-in button or user avatar
- Category switcher: DSA, LLD, HLD, Behavioral tabs
- Guest mode indicator
- Responsive mobile menu

**`src/components/DiagramEditor.tsx`** - Excalidraw wrapper
- Lazy-loaded using `React.lazy()`
- localStorage persistence per problem
- Export/import functionality
- Theme integration (dark mode)
- Resizable container with React Resizable Panels

#### Data Files

**`src/data/problems.json`** - DSA problems (BUNDLED)
- Blind 75 + extended problem set
- Pre-loaded on app initialization
- Format: `{ patterns: Pattern[], problems: Problem[] }`

**`src/data/lld-problems.json`** - LLD problems (LAZY-LOADED)
- Object-oriented design problems
- Design patterns: Singleton, Factory, Observer, etc.
- Format: Same as DSA

**`src/data/hld-problems.json`** - HLD problems (LAZY-LOADED)
- System design problems
- Key components, concepts, scalability considerations
- Format: Same as DSA

**`src/data/behavioral-problems.json`** - Behavioral questions (LAZY-LOADED)
- STAR framework questions
- Situational, task-based, action-focused questions
- Format: Same as DSA

**`src/data/mcq-cards.ts`** - MCQ questions
- TypeScript file (not JSON) for easier maintenance
- Questions grouped by category
- Format: `{ id, problemId, question, options, correctIndex, explanation, difficulty }`

#### Server Files

**`server/index.mjs`** - Express CLI proxy
- **Development only**: Not deployed to production
- Spawns local CLI tools: `claude`, `codex`, `gemini`
- SSE streaming endpoint: `POST /api/chat`
- Request format: `{ provider, model?, messages, systemPrompt? }`
- Response format: `data: {"text": "chunk"}\n\n`
- Health check: `GET /api/health`

#### Configuration Files

**`package.json`** - Dependencies and scripts
- **Scripts**:
  - `npm run dev`: Start Vite + CLI server (parallel)
  - `npm run dev:frontend`: Start Vite only
  - `npm run server`: Start CLI server only
  - `npm run build`: Production build
  - `npm run preview`: Preview production build
  - `npm run lint`: ESLint check
- **Key dependencies**: See Technology Stack section

**`tsconfig.json`** - TypeScript configuration
- `strict: false`: Flexible type checking for velocity
- `jsx: "react-jsx"`: React 19 JSX transform
- `target: "ES2020"`: Modern JavaScript features
- `module: "ESNext"`: ES modules

**`vite.config.js`** - Vite build configuration
- React plugin for Fast Refresh
- TailwindCSS plugin for styling
- Build output directory: `dist/`
- Port: 5173 (default)

**`vercel.json`** - Vercel deployment
- SPA routing: Rewrites all routes to `index.html`
- Edge functions: Disabled (static site)

**`.env.local`** - Environment variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- **Never commit this file**: Listed in `.gitignore`

---

## Key Technical Patterns

### 1. Category-Aware Architecture

The entire application is built around dynamic category routing. This allows a single codebase to support multiple interview types (DSA, LLD, HLD, Behavioral).

**Implementation**:

```typescript
// src/types.ts - Category configuration
export type InterviewCategory = 'dsa' | 'lld' | 'hld' | 'behavioral';

export interface CategoryConfig {
  id: InterviewCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  hasCodeEditor: boolean;  // Feature flag for Monaco Editor
  hasTestCases: boolean;   // Feature flag for test case runner
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'dsa', name: 'DSA', icon: 'Code2', description: 'Data Structures & Algorithms', color: 'blue', hasCodeEditor: true, hasTestCases: true },
  { id: 'lld', name: 'LLD', icon: 'Boxes', description: 'Low-Level Design / OOP', color: 'purple', hasCodeEditor: true, hasTestCases: false },
  { id: 'hld', name: 'HLD', icon: 'Network', description: 'System Design', color: 'orange', hasCodeEditor: false, hasTestCases: false },
  { id: 'behavioral', name: 'Behavioral', icon: 'Users', description: 'Behavioral Interviews', color: 'green', hasCodeEditor: false, hasTestCases: false },
];

// Helper to get category config by ID
export function getCategoryConfig(id: InterviewCategory): CategoryConfig {
  return CATEGORIES.find(c => c.id === id)!;
}
```

**Routing Pattern**:

```typescript
// src/App.tsx - Category-aware routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path=":category" element={<CategoryRoutes />}>
    <Route index element={<Dashboard />} />
    <Route path="patterns" element={<Patterns />} />
    <Route path="problem/:id" element={<ProblemView />} />
    <Route path="review" element={<AnkiReview />} />
    <Route path="import" element={<ImportProblem />} />
  </Route>
</Routes>

// src/contexts/CategoryContext.tsx - Extract category from URL
export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { category: categoryParam } = useParams<{ category: string }>();
  const category = categoryParam as InterviewCategory || 'dsa';

  return (
    <CategoryContext.Provider value={{ category }}>
      {children}
    </CategoryContext.Provider>
  );
}

// Usage in components
function MyComponent() {
  const { category } = useCategory(); // 'dsa' | 'lld' | 'hld' | 'behavioral'
  const config = getCategoryConfig(category);

  return (
    <div>
      {config.hasCodeEditor && <MonacoEditor />}
      {config.hasTestCases && <TestCaseRunner />}
      {category === 'hld' && <DiagramEditor />}
    </div>
  );
}
```

**Benefits**:
- Single codebase for all interview types
- Easy to add new categories (just add to `CATEGORIES` array)
- Conditional feature rendering based on category config
- URL structure: `/:category/problem/:id` (e.g., `/dsa/problem/two-sum`)

### 2. Unified Problem Type with Optional Fields

Instead of separate types for each category (DSAProblem, LLDProblem, etc.), we use a single `Problem` interface with optional category-specific fields.

**Implementation**:

```typescript
// src/types.ts - Unified Problem interface
export interface Problem {
  // Core fields (all categories)
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pattern: string;
  description: string;
  category?: InterviewCategory;
  steps: Step[];
  ankiCards: AnkiCard[];

  // DSA-specific (optional)
  leetcodeUrl?: string;
  leetcodeNumber?: number;
  starterCode?: string;
  testCases?: TestCase[];
  similarQuestions?: SimilarQuestion[];

  // LLD-specific (optional)
  requirements?: string[];
  keyClasses?: string[];
  designPatterns?: string[];
  solutionCode?: string;

  // HLD-specific (optional)
  keyComponents?: string[];
  concepts?: string[];

  // Behavioral-specific (optional)
  question?: string;
  assessing?: string;
  starHints?: { situation: string; task: string; action: string; result: string };
  tips?: string[];

  // Shared
  resources?: Resource[];
}
```

**Guarding Optional Fields**:

```typescript
// Always check optional fields before using them
function ProblemView({ problem }: { problem: Problem }) {
  return (
    <div>
      {/* Guard with && */}
      {problem.leetcodeUrl && (
        <a href={problem.leetcodeUrl}>Open in LeetCode</a>
      )}

      {/* Guard with || default value */}
      {(problem.testCases || []).map(testCase => (
        <TestCase key={testCase.id} {...testCase} />
      ))}

      {/* Guard with optional chaining */}
      <p>Classes: {problem.keyClasses?.join(', ') || 'None'}</p>

      {/* Conditional rendering based on category */}
      {problem.category === 'behavioral' && problem.starHints && (
        <STARFramework hints={problem.starHints} />
      )}
    </div>
  );
}
```

**Benefits**:
- Simpler data loading (single `loadCategoryData` function)
- Easier to add cross-category features
- Reduces code duplication
- Type-safe with TypeScript

### 3. Lazy Data Loading

Only DSA data is bundled with the initial app load. Other category data is loaded on demand when the user navigates to that category.

**Implementation**:

```typescript
// src/hooks/useProblems.ts - Lazy loading pattern
import dsaData from '../data/problems.json';
import type { ProblemsData, InterviewCategory } from '../types';

// Module-level cache to prevent re-fetching
const dataCache: Record<string, ProblemsData> = {
  dsa: dsaData as ProblemsData, // Pre-loaded
};

// Async function to load category data
async function loadCategoryData(category: InterviewCategory): Promise<ProblemsData> {
  if (dataCache[category]) return dataCache[category]; // Return cached data

  try {
    // Dynamic import with string template
    const mod = await import(`../data/${category}-problems.json`);
    dataCache[category] = mod.default as ProblemsData;
    return dataCache[category];
  } catch {
    // Category data not yet available (graceful fallback)
    return { patterns: [], problems: [] };
  }
}

// Usage in hook
export function useProblems(category: InterviewCategory = 'dsa') {
  const [categoryData, setCategoryData] = React.useState<ProblemsData>(
    dataCache[category] || { patterns: [], problems: [] }
  );

  useEffect(() => {
    loadCategoryData(category).then(setCategoryData);
  }, [category]);

  // ... rest of hook
}
```

**Benefits**:
- Faster initial page load (smaller bundle size)
- Data loaded only when needed
- Cache prevents re-fetching on category switch
- Graceful error handling if data file missing

### 4. Local CLI Proxy for AI Chat (Development Only)

In development mode, the app can use local CLI tools (claude-code, codex, gemini) without API keys. This is privacy-friendly and cost-effective for development.

**Implementation**:

```typescript
// src/hooks/useAI.ts - Local provider detection
export const LOCAL_PROVIDERS = new Set<AIProvider>(['claude-code', 'codex', 'gemini-cli']);
export const IS_LOCAL = import.meta.env.DEV; // true in dev, false in production

// Conditional provider list
const availableProviders = IS_LOCAL
  ? ['claude-code', 'codex', 'gemini-cli', 'openai', 'anthropic', 'google', 'deepseek', 'qwen']
  : ['openai', 'anthropic', 'google', 'deepseek', 'qwen'];

// Local CLI streaming
async function streamLocalCLI(config, messages, systemContext, onChunk, signal) {
  const tool = LOCAL_TOOL_MAP[config.provider] || 'claude'; // Map frontend name to CLI command

  const res = await fetch('/api/chat', { // Proxied through Express server
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      systemPrompt: SYSTEM_PROMPT + '\n\n' + systemContext,
      tool, // 'claude', 'codex', or 'gemini'
    }),
    signal,
  });

  // SSE streaming response
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.text) onChunk(json.text);
          if (json.error) throw new Error(json.error);
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }
  }
}

// server/index.mjs - Express CLI proxy
const CLI_TOOLS = {
  claude: {
    command: 'claude',
    buildArgs: (model, systemPrompt) => {
      const args = ['-p', '--output-format', 'stream-json', '--verbose'];
      if (model) args.push('--model', model);
      if (systemPrompt) args.push('--system-prompt', systemPrompt);
      return args;
    },
    inputMode: 'stdin',
    parseStream: (line, emit) => {
      const json = JSON.parse(line);
      if (json.type === 'content_block_delta' && json.delta?.text) {
        emit(json.delta.text);
      }
    },
  },
  // ... similar for codex and gemini
};

// POST /api/chat endpoint
api.post('/chat', (req, res) => {
  const { tool, model, messages, systemPrompt } = req.body;
  const cliTool = CLI_TOOLS[tool];

  const args = cliTool.buildArgs(model, systemPrompt);
  const proc = spawn(cliTool.command, args, { stdio: ['pipe', 'pipe', 'pipe'] });

  // Write prompt to stdin
  if (cliTool.inputMode === 'stdin') {
    proc.stdin.write(prompt);
    proc.stdin.end();
  }

  // Stream stdout as SSE
  proc.stdout.on('data', (data) => {
    cliTool.parseStream(data.toString(), (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });
  });

  proc.on('close', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });
});
```

**Benefits**:
- No API keys needed in development
- Privacy-friendly (no data sent to third-party APIs)
- Cost-effective for testing
- Seamless switching between local and API providers
- Production builds automatically hide local providers (`IS_LOCAL = false`)

### 5. Unified Storage Strategy

The app uses a hybrid storage approach:
- **localStorage**: Fast, offline-friendly, client-side only
- **Supabase**: Persistent, synced across devices, requires auth

**Implementation**:

```typescript
// localStorage for code, notes, AI config, diagrams
const CODE_KEY = `code-${problemId}`;
const NOTES_KEY = `notes-${problemId}`;
const AI_CONFIG_KEY = 'dsa-prep-ai-config';
const DIAGRAMS_KEY = `diagram-${problemId}`;

// Supabase for user data, progress, imported problems
// Tables: users, user_progress, user_imported_problems, user_chats

// Example: Hybrid progress tracking
function useProgress() {
  const { user } = useAuth();

  // Load from localStorage (always)
  const [localProgress, setLocalProgress] = useState(() => {
    const raw = localStorage.getItem('progress');
    return raw ? JSON.parse(raw) : {};
  });

  // Sync to Supabase (if authenticated)
  useEffect(() => {
    if (!user) return;

    // Load from Supabase on mount
    supabase.from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        // Merge Supabase data with local data
        const merged = { ...localProgress };
        data?.forEach(row => {
          merged[row.problem_id] = {
            status: row.status,
            notes: row.notes,
            bookmarked: row.bookmarked,
          };
        });
        setLocalProgress(merged);
      });
  }, [user]);

  // Save to both stores
  function setStatus(problemId: string, status: string) {
    const updated = { ...localProgress, [problemId]: { ...localProgress[problemId], status } };
    setLocalProgress(updated);
    localStorage.setItem('progress', JSON.stringify(updated));

    if (user) {
      supabase.from('user_progress').upsert({
        user_id: user.id,
        problem_id: problemId,
        status,
        updated_at: new Date().toISOString(),
      });
    }
  }

  return { localProgress, setStatus };
}
```

**Benefits**:
- Works offline (localStorage)
- Syncs across devices (Supabase for authenticated users)
- Graceful degradation (guest mode doesn't require Supabase)
- Fast reads (localStorage is synchronous)
- Debounced writes prevent excessive API calls

### 6. Module-Level Stores for Shared State

For state that needs to be shared across multiple components without prop drilling, we use module-level stores with `useSyncExternalStore`.

**Implementation**:

```typescript
// src/hooks/useProblems.ts - Custom problems store
let customProblemsStore: Problem[] = []; // Module-level variable
const listeners = new Set<() => void>(); // Subscribers

// Subscribe to store changes
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb); // Cleanup
}

// Get current snapshot
function getSnapshot() {
  return customProblemsStore;
}

// Update store and notify subscribers
function setStore(problems: Problem[]) {
  customProblemsStore = problems;
  listeners.forEach(cb => cb()); // Notify all subscribers
}

// Add to store (deduplicate by ID)
function addToStore(problem: Problem) {
  customProblemsStore = [
    ...customProblemsStore.filter(p => p.id !== problem.id),
    problem,
  ];
  listeners.forEach(cb => cb());
}

// Usage in hook
export function useProblems(category: InterviewCategory = 'dsa') {
  const customProblems = useSyncExternalStore(subscribe, getSnapshot); // React hook

  // Merge custom problems with built-in problems
  const problems = useMemo(() => {
    const builtIn = categoryData.problems;
    const relevant = customProblems.filter(p => (p.category || 'dsa') === category);
    const seen = new Set(builtIn.map(p => p.id));
    const merged = [...builtIn];

    for (const cp of relevant) {
      if (!seen.has(cp.id)) {
        merged.push(cp);
        seen.add(cp.id);
      }
    }

    return merged;
  }, [categoryData, customProblems, category]);

  return { problems, addCustomProblem: addToStore };
}
```

**Benefits**:
- Shared state without Context API
- Multiple components can subscribe to same store
- Automatic re-renders when store updates
- Module-level scope (survives component unmounts)
- Works with React 19's concurrent rendering

### 7. Conditional Feature Rendering Based on Category

Different categories have different features (e.g., code editor for DSA/LLD, diagrams for HLD). We use category config flags to conditionally render features.

**Implementation**:

```typescript
// src/pages/ProblemView.tsx - Conditional rendering
function ProblemView() {
  const { category } = useCategory();
  const config = getCategoryConfig(category);

  return (
    <div>
      {/* Code editor only for DSA/LLD */}
      {config.hasCodeEditor && (
        <MonacoEditor
          value={code}
          onChange={setCode}
          language="typescript"
        />
      )}

      {/* Test case runner only for DSA */}
      {config.hasTestCases && (
        <TestCaseRunner
          testCases={problem.testCases || []}
          onRun={runCode}
        />
      )}

      {/* Code/Draw toggle only for HLD */}
      {category === 'hld' && (
        <div>
          <button onClick={() => setMode('code')}>Code</button>
          <button onClick={() => setMode('draw')}>Draw</button>
        </div>
      )}

      {/* Diagram editor only in draw mode (HLD) */}
      {category === 'hld' && mode === 'draw' && (
        <DiagramEditor problemId={problem.id} />
      )}

      {/* STAR framework hints only for Behavioral */}
      {category === 'behavioral' && problem.starHints && (
        <STARFramework hints={problem.starHints} />
      )}
    </div>
  );
}
```

**Benefits**:
- Single component for all categories
- Feature flags make it easy to enable/disable features
- Cleaner code than category-specific components
- Easy to test (just change category in URL)

---

## Development Guidelines

These guidelines are derived from commit history and help you make changes that align with existing patterns.

### Commit Message Style

**Format**: `<Action> <what changed> <optional context>`

**Examples**:
- "Add DiagramEditor component with lazy-loaded Excalidraw and localStorage persistence"
- "Fix pre-existing TS errors: useRef initial values, missing category imports"
- "Update pattern resources with specific, interview-focused learning materials"
- "Guard optional fields for non-DSA problem types"
- "Rename to interview-coder, add data sets and fix CLI server"

**Actions**: Add, Fix, Update, Rename, Guard, Hide, Remove, Refactor

**Guidelines**:
- Start with verb (imperative mood)
- Be descriptive but concise
- Explain why if not obvious from what
- Group related changes in single commit
- Avoid vague messages ("fix bug", "update code")

### TypeScript Best Practices

1. **Guard optional fields**: Use `|| []`, `|| ''`, `?.` optional chaining, conditional rendering
2. **No strict mode**: `strict: false` in tsconfig to balance safety with velocity
3. **Type imports**: Use `type` keyword for type-only imports
   ```typescript
   import type { Problem, Pattern } from './types';
   ```
4. **Explicit types**: Define interfaces for all data structures (in `src/types.ts`)
5. **Avoid `any`**: Use `unknown` or specific types when possible
6. **Type guards**: Use type predicates for narrowing
   ```typescript
   function isDSAProblem(p: Problem): p is Problem & { leetcodeUrl: string } {
     return 'leetcodeUrl' in p && typeof p.leetcodeUrl === 'string';
   }
   ```

### Component Patterns

1. **Lazy loading**: Use `React.lazy()` for heavy components
   ```typescript
   const DiagramEditor = React.lazy(() => import('./components/DiagramEditor'));

   <Suspense fallback={<LoadingSpinner />}>
     <DiagramEditor />
   </Suspense>
   ```

2. **Custom hooks**: Extract reusable logic
   - Business logic in hooks, not components
   - Prefix with `use` (e.g., `useProblems`, `useAI`)
   - Return object with named exports
   ```typescript
   export function useProblems() {
     // ... logic
     return { problems, getById, search };
   }
   ```

3. **Context for global state**: Auth, category routing
   - Use Context API for truly global state
   - Provide at root level
   - Consume with custom hook
   ```typescript
   export function useAuth() {
     const context = useContext(AuthContext);
     if (!context) throw new Error('useAuth must be used within AuthProvider');
     return context;
   }
   ```

4. **useSyncExternalStore**: For module-level stores
   - Shared state across components
   - Module-level variables
   - Subscribers pattern

### Data Management

1. **Lazy category loading**: Only load data when user navigates to category
2. **Data cache**: Prevent re-fetching with module-level cache object
3. **Merge custom problems**: Deduplicate by ID when merging with built-in problems
4. **Session-only imports**: Custom problems don't persist by default (Supabase opt-in)

### Performance

1. **Code splitting**: Vite + React.lazy for dynamic imports
2. **Debounced auto-save**: Prevent excessive writes on code changes
   ```typescript
   const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

   function autoSave(code: string) {
     if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
     saveTimerRef.current = setTimeout(() => {
       localStorage.setItem(CODE_KEY, code);
     }, 300);
   }
   ```
3. **Memoization**: `useMemo` for expensive computations
   ```typescript
   const patternStats = useMemo(() => {
     return problems.reduce((acc, p) => {
       acc[p.pattern] = (acc[p.pattern] || 0) + 1;
       return acc;
     }, {} as Record<string, number>);
   }, [problems]);
   ```
4. **Conditional loading**: Don't load category data until needed

### Error Handling

1. **Try-catch for lazy imports**: Return empty data structure on failure
   ```typescript
   try {
     const mod = await import(`../data/${category}-problems.json`);
     return mod.default;
   } catch {
     return { patterns: [], problems: [] };
   }
   ```
2. **Guard missing data**: Check if fields exist before accessing
3. **Fallback UI**: Loading spinners, empty states
4. **TypeScript safety**: Optional chaining, nullish coalescing

### Feature Development Pattern

1. Add type definitions to `src/types.ts`
2. Update data schema if needed (JSON files)
3. Create/update hook for business logic
4. Build UI component
5. Wire up in route/page
6. Test category-specific behavior
7. Commit with descriptive message

---

## Common Tasks & Workflows

### Adding a New Problem to a Category

**Step 1: Edit the category's JSON file**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/data/<category>-problems.json`

```json
{
  "patterns": [...],
  "problems": [
    {
      "id": "unique-problem-id",
      "title": "Problem Title",
      "difficulty": "Medium",
      "pattern": "pattern-id",
      "description": "Problem description...",
      "steps": [
        {
          "title": "Understand the Problem",
          "hint": "What are the inputs and outputs?",
          "approach": "Break down the problem...",
          "code": "// Example code",
          "complexity": "Time: O(n), Space: O(1)"
        }
      ],
      "ankiCards": [
        {
          "id": "card-1",
          "front": "What data structure is best for...?",
          "back": "Hash map for O(1) lookups"
        }
      ],
      // Category-specific fields (optional)
      "leetcodeUrl": "https://leetcode.com/problems/...",
      "testCases": [
        {
          "args": [[1, 2, 3], 6],
          "expected": [1, 2],
          "description": "Basic case"
        }
      ]
    }
  ]
}
```

**Step 2: Restart dev server** (if data was lazy-loaded)

```bash
npm run dev
```

**Step 3: Test the problem**
- Navigate to `/:category/problem/:id`
- Verify all fields display correctly
- Test category-specific features (code execution, diagrams, etc.)

### Adding a New Pattern

**Step 1: Edit the category's JSON file**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/data/<category>-problems.json`

```json
{
  "patterns": [
    {
      "id": "new-pattern",
      "name": "New Pattern Name",
      "icon": "🔥",
      "description": "Description of the pattern...",
      "resources": [
        {
          "title": "Pattern Guide",
          "url": "https://example.com/guide",
          "type": "article"
        },
        {
          "title": "Video Tutorial",
          "url": "https://youtube.com/...",
          "type": "video"
        }
      ]
    }
  ],
  "problems": [...]
}
```

**Step 2: Add problems with the new pattern**

```json
{
  "id": "problem-1",
  "pattern": "new-pattern",
  // ... rest of problem
}
```

**Step 3: Test**
- Navigate to `/:category/patterns`
- Verify pattern card appears
- Click to expand and see problems
- Test resource links

### Adding a New AI Provider

**Step 1: Add provider to `useAI.ts`**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/hooks/useAI.ts`

```typescript
export type AIProvider = 'claude-code' | 'codex' | 'gemini-cli' | 'openai' | 'anthropic' | 'google' | 'deepseek' | 'qwen' | 'new-provider';

// Add models for the provider
const MODELS: Record<AIProvider, string[]> = {
  // ... existing providers
  'new-provider': ['model-1', 'model-2', 'model-3'],
};

// If OpenAI-compatible, add API URL
const OPENAI_COMPAT_URLS: Partial<Record<AIProvider, string>> = {
  // ... existing providers
  'new-provider': 'https://api.newprovider.com/v1/chat/completions',
};
```

**Step 2: Implement streaming function** (if not OpenAI-compatible)

```typescript
async function streamNewProvider(config: AIConfig, messages: AIMessage[], systemContext: string, onChunk: (text: string) => void, signal: AbortSignal) {
  const res = await fetch('https://api.newprovider.com/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n\n' + systemContext },
        ...messages,
      ],
    }),
    signal,
  });

  // Parse streaming response (provider-specific)
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // ... parse buffer and call onChunk(text)
  }
}
```

**Step 3: Update `ask` function** to use new provider

```typescript
const streamFn = LOCAL_PROVIDERS.has(config.provider) ? streamLocalCLI
  : config.provider === 'anthropic' ? streamAnthropic
  : config.provider === 'google' ? streamGoogle
  : config.provider === 'new-provider' ? streamNewProvider
  : streamOpenAICompat;
```

**Step 4: Test**
- Open AI settings panel
- Select new provider
- Enter API key
- Select model
- Send test message

### Creating a New Page/Route

**Step 1: Create page component**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/pages/NewPage.tsx`

```typescript
import { useCategory } from '../contexts/CategoryContext';
import { useProblems } from '../hooks/useProblems';

export default function NewPage() {
  const { category } = useCategory();
  const { problems } = useProblems(category);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">New Page</h1>
      {/* ... page content */}
    </div>
  );
}
```

**Step 2: Add route to `App.tsx`**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/App.tsx`

```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path=":category" element={<CategoryRoutes />}>
    {/* ... existing routes */}
    <Route path="new-page" element={<NewPage />} />
  </Route>
</Routes>
```

**Step 3: Add navigation link** (optional)

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/components/Layout.tsx`

```typescript
<Link to={`/${category}/new-page`}>New Page</Link>
```

**Step 4: Test**
- Navigate to `/:category/new-page`
- Verify page renders
- Test category switching
- Test all features

### Modifying the AI System Prompt

**Location**: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/hooks/useAI.ts`

```typescript
const SYSTEM_PROMPT = `You are a DSA (Data Structures & Algorithms) coding tutor embedded in a practice tool. The student is working on a coding problem and needs guidance.

RULES:
- NEVER give the full solution or complete code
- Give small, focused hints that guide thinking
- Ask Socratic questions to help them discover the approach
- If they're stuck, suggest the pattern or data structure to consider
- Point out edge cases they might be missing
- If their code has a bug, hint at WHERE the issue is, not HOW to fix it
- Keep responses concise (2-4 sentences max)
- Use code snippets only for tiny illustrations (1-2 lines max, pseudocode preferred)
- If they explicitly ask for the solution, politely decline and offer a stronger hint instead

You have context about the problem they're solving and their current code.`;
```

**Customization**:
- Change tone (formal vs casual)
- Adjust hint level (more/less helpful)
- Add category-specific instructions
- Change response length guidelines

**Example: Category-specific prompts**:

```typescript
const SYSTEM_PROMPTS: Record<InterviewCategory, string> = {
  dsa: `You are a DSA tutor...`,
  lld: `You are an OOP design tutor...`,
  hld: `You are a system design architect...`,
  behavioral: `You are an interview coach...`,
};

// Usage in streaming functions
const systemPrompt = SYSTEM_PROMPTS[category] || SYSTEM_PROMPTS.dsa;
```

### Adding a New Test Case to a Problem

**Step 1: Edit problem JSON**

File: `/Users/sarthakagrawal/Desktop/swe-interview-prep/src/data/problems.json` (or other category)

```json
{
  "id": "two-sum",
  "testCases": [
    {
      "args": [[2, 7, 11, 15], 9],
      "expected": [0, 1],
      "description": "Basic case"
    },
    {
      "args": [[3, 2, 4], 6],
      "expected": [1, 2],
      "description": "Non-zero indices"
    },
    {
      "args": [[3, 3], 6],
      "expected": [0, 1],
      "description": "Duplicate values"
    }
  ]
}
```

**Step 2: Restart dev server**

```bash
npm run dev
```

**Step 3: Test**
- Navigate to problem
- Click "Run Tests"
- Verify new test case executes

---

## Technical Decisions & Rationale

Understanding why certain decisions were made helps you make consistent choices in future changes.

### 1. Unified Problem Type Over Category-Specific Types

**Decision**: Use a single `Problem` interface with optional category-specific fields instead of separate interfaces (`DSAProblem`, `LLDProblem`, etc.).

**Rationale**:
- **Simpler data loading**: Single `loadCategoryData` function works for all categories
- **Easier hooks**: `useProblems` hook doesn't need category-specific logic
- **Type safety**: TypeScript guards ensure optional fields are checked
- **Flexibility**: Easy to add cross-category features (e.g., shared resources)
- **Reduced duplication**: No need for multiple interfaces with overlapping fields

**Trade-off**: Requires guarding optional fields throughout the codebase

### 2. Lazy Loading Over Bundling All Data

**Decision**: Only bundle DSA data by default. Load other category data on demand via dynamic imports.

**Rationale**:
- **Faster initial load**: Smaller bundle size (DSA data is ~500KB, other categories add ~1.5MB)
- **Better UX**: Users who only use DSA don't download LLD/HLD/Behavioral data
- **Scalable**: Easy to add more categories without impacting initial load time
- **Cache-friendly**: Data cached after first load, so subsequent navigation is instant

**Trade-off**: Slight delay on first navigation to new category (mitigated by cache)

### 3. Local CLI Proxy Over Direct API Calls (Development Only)

**Decision**: Use Express server to proxy local CLI tools (claude-code, codex, gemini) instead of direct API calls during development.

**Rationale**:
- **Privacy**: No API keys or data sent to third-party services during development
- **Cost-effective**: Avoid API charges during testing and development
- **Faster iteration**: No rate limits or quota concerns
- **Seamless switching**: Same interface as API providers, just different endpoint
- **Production-ready**: Automatically hidden in production builds

**Trade-off**: Requires CLI tools to be installed locally

### 4. localStorage Over Pure Supabase

**Decision**: Use localStorage as primary storage, with optional Supabase sync for authenticated users.

**Rationale**:
- **Faster reads**: localStorage is synchronous, Supabase is async
- **Offline support**: Works without internet connection
- **Guest mode**: No authentication required for basic functionality
- **Reduced API calls**: Only sync when user is authenticated
- **Better UX**: Instant feedback on code changes, no loading spinners

**Trade-off**: Data not synced across devices for guest users

### 5. React 19 Over React 18

**Decision**: Use React 19 for latest features and performance improvements.

**Rationale**:
- **Better performance**: Automatic batching, concurrent rendering improvements
- **New features**: `use()` hook for Promises, improved Suspense
- **Future-proof**: Prepared for server components (potential future feature)
- **Smaller bundle**: React 19 has smaller runtime size
- **Better TypeScript**: Improved type definitions

**Trade-off**: Some third-party libraries may not be compatible (rare)

### 6. TypeScript Non-Strict Mode

**Decision**: Set `strict: false` in `tsconfig.json`.

**Rationale**:
- **Faster development**: Don't get blocked by strict type checking
- **Flexibility**: Can use `any` when needed (e.g., JSON parsing)
- **Incremental improvement**: Can add types gradually
- **Balance**: Still get type safety, but not overly restrictive

**Trade-off**: More potential runtime errors (mitigated by testing)

**Note**: This is a pragmatic choice for rapid development. Consider enabling strict mode for production apps.

### 7. Vite Over Create React App (CRA)

**Decision**: Use Vite for dev server and builds.

**Rationale**:
- **Faster dev server**: Hot Module Replacement (HMR) in milliseconds
- **Faster builds**: Rollup-based builds are 10-20x faster than Webpack
- **Modern tooling**: Native ES modules, built-in TypeScript support
- **Smaller bundles**: Better tree-shaking and code splitting
- **Active development**: CRA is deprecated, Vite is actively maintained

**Trade-off**: Slightly different configuration than CRA (minimal)

### 8. TailwindCSS Over CSS Modules

**Decision**: Use TailwindCSS for styling.

**Rationale**:
- **Utility-first**: Faster development, no context switching
- **Consistency**: Design system built-in (spacing, colors, typography)
- **Smaller bundles**: Unused styles automatically purged
- **Dark mode**: Built-in dark mode support
- **Responsive**: Mobile-first breakpoints

**Trade-off**: Verbose HTML (mitigated by component extraction)

### 9. Supabase Over Firebase

**Decision**: Use Supabase for backend services.

**Rationale**:
- **PostgreSQL**: Full SQL database with complex queries
- **Open source**: Can self-host if needed
- **Better pricing**: More generous free tier
- **RESTful API**: Standard HTTP endpoints
- **Real-time**: Built-in real-time subscriptions

**Trade-off**: Smaller ecosystem than Firebase (but growing)

### 10. Monaco Editor Over CodeMirror

**Decision**: Use Monaco Editor for code editing.

**Rationale**:
- **VS Code**: Same editor as VS Code (familiar UX)
- **IntelliSense**: Built-in autocomplete and type hints
- **Better TypeScript**: First-class TypeScript support
- **Performance**: Handles large files efficiently
- **Modern**: Better mobile support

**Trade-off**: Larger bundle size (mitigated by lazy loading)

---

## Coding Conventions

Following these conventions ensures consistency across the codebase.

### Naming Conventions

**Files**:
- **Components**: PascalCase (e.g., `ProblemView.tsx`, `Layout.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useProblems.ts`, `useAI.ts`)
- **Utilities**: camelCase (e.g., `supabase.ts`, `leetcode.ts`)
- **Types**: `types.ts` (singular, lowercase)
- **Data**: kebab-case with descriptive suffix (e.g., `problems.json`, `lld-problems.json`)

**Types**:
- **Interfaces**: PascalCase (e.g., `Problem`, `Pattern`, `TestCase`)
- **Type aliases**: PascalCase (e.g., `AIProvider`, `InterviewCategory`)
- **Enums**: PascalCase (rarely used, prefer union types)

**Constants**:
- **Global constants**: SCREAMING_SNAKE_CASE (e.g., `LOCAL_PROVIDERS`, `AI_CONFIG_KEY`)
- **Local constants**: camelCase (e.g., `const defaultConfig = {...}`)

**Functions**:
- **Components**: PascalCase (e.g., `function ProblemView()`)
- **Hooks**: camelCase with `use` prefix (e.g., `function useProblems()`)
- **Utilities**: camelCase (e.g., `function loadCategoryData()`)
- **Handlers**: camelCase with `handle` prefix (e.g., `handleClick`, `handleSubmit`)

**Variables**:
- **State**: camelCase (e.g., `const [problems, setProblems]`)
- **Props**: camelCase (e.g., `{ problemId, onSave }`)
- **Refs**: camelCase with `Ref` suffix (e.g., `const timerRef = useRef()`)

### File Organization

**Component files**:
```typescript
// 1. Imports (external libs first, then internal)
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCategory } from '../contexts/CategoryContext';
import { useProblems } from '../hooks/useProblems';

// 2. Types (if component-specific)
interface Props {
  problemId: string;
  onSave: () => void;
}

// 3. Constants (if component-specific)
const DEFAULT_CODE = '// Write your code here\n';

// 4. Component
export default function MyComponent({ problemId, onSave }: Props) {
  // State
  const [code, setCode] = useState(DEFAULT_CODE);

  // Hooks
  const { category } = useCategory();
  const { getById } = useProblems(category);

  // Derived state
  const problem = getById(problemId);

  // Handlers
  const handleSave = () => {
    // ...
    onSave();
  };

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Hook files**:
```typescript
// 1. Imports
import { useState, useEffect } from 'react';

// 2. Types
interface Config {
  apiKey: string;
  model: string;
}

// 3. Constants
const DEFAULT_CONFIG: Config = { apiKey: '', model: 'default' };

// 4. Helper functions (private)
function loadConfig(): Config {
  // ...
}

// 5. Hook (exported)
export function useMyHook() {
  // State and logic
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Return object
  return { config, setConfig };
}
```

### Styling Conventions (TailwindCSS)

**Order of classes**:
1. Layout (flex, grid, block, etc.)
2. Spacing (padding, margin)
3. Sizing (width, height)
4. Typography (font, text)
5. Colors (bg, text, border)
6. Borders
7. Effects (shadow, opacity)
8. Transitions

**Example**:
```tsx
<div className="flex flex-col p-4 w-full max-w-4xl mx-auto text-lg text-gray-100 bg-gray-900 border border-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
  {/* Content */}
</div>
```

**Responsive design**:
```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

**Dark theme** (default):
- Background: `bg-gray-950`, `bg-gray-900`, `bg-gray-800`
- Text: `text-gray-100`, `text-gray-200`, `text-gray-300`
- Borders: `border-gray-800`, `border-gray-700`
- Accents: `text-blue-400`, `bg-blue-500`, `border-blue-500`

### State Management Conventions

**useState**:
```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Object state (avoid unless necessary)
const [config, setConfig] = useState({ apiKey: '', model: '' });

// Array state
const [items, setItems] = useState<Item[]>([]);

// Updater function for derived state
setItems(prev => [...prev, newItem]);
```

**useMemo**:
```typescript
// Expensive computation
const sortedProblems = useMemo(() => {
  return problems.sort((a, b) => a.title.localeCompare(b.title));
}, [problems]);

// Derived object
const stats = useMemo(() => ({
  total: problems.length,
  easy: problems.filter(p => p.difficulty === 'Easy').length,
  medium: problems.filter(p => p.difficulty === 'Medium').length,
  hard: problems.filter(p => p.difficulty === 'Hard').length,
}), [problems]);
```

**useCallback**:
```typescript
// Handler passed to child
const handleSave = useCallback((code: string) => {
  localStorage.setItem(CODE_KEY, code);
  onSave?.(code);
}, [onSave]);

// Async handler
const handleFetch = useCallback(async () => {
  const data = await fetchData();
  setData(data);
}, []);
```

**useEffect**:
```typescript
// Load data on mount
useEffect(() => {
  loadData();
}, []);

// Sync with prop changes
useEffect(() => {
  if (problemId) {
    loadProblem(problemId);
  }
}, [problemId]);

// Cleanup
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### React Patterns

**Conditional rendering**:
```typescript
// && for simple cases
{isLoading && <LoadingSpinner />}

// Ternary for if-else
{isLoading ? <LoadingSpinner /> : <Content />}

// Early return for complex conditions
if (!problem) return <NotFound />;
return <ProblemView problem={problem} />;
```

**Props destructuring**:
```typescript
// In function signature
function MyComponent({ title, description, onClose }: Props) {
  // ...
}

// With defaults
function MyComponent({ title, isOpen = false }: Props) {
  // ...
}

// Rest props
function MyComponent({ title, ...rest }: Props) {
  return <div {...rest}>{title}</div>;
}
```

**Children pattern**:
```typescript
interface Props {
  children: React.ReactNode;
}

function Container({ children }: Props) {
  return <div className="container">{children}</div>;
}
```

---

## Testing & Debugging

### Manual Testing Checklist

**Category switching**:
- [ ] Navigate between DSA, LLD, HLD, Behavioral
- [ ] Verify correct problems load for each category
- [ ] Check category-specific features (code editor, diagrams, etc.)
- [ ] Test browser back/forward buttons

**Problem solving**:
- [ ] Load problem from Dashboard
- [ ] Write code in editor (DSA/LLD)
- [ ] Run test cases (DSA)
- [ ] Draw diagram (HLD)
- [ ] Save and reload page (verify persistence)
- [ ] Navigate to next/previous problem

**AI chat**:
- [ ] Open AI panel
- [ ] Send message with different providers
- [ ] Verify streaming works
- [ ] Test chat history persistence
- [ ] Clear chat and verify

**Spaced repetition**:
- [ ] Navigate to review page
- [ ] Review Anki cards
- [ ] Answer MCQ questions
- [ ] Rate recall quality
- [ ] Verify next review date

**Authentication**:
- [ ] Sign in with Google
- [ ] Verify user data syncs
- [ ] Sign out
- [ ] Test guest mode
- [ ] Verify localStorage fallback

### Debugging Tools

**React DevTools**:
- Install browser extension
- Inspect component tree
- View props and state
- Profile performance

**Vite DevTools**:
- Check HMR updates in console
- View module graph
- Inspect build output

**Browser DevTools**:
- Network tab: Check API calls, SSE streams
- Console: Check for errors, warnings
- Application tab: Inspect localStorage, Supabase tokens
- Performance tab: Profile runtime performance

### Common Issues and Solutions

**Issue**: Data not loading for new category
- **Solution**: Check if JSON file exists in `src/data/`
- **Solution**: Verify file name matches pattern: `<category>-problems.json`
- **Solution**: Check browser console for import errors

**Issue**: Code execution fails
- **Solution**: Check Sucrase transpiler is installed (`npm install sucrase`)
- **Solution**: Verify code has no syntax errors
- **Solution**: Check test case format matches `TestCase` interface

**Issue**: AI chat not working
- **Solution**: Check API key is correct
- **Solution**: Verify provider is selected correctly
- **Solution**: Check network tab for failed requests
- **Solution**: Test with different provider

**Issue**: localStorage data lost
- **Solution**: Check browser settings (incognito mode clears localStorage)
- **Solution**: Verify key names match constants in code
- **Solution**: Check for JSON parse errors in console

**Issue**: Supabase sync not working
- **Solution**: Verify environment variables in `.env.local`
- **Solution**: Check Supabase project is active
- **Solution**: Test auth flow (sign in/out)
- **Solution**: Check database permissions (RLS policies)

---

## Deployment & Production

### Building for Production

**Command**:
```bash
npm run build
```

**Output**: `dist/` directory with optimized static files

**Build optimizations**:
- Tree-shaking: Unused code removed
- Minification: JavaScript and CSS minified
- Code splitting: Lazy-loaded components in separate chunks
- Asset optimization: Images and fonts optimized

### Vercel Deployment

**Configuration**: `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deployment steps**:
1. Push to GitHub
2. Vercel auto-deploys on push to main branch
3. Preview deployments for pull requests

**Environment variables** (set in Vercel dashboard):
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

### Production Considerations

**Local CLI providers hidden**:
- `IS_LOCAL = import.meta.env.DEV` is `false` in production
- Local providers (claude-code, codex, gemini-cli) not shown in UI
- Server proxy not deployed to production

**API keys stored client-side**:
- API keys stored in localStorage (not secure)
- Disclaimer shown in AI settings panel
- Consider backend proxy for production use

**Supabase RLS policies**:
- Row-level security enabled for all tables
- Users can only access their own data
- Guest mode uses localStorage only

**Performance monitoring**:
- Use Vercel Analytics for page views
- Monitor Core Web Vitals (LCP, FID, CLS)
- Check bundle size in Vercel dashboard

---

## Notes for AI Agents

When working on this codebase, keep these guidelines in mind:

### Critical Rules

1. **Always check category context**: Use `useCategory()` hook, guard category-specific fields
2. **Respect data format**: All category data must conform to `ProblemsData` format
3. **Test across categories**: Features should work in DSA, LLD, HLD, and Behavioral
4. **Guard optional fields**: Use `|| []`, `?.`, conditional rendering for optional Problem fields
5. **Keep code DRY**: Extract reusable logic to hooks, no duplicate types or functions
6. **Preserve existing patterns**: Follow lazy loading, category-aware routing, unified types

### Making Changes

**Before modifying code**:
1. Read relevant files in this document to understand current implementation
2. Check `src/types.ts` for existing types
3. Review commit history for similar changes (`git log --oneline`)
4. Identify which hook/component needs changes
5. Plan the change to minimize impact

**When adding features**:
1. Check if similar feature exists in another category
2. Use category config flags for conditional rendering
3. Add types to `src/types.ts` first
4. Implement hook logic, then UI
5. Test in all categories, not just one
6. Commit with descriptive message

**When fixing bugs**:
1. Reproduce the issue in specific category
2. Check if issue exists in other categories
3. Identify root cause (data, logic, UI)
4. Fix at the source, not symptoms
5. Test edge cases
6. Commit with "Fix: " prefix

### Code Quality

**TypeScript**:
- Add types for all new functions/components
- Use interfaces for objects, type aliases for unions
- Guard optional fields before accessing
- Use type predicates for narrowing

**React**:
- Use functional components (no class components)
- Extract logic to custom hooks
- Use `useMemo` for expensive computations
- Use `useCallback` for handlers passed to children
- Lazy load heavy components (`React.lazy`)

**Performance**:
- Debounce auto-save operations
- Cache expensive computations with `useMemo`
- Use lazy loading for category data
- Minimize re-renders with proper dependencies

**Error Handling**:
- Try-catch for async operations
- Graceful fallbacks for missing data
- User-friendly error messages
- Console warnings for dev-time issues

### Common Pitfalls to Avoid

1. **Don't bundle all category data**: Only DSA should be bundled, others lazy-loaded
2. **Don't modify `src/types.ts` without updating all usages**: Types are shared across entire app
3. **Don't forget category guards**: Check category before rendering category-specific UI
4. **Don't skip optional field guards**: Always check optional fields exist before accessing
5. **Don't break lazy loading**: Use dynamic imports for heavy components
6. **Don't commit `.env.local`**: Environment variables are secret
7. **Don't hardcode category names**: Use `CATEGORIES` array and `getCategoryConfig()` helper
8. **Don't duplicate logic**: Extract to hook if used in multiple components

---

## Quick Reference

### Key Commands

```bash
# Development
npm run dev              # Start Vite + CLI server
npm run dev:frontend     # Start Vite only
npm run server           # Start CLI server only

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # ESLint check
```

### Key File Paths

```
/Users/sarthakagrawal/Desktop/swe-interview-prep/
├── src/
│   ├── types.ts                     # All TypeScript types
│   ├── App.tsx                      # Root component, routing
│   ├── main.tsx                     # Entry point
│   ├── pages/                       # Route components
│   │   ├── Home.tsx                 # /
│   │   ├── Dashboard.tsx            # /:category
│   │   ├── ProblemView.tsx          # /:category/problem/:id
│   │   ├── Patterns.tsx             # /:category/patterns
│   │   ├── AnkiReview.tsx           # /:category/review
│   │   └── ImportProblem.tsx        # /:category/import
│   ├── hooks/                       # Business logic
│   │   ├── useProblems.ts           # Problem data management
│   │   ├── useProgress.ts           # Progress tracking
│   │   ├── useAI.ts                 # AI chat integration
│   │   ├── useCodeExecution.ts      # Code execution
│   │   └── useSpacedRepetition.ts   # Anki review
│   ├── contexts/                    # Global state
│   │   ├── AuthContext.tsx          # Authentication
│   │   └── CategoryContext.tsx      # Category routing
│   ├── data/                        # JSON datasets
│   │   ├── problems.json            # DSA (bundled)
│   │   ├── lld-problems.json        # LLD (lazy)
│   │   ├── hld-problems.json        # HLD (lazy)
│   │   └── behavioral-problems.json # Behavioral (lazy)
│   └── components/                  # UI components
│       ├── Layout.tsx               # Navigation
│       └── DiagramEditor.tsx        # Excalidraw
├── server/
│   └── index.mjs                    # CLI proxy (dev only)
├── package.json                     # Dependencies, scripts
├── tsconfig.json                    # TypeScript config
├── vite.config.js                   # Vite config
└── .env.local                       # Environment variables
```

### Key Hooks

```typescript
// Problem data
const { problems, getById, search } = useProblems(category);

// Progress tracking
const { getStatus, setStatus, toggleBookmark } = useProgress();

// AI chat
const { messages, isStreaming, ask, clearMessages } = useAI(problemId);

// Code execution
const { runCode, output, isRunning, error } = useCodeExecution();

// Spaced repetition
const { getDueCards, recordReview } = useSpacedRepetition();

// Category context
const { category } = useCategory();

// Authentication
const { user, signIn, signOut } = useAuth();
```

### Key Types

```typescript
type InterviewCategory = 'dsa' | 'lld' | 'hld' | 'behavioral';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pattern: string;
  description: string;
  category?: InterviewCategory;
  // Optional category-specific fields
  leetcodeUrl?: string;
  testCases?: TestCase[];
  requirements?: string[];
  keyClasses?: string[];
  keyComponents?: string[];
  concepts?: string[];
  question?: string;
  starHints?: STARHints;
}

interface ProblemsData {
  patterns: Pattern[];
  problems: Problem[];
}

interface CategoryConfig {
  id: InterviewCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  hasCodeEditor: boolean;
  hasTestCases: boolean;
}
```

---

## Summary

This document provides comprehensive context for AI agents working on the Interview Coder project. Key takeaways:

1. **Category-aware architecture**: Everything is built around dynamic category routing
2. **Unified Problem type**: Single interface with optional fields for all categories
3. **Lazy loading**: Only load data when needed, cache for performance
4. **Hybrid storage**: localStorage for speed, Supabase for persistence
5. **Development patterns**: Follow commit history, use hooks for logic, guard optional fields
6. **Testing**: Manual testing across all categories, check console for errors
7. **Deployment**: Vercel with automatic deployments, environment variables for secrets

**When in doubt**:
- Check `src/types.ts` for type definitions
- Read commit history for similar changes
- Test across all categories (DSA, LLD, HLD, Behavioral)
- Guard optional fields before accessing
- Use hooks for business logic, components for UI
