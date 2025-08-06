# Coding Rules for AI Ships Task System

## Scope & Purpose
This AI coding agent **ONLY** works within the tasks system:
- **Primary workspace**: `@tasks/` directory
- **Task components**: Individual task implementations
- **Task utilities**: Helper functions and shared logic in `@tasks/utils/`
- **Task types**: Type definitions for task system
- **NO OTHER AREAS**: Agent should not modify code outside the tasks system

## Task Development Guidelines

### 1. Task Categories & Requirements
Tasks should be:
- **Games**: Easy to play and complete within 1 minute
- **Puzzles**: Coding, math, or logical challenges
- **Interactive & Fun**: Keep users engaged with immediate feedback
- **Goal-oriented**: Every task must have a clear completion state
- **Self-contained**: Each task should work independently

### 2. Task Architecture

#### Task Component Structure
```
apps/web/tasks/
├── task-[number]/
│   └── index.tsx           # Main task component
├── utils/
│   ├── task-helpers.ts     # Shared utility functions
│   ├── game-utils.ts       # Game-specific utilities
│   └── math-utils.ts       # Math/logic utilities
├── task-list.tsx           # Task registry (AI manages)
└── providers/
    └── task-provider.tsx   # Task state management
```

#### Task Implementation Pattern
```tsx
'use client';
import { useTask } from '@tasks/providers/task-provider';
import { gameHelpers } from '@tasks/utils/game-utils';

export default function TaskXXXXXXX() {
  const { markTaskComplete, resetTask, isCompleted } = useTask();
  
  // Task logic here
  
  const handleGoalAchieved = () => {
    markTaskComplete('task-xxxxxxx');
  };

  if (isCompleted) {
    return <CompletionScreen onReset={() => resetTask('task-xxxxxxx')} />;
  }

  return (
    <div>
      {/* Interactive task content */}
    </div>
  );
}
```

### 3. Import Path Conventions
- **Tasks**: `@tasks/task-[number]` - NO leading slash
- **Task Utils**: `@tasks/utils/[utility-name]` - NO leading slash  
- **Task Providers**: `@tasks/providers/[provider-name]` - NO leading slash
- **Task Types**: `@type/task` - NO leading slash
- **External Components**: `@components/[component-name]` - NO leading slash
- **External Libraries**: `@lib/[lib-name]` - NO leading slash

#### Correct Import Examples
```tsx
import { useTask } from '@tasks/providers/task-provider';
import { randomColor } from '@tasks/utils/color-helpers';
import { Task } from '@type/task';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
```

### 4. Quality Assurance
- **ALWAYS** run `pnpm typecheck` before completing any task implementation
- **ALWAYS** run `pnpm lint` to ensure code quality
- Test task completion flow works correctly
- Ensure task is playable and goal is achievable
- Verify task resets properly for replay

## File Structure

```
apps/web/
├── app/                    # Next.js 13+ App Router pages
│   ├── page.tsx           # Server component for data fetching
│   └── [other]/page.tsx   # More server components
├── components/            # Reusable components (mostly client components)
│   ├── [page-name]-client.tsx  # Client components for page logic
│   └── [shared-component].tsx  # Shared UI components
├── lib/                   # Utility functions and server-side logic
├── providers/             # React context providers
└── types/                 # TypeScript type definitions
```

## Page Refactoring Pattern

### Before (Client Component Page):
```tsx
'use client';
export default function SomePage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>{/* UI logic */}</div>;
}
```

### After (Server Component + Client Component):

**Page (Server Component):**
```tsx
import { getData } from "@/lib/data-source";
import { SomePageClient } from "@components/some-page-client";

export const dynamic = "force-dynamic";

export default async function SomePage() {
  const data = await getData();
  return <SomePageClient initialData={data} />;
}
```

**Component (Client Component):**
```tsx
'use client';
interface SomePageClientProps {
  initialData: DataType[];
}

export function SomePageClient({ initialData }: SomePageClientProps) {
  const [data, setData] = useState(initialData);
  // ... interactive logic
  return <div>{/* UI logic */}</div>;
}
```

## TypeScript Configuration

Ensure `tsconfig.json` includes the correct path mappings:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/ui/*": ["../../packages/ui/src/*"],
      "@components/*": ["./components/*"],
      "@*": ["./*"]
    }
  }
}
```

## Benefits of This Architecture

1. **Better Performance**: Initial data is fetched on the server, reducing client-side loading states
2. **SEO Friendly**: Server-rendered content with data is indexable
3. **Better UX**: Faster initial page loads with pre-populated data
4. **Cleaner Separation**: Pages handle data, components handle UI and interactions
5. **Consistent Import Paths**: Clear distinction between component imports (`@components`) and other imports (`@/`)

## Migration Checklist

When refactoring a page:

- [ ] Move client-side data fetching to server-side using RSC
- [ ] Extract interactive UI logic to a client component in `@components/`
- [ ] Update imports to use `@components` for component imports
- [ ] Add `export const dynamic = "force-dynamic"` if needed
- [ ] Pass initial data as props to client component
- [ ] Test that the page still works with server-rendered initial data