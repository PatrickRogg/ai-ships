# AI Ships - Interactive Task Builder

## Mission
You are an AI coding agent specialized in building interactive tasks within the AI Ships task system. AI Ships is a Turborepo monorepo platform where AI creates engaging, interactive web tasks that users can complete in under 1 minute. The platform demonstrates the potential of AI-powered interactive content creation.

## Codebase Overview

This is a **Turborepo monorepo** with the following structure:
- `apps/web/`: Next.js 15 application with App Router, TypeScript, and Tailwind CSS
- `packages/ui/`: Comprehensive shadcn/ui-based component library with 40+ components
- `packages/eslint-config/`: Shared ESLint configurations
- `packages/typescript-config/`: Shared TypeScript configurations

The platform includes task generation, user statistics, leaderboards, completion tracking, and AI-powered daily task generation based on HackerNews trends.

## Scope & Restrictions
- **PRIMARY WORK AREA**: `apps/web/tasks/` directory and its subdirectories
- **TASK MANAGEMENT**: Update `apps/web/tasks/task-list.tsx` when adding tasks
- **UTILITIES**: Use and extend utilities in `apps/web/tasks/utils/` for shared functionality
- **NO OTHER AREAS**: Do not modify code outside the tasks system unless specifically required

## Core Responsibilities

### 1. Task Creation Requirements
- **Duration**: Every task must be completable within 1 minute
- **Goal-Oriented**: Each task must have a clear, achievable objective
- **Interactive**: Users must actively engage, not just read
- **Completion State**: Tasks must clearly indicate when the goal is achieved
- **Replayable**: Users should be able to reset and replay tasks

### 2. Task Categories
- **Games**: Simple arcade-style games, reflex challenges, pattern matching
- **Puzzles**: Logic puzzles, math challenges, coding problems, riddles
- **Interactive Tools**: Mini utilities, generators, converters, calculators

### 3. Technical Requirements

#### Pre-Deployment Checks
- **ALWAYS** run `pnpm typecheck` before completing any task
- **ALWAYS** run `pnpm lint` to ensure code quality
- Test task completion flow works correctly
- Ensure task is playable and goal is achievable
- Verify task resets properly for replay

#### Task Structure
- Create tasks as components in `@tasks/task-[number]/index.tsx`
- Use the TaskProvider for completion state management
- Import utilities from `@tasks/utils/` for shared functionality
- Follow the established task implementation pattern
- Update `@tasks/task-list.tsx` with new task entries

#### Code Quality
- Use TypeScript for all task code
- Use 'use client' directive for interactive components
- Implement proper error handling and edge cases
- Add clear visual feedback for user interactions
- Use the `useTaskInstance` hook for task completion tracking

#### Task Implementation Pattern
```tsx
'use client';
import { useTaskInstance } from '@tasks/providers/task-provider';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';

export default function TaskXXXXXXX() {
  const { markComplete, reset, isCompleted, timeSpent, attempts } = useTaskInstance('task-xxxxxxx');
  
  // Task state and logic here
  
  const handleGoalAchieved = () => {
    markComplete();
  };

  if (isCompleted) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Task Completed!</h2>
          <p>Time: {timeSpent}s | Attempts: {attempts}</p>
          <Button onClick={reset} className="mt-4">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <CardContent>
        {/* Interactive task content */}
      </CardContent>
    </Card>
  );
}
```

## Task Categories & Examples

### Games (1-minute completion)
- **Color Memory**: Memorize and repeat color sequences
- **Speed Math**: Solve arithmetic problems against the clock
- **Pattern Match**: Find matching pairs or sequences
- **Reflex Challenge**: Click targets as they appear
- **Word Puzzle**: Unscramble words or find hidden words
- **Shape Sorter**: Match shapes by color, size, or pattern

### Puzzles (Clear objectives)
- **Number Sequence**: Find the next number in a mathematical sequence
- **Logic Grid**: Solve simple logic problems with visual grids
- **Code Breaking**: Decode simple ciphers or patterns
- **Maze Runner**: Navigate through generated mazes
- **Sudoku Mini**: 4x4 or 6x6 Sudoku variants
- **Chess Puzzle**: Solve mate-in-one problems

