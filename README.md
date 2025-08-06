# AI Ships 🚀 - Interactive Task Builder

**AI Ships** is an experimental platform where AI creates engaging, interactive web tasks that users can complete in under 1 minute. Each task is a polished micro-experience designed to be fun, educational, and shareable.

## 🎯 Project Vision

AI Ships demonstrates the potential of AI-powered interactive content creation. The AI agent specializes in building:

- **Games**: Simple arcade-style games, reflex challenges, pattern matching
- **Puzzles**: Logic puzzles, math challenges, coding problems, riddles  
- **Interactive Tools**: Mini utilities, generators, converters, calculators

Every task is designed to be completed within 1 minute and provide immediate satisfaction.

## 🏗️ Architecture

This is a Turborepo monorepo built with modern web technologies:

### Apps and Packages

- `apps/web`: Main Next.js 15 application with the task system
- `packages/ui`: Shared React component library (shadcn/ui based)
- `packages/eslint-config`: ESLint configurations
- `packages/typescript-config`: TypeScript configurations

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (100% coverage)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context for task completion tracking
- **Storage**: localStorage for progress and completions
- **Monorepo**: Turborepo for efficient builds and development

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18
- **pnpm**: >= 9.0.0 (required package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-ships

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev

# The web app will be available at http://localhost:3000
```

### Building

```bash
# Build all apps and packages
pnpm build

# Build only the web app
turbo build --filter=web
```

### Code Quality

```bash
# Run TypeScript type checking
pnpm typecheck

# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format
```

## 🎮 Task System Overview

### What are Tasks?

Tasks are self-contained interactive experiences that users can complete in under 1 minute. Each task includes:

- **Clear Goal**: Immediate understanding of what to achieve
- **Interactive UI**: Engaging user interface with real-time feedback
- **Completion Tracking**: Progress tracking with time and attempts
- **Replay Capability**: Users can reset and replay tasks

### Task Categories

1. **Games**: Pattern matching, reflex challenges, memory games
2. **Puzzles**: Logic problems, math challenges, code challenges  
3. **Tools**: Interactive utilities, generators, calculators

### Current Tasks

- **Task #1**: Interactive Color Palette Generator

## 🤖 AI Task Development

### For AI Agents

This project includes specialized AI agents that build tasks within the `@tasks/` directory. The AI follows strict guidelines:

- **Scope**: Work only within the task system (`apps/web/tasks/`)
- **Duration**: All tasks must be completable within 1 minute
- **Quality**: Full TypeScript coverage, proper testing, mobile responsive
- **Architecture**: Use the established task patterns and utilities

See [`Claude.md`](./Claude.md) for detailed AI agent instructions.

### Task Structure

```
apps/web/tasks/
├── task-[number]/
│   └── index.tsx           # Task component
├── utils/
│   ├── task-helpers.ts     # Shared utilities
│   ├── game-utils.ts       # Game mechanics
│   └── math-utils.ts       # Math/logic utilities
├── providers/
│   └── task-provider.tsx   # Task state management
└── task-list.tsx           # Task registry
```

## 🛠️ Contributing

### For Developers

1. **Focus Area**: Main application development outside the task system
2. **Task System**: Managed exclusively by AI agents
3. **Code Quality**: Maintain TypeScript coverage and follow established patterns

### For AI Agents

1. **Read Guidelines**: Study [`Claude.md`](./Claude.md) and [`CODING_RULES.md`](./CODING_RULES.md)
2. **Task Scope**: Work only within `@tasks/` directory
3. **Quality Checks**: Always run `pnpm typecheck` and `pnpm lint`
4. **Testing**: Ensure tasks work on mobile and achieve 1-minute completion

### Code Quality Standards

- **TypeScript**: 100% coverage required
- **Linting**: ESLint must pass with max 0 warnings
- **Testing**: Manual testing for task completion flows
- **Mobile**: All tasks must work on phone screens
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📁 Project Structure

```
ai-ships/
├── apps/
│   └── web/                # Main Next.js application
│       ├── app/            # Next.js 15 App Router pages
│       ├── components/     # Reusable UI components
│       ├── tasks/          # AI-managed task system
│       ├── lib/            # Utility functions
│       ├── providers/      # React context providers
│       └── type/           # TypeScript definitions
├── packages/
│   ├── ui/                 # Shared component library
│   ├── eslint-config/      # ESLint configurations
│   └── typescript-config/  # TypeScript configurations
└── docs/
    ├── Claude.md           # AI agent instructions
    └── CODING_RULES.md     # Development guidelines
```

## 🔗 Useful Links

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Turborepo Documentation](https://turborepo.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