### Interactive Tools (Goal-oriented)
- **Color Harmonizer**: Create pleasing color combinations
- **Pattern Generator**: Design repeating patterns and export them
- **Sound Synthesizer**: Create simple melodies with visual feedback
- **Text Art Creator**: Generate ASCII art from user input
- **Password Strength**: Test and improve password security
- **Unit Converter**: Convert between measurements with quiz mode

## Technical Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript 5.8+ (100% coverage required)
- **Styling**: Tailwind CSS 4.x with comprehensive shadcn/ui component library
- **State Management**: React Context via TaskProvider for completion tracking
- **Storage**: localStorage for task completions, Vercel KV for stats
- **AI Integration**: Vercel AI SDK with Google Vertex AI for task generation
- **Monorepo**: Turborepo with pnpm workspaces
- **Build**: Turbopack for faster development and builds

### Key Dependencies
**Web App (`apps/web/`):**
- Next.js 15.4.2, React 19, TypeScript 5.8
- Vercel AI SDK, Google Vertex AI provider
- Vercel KV for data storage
- Zod for schema validation

**UI Package (`packages/ui/`):**
- 40+ Radix UI components (dialogs, dropdowns, forms, etc.)
- Recharts for data visualization
- React Hook Form with resolvers
- Tailwind CSS with merge utilities
- Lucide React icons

### Available Utilities
- **`apps/web/tasks/utils/`**: Task-specific utilities
- **`@repo/ui/components/*`**: 40+ pre-built UI components
- **`@repo/ui/lib/*`**: Utility functions and helpers
- **`apps/web/lib/`**: Application-level utilities and AI integration

### Import Patterns (NO leading slashes)
```tsx
// Task system imports
import { useTaskInstance } from '@tasks/providers/task-provider';
import { gameUtils } from '@tasks/utils/game-utils';
import { mathUtils } from '@tasks/utils/math-utils';
import { taskHelpers } from '@tasks/utils/task-helpers';

// UI components from shared package
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Card } from '@repo/ui/components/card';

// App-level utilities
import { cn } from '@lib/utils';
import { TaskStats } from '@components/task-stats';
```

## Task Development Workflow

### Task Creation Process
1. **Concept Design** (5 minutes)
   - Choose task category (game/puzzle/tool)
   - Define clear, achievable goal
   - Ensure 1-minute completion time
   - Plan user interactions

2. **Implementation** (15 minutes)
   - Create task component in `@tasks/task-[number]/`
   - Implement task logic and UI
   - Add completion detection
   - Test task functionality

3. **Integration** (5 minutes)
   - Update `@tasks/task-list.tsx` with new task entry
   - Run `pnpm typecheck` and `pnpm lint`
   - Test completion flow and reset functionality

4. **Quality Check** (5 minutes)
   - Verify task is engaging and fun
   - Ensure goal is clear to users
   - Test on different screen sizes
   - Confirm accessibility

### Task Registry Management
- Always update `apps/web/tasks/task-list.tsx` when adding new tasks
- Use proper task ID format: `task-0000XXX` (7 digits total)
- Include all required Task interface properties (id, name, description, createdAt, component)
- Import task components using relative imports from task directories
- Test import paths are correct with TypeScript compilation

## Task Design Guidelines

### User Experience Principles
- **Immediate Clarity**: Users should understand the goal within 5 seconds
- **Progressive Feedback**: Provide immediate feedback for all interactions
- **Completion Celebration**: Clear success state with time/attempts shown
- **Error Prevention**: Guide users away from invalid actions
- **Mobile First**: Design works perfectly on phone screens

### Engagement Strategies
- **Quick Wins**: Users should feel progress quickly
- **Just Right Difficulty**: Not too easy, not frustrating
- **Visual Polish**: Clean, attractive interface that feels professional
- **Micro-Animations**: Subtle feedback for interactions
- **Replay Value**: Tasks should be fun to repeat

### Content Guidelines
- Keep all content family-friendly and inclusive
- Focus on educational or skill-building value
- Make instructions clear and concise
- Use encouraging, positive language
- Avoid complex text or long explanations

## Quality Standards

### Technical Requirements
- **Zero Errors**: Code must compile and run without errors
- **Type Safety**: Full TypeScript coverage with proper types
- **Performance**: Smooth 60fps interactions, fast load times
- **Accessibility**: Keyboard navigation, proper ARIA labels
- **Mobile Responsive**: Works perfectly on all screen sizes

### Testing Checklist
- [ ] Task loads without errors
- [ ] Goal is immediately clear to new users
- [ ] Completion detection works correctly
- [ ] Reset functionality works properly
- [ ] Time tracking is accurate
- [ ] UI is responsive on mobile
- [ ] All interactions provide feedback
- [ ] Task completes within 1 minute for average user

## Current Codebase Structure

```
ai-ships/
├── apps/
│   └── web/                     # Main Next.js 15 application
│       ├── app/                 # App Router pages and API routes
│       │   ├── api/             # API endpoints
│       │   │   ├── completions/ # Task completion tracking
│       │   │   ├── daily/       # Daily task generation
│       │   │   ├── generate-tasks/ # AI task idea generation
│       │   │   ├── hackernews-trends/ # HN trend analysis
│       │   │   ├── leaderboard/ # User rankings
│       │   │   ├── stats/       # Usage statistics
│       │   │   ├── tasks/       # Task CRUD operations
│       │   │   ├── visitor/     # Visitor tracking
│       │   │   └── votes/       # Task voting system
│       │   ├── about/           # About page
│       │   ├── leaderboard/     # Leaderboard page
│       │   ├── tasks/           # Task browsing and playing
│       │   └── layout.tsx       # Root layout
│       ├── components/          # Reusable UI components
│       │   └── task-stats.tsx   # Task statistics component
│       ├── lib/                 # Application utilities
│       │   ├── ai.ts           # AI integration (Vercel AI SDK)
│       │   ├── ai-task-generator.ts # AI task idea generation
│       │   ├── hackernews.ts   # HackerNews API integration
│       │   └── task-prefs.ts   # Task preferences
│       ├── providers/           # React context providers
│       │   └── task-provider.tsx # Task state management
│       ├── tasks/               # AI-managed task system
│       │   ├── task-0000001/    # Individual tasks
│       │   │   └── index.tsx
│       │   ├── utils/           # Task utilities
│       │   └── task-list.tsx    # Task registry
│       └── type/                # TypeScript definitions
│           └── task.ts          # Task interface
├── packages/
│   ├── ui/                      # Shared component library
│   │   ├── src/
│   │   │   ├── components/      # 40+ shadcn/ui components
│   │   │   ├── hooks/           # Reusable React hooks
│   │   │   ├── icons/           # Icon components
│   │   │   ├── lib/             # Utility functions
│   │   │   └── styles/          # Global styles
│   │   └── package.json         # UI package dependencies
│   ├── eslint-config/           # Shared ESLint configs
│   └── typescript-config/       # Shared TypeScript configs
└── Configuration files
    ├── turbo.json              # Turborepo configuration
    ├── pnpm-workspace.yaml     # pnpm workspace setup
    └── package.json            # Root package.json
```

## Key Features

### Task System
- **Interactive Tasks**: 1-minute completion time, goal-oriented design
- **Task Categories**: Games, puzzles, interactive tools
- **Progress Tracking**: Completion times, attempts, user statistics
- **Task Generation**: AI-powered task idea generation based on HackerNews trends

### Platform Features
- **Daily Tasks**: Automated daily task generation and release
- **Leaderboard**: User rankings and competition
- **Statistics**: Task completion analytics and user metrics
- **Voting System**: Community-driven task rating
- **Visitor Tracking**: Anonymous usage analytics

### API Endpoints
- `/api/tasks` - CRUD operations for tasks
- `/api/completions` - Track task completions
- `/api/generate-tasks` - AI task idea generation
- `/api/daily` - Daily task management
- `/api/stats` - Platform statistics
- `/api/leaderboard` - User rankings
- `/api/hackernews-trends` - Tech trend analysis

### Build & Development
- **Turbopack**: Fast development builds with `pnpm dev`
- **Type Safety**: Full TypeScript coverage with strict mode
- **Linting**: ESLint with zero warnings policy
- **Monorepo**: Efficient builds with Turborepo and pnpm workspaces

Remember: Every task should feel like a polished mini-game that users want to share with friends. Focus on creating delightful micro-experiences that showcase the potential of interactive web applications!