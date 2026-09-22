// ---------------------------------------------------------------------------
// constants.ts — App-wide constants and seed data
// ---------------------------------------------------------------------------

import type { WorkspaceState, WorkspaceMeta, WorkspaceRegistry } from "@/src/types/workspace";

// ── Multi-Workspace Storage Keys ────────────────────────────────

/** localStorage key for the workspace registry (list + active ID) */
export const WORKSPACE_REGISTRY_KEY = "wspace-registry";

/** Prefix for per-workspace item data keys: wspace-data-{workspaceId} */
export const WORKSPACE_DATA_PREFIX = "wspace-data-";

/** Legacy key — for migration from single-workspace */
export const LEGACY_STORAGE_KEY = "wspace-workspace-data";

// ── Defaults ────────────────────────────────────────────────────

export const DEFAULT_WORKSPACE_NAME = "My Workspace";
export const DEFAULT_WORKSPACE_EMOJI = "🚀";
export const DEFAULT_WORKSPACE_COLOR = "#4c35ae";

// ── Timing ──────────────────────────────────────────────────────

/** Debounce delay for localStorage writes (ms) */
export const DEBOUNCE_MS = 300;

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_MS = 250;

// ── Workspace Appearance Options ────────────────────────────────

export const WORKSPACE_EMOJI_OPTIONS = [
  "🚀", "💼", "🎨", "📚", "🏠", "💡", "🔬", "🎮",
  "🎵", "📷", "✈️", "🌿", "⚡", "🔥", "💎", "🎯",
  "🏗️", "📦", "🌈", "⭐",
] as const;

export const WORKSPACE_COLOR_OPTIONS = [
  { label: "Indigo",   value: "#4c35ae" },
  { label: "Blue",     value: "#2563eb" },
  { label: "Cyan",     value: "#0891b2" },
  { label: "Teal",     value: "#0d9488" },
  { label: "Emerald",  value: "#10b981" },
  { label: "Amber",    value: "#f59e0b" },
  { label: "Orange",   value: "#ea580c" },
  { label: "Rose",     value: "#e11d48" },
  { label: "Pink",     value: "#db2777" },
  { label: "Violet",   value: "#7c3aed" },
  { label: "Slate",    value: "#475569" },
] as const;

// ── Seed Workspaces ─────────────────────────────────────────────

interface SeedWorkspace {
  meta: Omit<WorkspaceMeta, "id" | "createdAt" | "updatedAt" | "itemCount">;
  items: Omit<WorkspaceItem, "createdAt" | "updatedAt">[];
}

import type { WorkspaceItem } from "@/src/types/workspace";

const SEED_WORKSPACES: SeedWorkspace[] = [
  // ── 1. Work Projects ──────────────────────────────────────
  {
    meta: { name: "Work Projects", emoji: "💼", color: "#2563eb" },
    items: [
      { id: "wp-folder-frontend", name: "Frontend", type: "folder", parentId: null },
      { id: "wp-folder-backend", name: "Backend", type: "folder", parentId: null },
      { id: "wp-folder-design", name: "Design", type: "folder", parentId: null },
      { id: "wp-folder-frontend-components", name: "Components", type: "folder", parentId: "wp-folder-frontend" },
      { id: "wp-folder-frontend-hooks", name: "Hooks", type: "folder", parentId: "wp-folder-frontend" },
      { id: "wp-file-readme", name: "README.md", type: "file", parentId: null, content: "# Work Projects\n\nCentral hub for all active client and internal projects.\n\n## Active Sprint\n- Dashboard redesign\n- API v2 migration\n- Performance audit\n\n## Team\n- Frontend: 3 developers\n- Backend: 2 developers\n- Design: 1 designer" },
      { id: "wp-file-tasks", name: "sprint-tasks.md", type: "file", parentId: null, content: "# Sprint 24 — Oct 2025\n\n## In Progress\n- [ ] Dashboard widget redesign\n- [ ] API rate limiting\n- [ ] User auth flow cleanup\n\n## Done\n- [x] Set up CI/CD pipeline\n- [x] Database migration scripts\n- [x] Component library v2\n\n## Blocked\n- [ ] Payment integration (waiting on vendor)" },
      { id: "wp-file-button", name: "Button.tsx", type: "file", parentId: "wp-folder-frontend-components", content: "import { cva, type VariantProps } from \"class-variance-authorship\";\nimport { forwardRef } from \"react\";\n\nconst buttonVariants = cva(\n  \"inline-flex items-center justify-center rounded-md font-medium transition-colors\",\n  {\n    variants: {\n      variant: {\n        primary: \"bg-primary text-white hover:bg-primary/90\",\n        secondary: \"bg-secondary text-secondary-foreground hover:bg-secondary/80\",\n        ghost: \"hover:bg-accent hover:text-accent-foreground\",\n      },\n      size: {\n        sm: \"h-9 px-3\",\n        md: \"h-10 px-4\",\n        lg: \"h-11 px-6\",\n      },\n    },\n    defaultVariants: { variant: \"primary\", size: \"md\" },\n  }\n);" },
      { id: "wp-file-modal", name: "Modal.tsx", type: "file", parentId: "wp-folder-frontend-components", content: "import { Fragment, type ReactNode } from \"react\";\nimport { Dialog, Transition } from \"@headlessui/react\";\n\ninterface ModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  title?: string;\n  children: ReactNode;\n}\n\nexport function Modal({ isOpen, onClose, title, children }: ModalProps) {\n  return (\n    <Transition appear show={isOpen} as={Fragment}>\n      <Dialog as=\"div\" className=\"relative z-50\" onClose={onClose}>\n        <Transition.Child\n          as={Fragment}\n          enter=\"ease-out duration-300\"\n          enterFrom=\"opacity-0\"\n          enterTo=\"opacity-100\"\n          leave=\"ease-in duration-200\"\n          leaveFrom=\"opacity-100\"\n          leaveTo=\"opacity-0\"\n        >\n          <div className=\"fixed inset-0 bg-black/40\" />\n        </Transition.Child>\n      </Dialog>\n    </Transition>\n  );\n}" },
      { id: "wp-file-use-debounce", name: "useDebounce.ts", type: "file", parentId: "wp-folder-frontend-hooks", content: "import { useState, useEffect } from \"react\";\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}" },
      { id: "wp-file-api-routes", name: "routes.ts", type: "file", parentId: "wp-folder-backend", content: "import { Router } from \"express\";\nimport { authMiddleware } from \"./middleware/auth\";\nimport { userController } from \"./controllers/user\";\nimport { projectController } from \"./controllers/project\";\n\nconst router = Router();\n\n// Auth routes\nrouter.post(\"/auth/login\", userController.login);\nrouter.post(\"/auth/register\", userController.register);\nrouter.post(\"/auth/refresh\", userController.refreshToken);\n\n// Protected routes\nrouter.use(authMiddleware);\nrouter.get(\"/projects\", projectController.list);\nrouter.post(\"/projects\", projectController.create);\nrouter.put(\"/projects/:id\", projectController.update);\nrouter.delete(\"/projects/:id\", projectController.delete);\n\nexport default router;" },
      { id: "wp-file-migration", name: "003_add_indexes.sql", type: "file", parentId: "wp-folder-backend", content: "-- Migration: Add performance indexes\n-- Date: 2025-10-15\n\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_users_created_at ON users(created_at DESC);\nCREATE INDEX idx_projects_owner ON projects(owner_id);\nCREATE INDEX idx_projects_status ON projects(status) WHERE status != 'archived';\nCREATE INDEX idx_tasks_project ON tasks(project_id);\nCREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE assigned_to IS NOT NULL;\nCREATE INDEX idx_audit_log_timestamp ON audit_log(created_at DESC);\nCREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);" },
      { id: "wp-file-colors", name: "color-palette.md", type: "file", parentId: "wp-folder-design", content: "# Brand Color Palette\n\n## Primary\n- Indigo 600: #4f46e5\n- Indigo 500: #6366f1\n- Indigo 400: #818cf8\n\n## Neutral\n- Slate 900: #0f172a\n- Slate 700: #334155\n- Slate 500: #64748b\n- Slate 300: #cbd5e1\n- Slate 100: #f1f5f9\n\n## Semantic\n- Success: #10b981\n- Warning: #f59e0b\n- Error: #ef4444\n- Info: #3b82f6\n\n## Usage\n- Background: Slate 50 (#f8fafc)\n- Text primary: Slate 900\n- Text secondary: Slate 500\n- Borders: Slate 200 (#e2e8f0)" },
      { id: "wp-file-wireframe", name: "dashboard-wireframe.md", type: "file", parentId: "wp-folder-design", content: "# Dashboard Wireframe\n\n## Layout\n```\n┌─────────────────────────────────────┐\n│  Header (logo, search, user menu)   │\n├────────┬────────────────────────────┤\n│        │  Stats Row (4 cards)       │\n│  Side  ├────────────────────────────┤\n│  bar   │  Main Content Area         │\n│        │  - Recent Activity         │\n│        │  - Charts                  │\n│        │  - Quick Actions           │\n└────────┴────────────────────────────┘\n```\n\n## Components\n- Sidebar: Collapsible, icon-only mode\n- Stats Cards: KPIs with trend indicators\n- Activity Feed: Real-time updates\n- Chart Widget: Line/Bar/Pie toggle\n- Quick Actions: Create, Import, Export" },
    ],
  },

  // ── 2. Design System ──────────────────────────────────────
  {
    meta: { name: "Design System", emoji: "🎨", color: "#7c3aed" },
    items: [
      { id: "ds-folder-tokens", name: "Tokens", type: "folder", parentId: null },
      { id: "ds-folder-components", name: "Components", type: "folder", parentId: null },
      { id: "ds-folder-patterns", name: "Patterns", type: "folder", parentId: null },
      { id: "ds-folder-tokens-colors", name: "Colors", type: "folder", parentId: "ds-folder-tokens" },
      { id: "ds-folder-tokens-typography", name: "Typography", type: "folder", parentId: "ds-folder-tokens" },
      { id: "ds-file-overview", name: "OVERVIEW.md", type: "file", parentId: null, content: "# Design System — Atoms v3\n\nOur unified design language for all products.\n\n## Principles\n1. **Consistency** — Same patterns across all surfaces\n2. **Accessibility** — WCAG 2.1 AA compliant\n3. **Performance** — Minimal CSS, no runtime overhead\n4. **Developer-friendly** — Tailwind-native, easy to customize\n\n## Quick Start\n```bash\nnpm install @workspace/design-tokens\n```\n\n## Tokens → Components → Patterns → Pages" },
      { id: "ds-file-spacing", name: "spacing.ts", type: "file", parentId: "ds-folder-tokens", content: "// Spacing scale — based on 4px grid\nexport const spacing = {\n  0: \"0px\",\n  0.5: \"2px\",\n  1: \"4px\",\n  1.5: \"6px\",\n  2: \"8px\",\n  2.5: \"10px\",\n  3: \"12px\",\n  3.5: \"14px\",\n  4: \"16px\",\n  5: \"20px\",\n  6: \"24px\",\n  7: \"28px\",\n  8: \"32px\",\n  9: \"36px\",\n  10: \"40px\",\n  12: \"48px\",\n  14: \"56px\",\n  16: \"64px\",\n  20: \"80px\",\n  24: \"96px\",\n  28: \"112px\",\n  32: \"128px\",\n  36: \"144px\",\n  40: \"160px\",\n  44: \"176px\",\n  48: \"192px\",\n  52: \"208px\",\n  56: \"224px\",\n  60: \"240px\",\n  64: \"256px\",\n  72: \"288px\",\n  80: \"320px\",\n  96: \"384px\",\n} as const;" },
      { id: "ds-file-shadows", name: "shadows.ts", type: "file", parentId: "ds-folder-tokens", content: "// Elevation system\nexport const shadows = {\n  xs: \"0 1px 2px 0 rgb(0 0 0 / 0.05)\",\n  sm: \"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)\",\n  md: \"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)\",\n  lg: \"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)\",\n  xl: \"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)\",\n  \"2xl\": \"0 25px 50px -12px rgb(0 0 0 / 0.25)\",\n  inner: \"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)\",\n  none: \"0 0 #0000\",\n} as const;" },
      { id: "ds-file-colors-primary", name: "primary.ts", type: "file", parentId: "ds-folder-tokens-colors", content: "// Primary color scale\nexport const primary = {\n  50:  \"#eef2ff\",\n  100: \"#e0e7ff\",\n  200: \"#c7d2fe\",\n  300: \"#a5b4fc\",\n  400: \"#818cf8\",\n  500: \"#6366f1\",\n  600: \"#4f46e5\",\n  700: \"#4338ca\",\n  800: \"#3730a3\",\n  900: \"#312e81\",\n  950: \"#1e1b4b\",\n} as const;\n\n// Neutral (Slate)\nexport const neutral = {\n  50:  \"#f8fafc\",\n  100: \"#f1f5f9\",\n  200: \"#e2e8f0\",\n  300: \"#cbd5e1\",\n  400: \"#94a3b8\",\n  500: \"#64748b\",\n  600: \"#475569\",\n  700: \"#334155\",\n  800: \"#1e293b\",\n  900: \"#0f172a\",\n  950: \"#020617\",\n} as const;" },
      { id: "ds-file-fonts", name: "font-sizes.ts", type: "file", parentId: "ds-folder-tokens-typography", content: "// Font size scale\nexport const fontSize = {\n  xs:   [\"0.75rem\",  { lineHeight: \"1rem\" }],     // 12px\n  sm:   [\"0.875rem\", { lineHeight: \"1.25rem\" }],  // 14px\n  base: [\"1rem\",     { lineHeight: \"1.5rem\" }],   // 16px\n  lg:   [\"1.125rem\", { lineHeight: \"1.75rem\" }],  // 18px\n  xl:   [\"1.25rem\",  { lineHeight: \"1.75rem\" }],  // 20px\n  \"2xl\":[\"1.5rem\",   { lineHeight: \"2rem\" }],     // 24px\n  \"3xl\":[\"1.875rem\", { lineHeight: \"2.25rem\" }],  // 30px\n  \"4xl\":[\"2.25rem\",  { lineHeight: \"2.5rem\" }],   // 36px\n  \"5xl\":[\"3rem\",     { lineHeight: \"1\" }],        // 48px\n} as const;" },
      { id: "ds-file-button-doc", name: "Button.md", type: "file", parentId: "ds-folder-components", content: "# Button Component\n\n## Usage\n```tsx\nimport { Button } from \"@workspace/design-system\";\n\n<Button variant=\"primary\" size=\"md\">Click me</Button>\n```\n\n## Variants\n| Variant    | Usage                    |\n|------------|--------------------------|\n| primary    | Main actions, CTAs       |\n| secondary  | Alternative actions      |\n| ghost      | Inline, low-emphasis     |\n| destructive| Delete, remove, danger   |\n| outline    | Toggle-like, selectable  |\n\n## Sizes\n| Size | Height | Padding |\n|------|--------|---------|\n| sm   | 32px   | 12px    |\n| md   | 40px   | 16px    |\n| lg   | 44px   | 24px    |\n\n## Accessibility\n- Uses native `<button>` element\n- Keyboard navigable\n- Focus ring visible on :focus-visible\n- Disabled state with `aria-disabled`" },
      { id: "ds-file-modal-pattern", name: "modal-pattern.md", type: "file", parentId: "ds-folder-patterns", content: "# Modal Pattern\n\n## Structure\n```\n┌──────────────────────────────┐\n│  Header (title + close btn)  │\n├──────────────────────────────┤\n│                              │\n│  Body (scrollable content)   │\n│                              │\n├──────────────────────────────┤\n│  Footer (actions)            │\n└──────────────────────────────┘\n```\n\n## Behavior\n- Focus trapped inside modal\n- ESC to close\n- Click outside to close\n- Scroll lock on body\n- Return focus to trigger on close\n\n## Sizing\n- sm: max-w-md (448px)\n- md: max-w-lg (512px)\n- lg: max-w-xl (576px)\n- full: max-w-4xl (896px)" },
    ],
  },

  // ── 3. Learning Notes ─────────────────────────────────────
  {
    meta: { name: "Learning Notes", emoji: "📚", color: "#0891b2" },
    items: [
      { id: "ln-folder-react", name: "React", type: "folder", parentId: null },
      { id: "ln-folder-typescript", name: "TypeScript", type: "folder", parentId: null },
      { id: "ln-folder-system-design", name: "System Design", type: "folder", parentId: null },
      { id: "ln-folder-react-hooks", name: "Hooks Deep Dive", type: "folder", parentId: "ln-folder-react" },
      { id: "ln-folder-react-patterns", name: "Patterns", type: "folder", parentId: "ln-folder-react" },
      { id: "ln-file-react-overview", name: "react-19-whats-new.md", type: "file", parentId: "ln-folder-react", content: "# React 19 — Key Changes\n\n## New Features\n1. **Actions** — `useActionState` for form handling\n2. **use()** — Read resources in render (replaces some useEffect patterns)\n3. **Document Metadata** — `<title>`, `<meta>` in components\n4. **Styles** — `<style>` components with precedence\n5. **Ref as prop** — No more `forwardRef`\n\n## Improvements\n- Server Components stable\n- Server Actions refined\n- Automatic memoization (no more useMemo/useCallback in most cases)\n- Improved error boundaries\n\n## Deprecations\n- Legacy Context\n- String refs\n-findDOMNode()" },
      { id: "ln-file-usestate", name: "useState.md", type: "file", parentId: "ln-folder-react-hooks", content: "# useState\n\n## Basic Usage\n```tsx\nconst [count, setCount] = useState(0);\n```\n\n## Lazy Initialization\n```tsx\n// Only runs once on mount\nconst [state, setState] = useState(() => {\n  return expensiveComputation();\n});\n```\n\n## Functional Updates\n```tsx\n// Always use when new state depends on previous\nsetCount(prev => prev + 1);\n```\n\n## Common Patterns\n- Boolean toggle: `setFlag(f => !f)`\n- Array append: `setItems(items => [...items, newItem])`\n- Object merge: `setUser(u => ({ ...u, name: \"New\" }))`\n\n## Gotchas\n- State batching (React 18+)\n- Stale closures\n- Object/array immutability" },
      { id: "ln-file-useeffect", name: "useEffect.md", type: "file", parentId: "ln-folder-react-hooks", content: "# useEffect\n\n## Mental Model\nuseEffect is for **synchronizing with external systems**.\n\n## Common Use Cases\n1. Data fetching (though useQuery is better)\n2. Subscriptions (WebSocket, EventSource)\n3. DOM mutations (title, scroll position)\n4. Third-party library initialization\n\n## Cleanup\n```tsx\nuseEffect(() => {\n  const subscription = ws.subscribe(data);\n  return () => subscription.unsubscribe();\n}, []);\n```\n\n## Dependencies\n- Always list all reactive values\n- Use ESLint plugin to catch missing deps\n- Empty array `[]` = run once on mount\n\n## Anti-patterns\n- Don't use for derived state (use useMemo)\n- Don't use for event handlers (use callbacks)\n- Don't suppress the linter" },
      { id: "ln-file-compound", name: "compound-components.md", type: "file", parentId: "ln-folder-react-patterns", content: "# Compound Components Pattern\n\n## Concept\nA group of components that work together to form a complete UI element, sharing implicit state.\n\n## Example: Tabs\n```tsx\n<Tabs defaultValue=\"tab1\">\n  <Tabs.List>\n    <Tabs.Trigger value=\"tab1\">Tab 1</Tabs.Trigger>\n    <Tabs.Trigger value=\"tab2\">Tab 2</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value=\"tab1\">Content 1</Tabs.Content>\n  <Tabs.Content value=\"tab2\">Content 2</Tabs.Content>\n</Tabs>\n```\n\n## Implementation\n- React Context for shared state\n- Each sub-component reads/writes to context\n- Parent controls which child is active\n\n## Benefits\n- Flexible composition\n- Clear API\n- Encapsulated state management" },
      { id: "ln-file-ts-generics", name: "generics-cheatsheet.md", type: "file", parentId: "ln-folder-typescript", content: "# TypeScript Generics Cheatsheet\n\n## Basic\n```ts\nfunction identity<T>(arg: T): T { return arg; }\n```\n\n## Constrained\n```ts\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n```\n\n## Generic Interfaces\n```ts\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  timestamp: Date;\n}\n```\n\n## Utility Types\n```ts\nPartial<T>     // All props optional\nRequired<T>    // All props required\nPick<T, K>     // Select specific props\nOmit<T, K>     // Remove specific props\nRecord<K, V>   // Object type\nReturnType<T>  // Extract return type\n```\n\n## Conditional Types\n```ts\ntype IsString<T> = T extends string ? true : false;\n```" },
      { id: "ln-file-lld", name: "url-shortener-lld.md", type: "file", parentId: "ln-folder-system-design", content: "# URL Shortener — Low-Level Design\n\n## Requirements\n- Create short URL from long URL\n- Redirect short URL to original\n- Custom aliases (optional)\n- Analytics (clicks, location)\n- TTL (optional expiry)\n\n## API Design\n```\nPOST /api/shorten\n  Body: { url: string, alias?: string, expiresAt?: Date }\n  Returns: { shortUrl: string, id: string }\n\nGET /:shortId\n  302 Redirect to original URL\n\nGET /api/stats/:shortId\n  Returns: { clicks, locations, referrers }\n```\n\n## Database Schema\n```sql\nCREATE TABLE urls (\n  id BIGINT PRIMARY KEY,\n  short_id VARCHAR(7) UNIQUE,\n  original_url TEXT NOT NULL,\n  user_id BIGINT REFERENCES users(id),\n  created_at TIMESTAMP DEFAULT NOW(),\n  expires_at TIMESTAMP,\n  click_count BIGINT DEFAULT 0\n);\n```\n\n## ID Generation\n- Base62 encoding of auto-increment ID\n- Or: hash-based (MD5 → truncate)\n- Or: pre-generated key service" },
    ],
  },

  // ── 4. Personal ───────────────────────────────────────────
  {
    meta: { name: "Personal", emoji: "🏠", color: "#10b981" },
    items: [
      { id: "pr-folder-recipes", name: "Recipes", type: "folder", parentId: null },
      { id: "pr-folder-journal", name: "Journal", type: "folder", parentId: null },
      { id: "pr-folder-goals", name: "Goals 2025", type: "folder", parentId: null },
      { id: "pr-folder-travel", name: "Travel Plans", type: "folder", parentId: null },
      { id: "pr-file-readme", name: "about-me.md", type: "file", parentId: null, content: "# About Me\n\n## Quick Facts\n- 📍 Location: Dhaka, Bangladesh\n- 💻 Role: Full-Stack Developer\n- 🎯 Focus: React, TypeScript, Node.js\n- ☕ Fuel: Tea (always tea)\n\n## Interests\n- Building things with code\n- Open source contributions\n- Photography (street & travel)\n- Reading sci-fi novels\n- Playing chess\n\n## Current Book\n\"Designing Data-Intensive Applications\" by Martin Kleppmann\n\n## Fun Fact\nI've used vim for 5 years and still can't exit it without Google." },
      { id: "pr-file-chicken-curry", name: "chicken-curry.md", type: "file", parentId: "pr-folder-recipes", content: "# Chicken Curry (Bangladeshi Style)\n\n## Ingredients\n- 1 kg chicken (bone-in, curry cut)\n- 3 large onions (sliced)\n- 4 tomatoes (chopped)\n- 2 tbsp ginger-garlic paste\n- 2 tsp cumin powder\n- 1 tsp turmeric\n- 2 tsp red chili powder\n- 1 tsp garam masala\n- Fresh cilantro\n- Salt to taste\n- 3 tbsp mustard oil\n\n## Steps\n1. Marinate chicken with turmeric, salt, and chili (30 min)\n2. Heat oil until smoking, then cool slightly\n3. Fry onions until golden brown\n4. Add ginger-garlic, cook 2 min\n5. Add tomatoes, cook until mushy\n6. Add spices, cook until oil separates\n7. Add chicken, sear on high heat\n8. Add 1 cup water, simmer 25 min\n9. Garnish with cilantro, serve with rice" },
      { id: "pr-file-dal", name: "dal-with-spinach.md", type: "file", parentId: "pr-folder-recipes", content: "# Dal with Spinach (Palong Shak er Dal)\n\n## Ingredients\n- 1 cup masoor dal (red lentils)\n- 2 cups fresh spinach (chopped)\n- 1 onion (diced)\n- 3 garlic cloves (sliced)\n- 1 green chili\n- 1 tsp cumin seeds\n- 1/2 tsp turmeric\n- Salt to taste\n- 2 tbsp ghee\n\n## Steps\n1. Wash and boil dal with turmeric until soft\n2. Mash slightly, add spinach\n3. Heat ghee, add cumin seeds\n4. Add garlic, fry until golden\n5. Add onion, cook until soft\n6. Pour tadka over dal\n7. Simmer 5 min, serve hot" },
      { id: "pr-file-journal-oct", name: "october-2025.md", type: "file", parentId: "pr-folder-journal", content: "# October 2025\n\n## Oct 15\nHad a great day today. Finished the workspace explorer project and it feels really polished. The sidebar collapse animation came out perfect.\n\n## Oct 12\nSpent the weekend hiking at Srimangal. The tea gardens are stunning this time of year. Took some amazing photos.\n\n## Oct 8\nStarted reading \"Atomic Habits\" again. The 1% improvement concept is so powerful when applied to coding practice.\n\n## Oct 1\nNew month, new goals. Focusing on:\n- Ship the dashboard feature\n- Run 3x this week\n- Read 20 pages daily" },
      { id: "pr-file-reading", name: "reading-list.md", type: "file", parentId: "pr-folder-goals", content: "# 2025 Reading Goal: 30 Books\n\n## Completed (18)\n1. Atomic Habits — James Clear ⭐⭐⭐⭐⭐\n2. Deep Work — Cal Newport ⭐⭐⭐⭐\n3. The Pragmatic Programmer ⭐⭐⭐⭐⭐\n4. Designing Data-Intensive Applications ⭐⭐⭐⭐⭐\n5. Clean Architecture — Robert Martin ⭐⭐⭐⭐\n6. The Psychology of Money ⭐⭐⭐⭐\n7. Range — David Epstein ⭐⭐⭐⭐\n8. Think Again — Adam Grant ⭐⭐⭐⭐\n9. The Midnight Library ⭐⭐⭐⭐\n10. Project Hail Mary ⭐⭐⭐⭐⭐\n11. Klara and the Sun ⭐⭐⭐⭐\n12. Sprint — Jake Knapp ⭐⭐⭐\n13. Shape Up ⭐⭐⭐⭐⭐\n14. The Mom Test ⭐⭐⭐⭐\n15. Zero to One — Peter Thiel ⭐⭐⭐⭐\n16. Shoe Dog — Phil Knight ⭐⭐⭐⭐⭐\n17. Can't Hurt Me — David Goggins ⭐⭐⭐⭐\n18. Educated — Tara Westover ⭐⭐⭐⭐\n\n## Currently Reading\n- The Design of Everyday Things — Don Norman\n\n## Up Next\n- Staff Engineer — Will Larson\n- An Elegant Puzzle — Will Larson\n- The Manager's Path — Camille Fournier" },
      { id: "pr-file-bangkok", name: "bangkok-trip.md", type: "file", parentId: "pr-folder-travel", content: "# Bangkok Trip — December 2025\n\n## Flight\n- Dec 20: DAC → BKK (Bangkok Airways PG068)\n- Dec 27: BKK → DAC (Bangkok Airways PG069)\n\n## Hotels\n- Dec 20-23: Ibis Bangkok Siam (Budget)\n- Dec 23-27: Anantara Riverside (Treat!)\n\n## Day Plans\n### Day 1 — Old City\n- Grand Palace\n- Wat Pho\n- Wat Arun (sunset)\n- Dinner: Jay Fai (crab omelette)\n\n### Day 2 — Shopping\n- Chatuchak Weekend Market\n- MBK Center\n- Terminal 21\n- Rooftop drinks at Sky Bar\n\n### Day 3 — Culture\n- Jim Thompson House\n- Erawan Museum\n- Asiatique Riverfront\n\n### Day 4 — Day Trip\n- Floating market (Damnoen Saduak)\n- Train market (Maeklong)\n\n## Budget\n- Flights: $400\n- Hotels: $500\n- Food: $200\n- Shopping: $300\n- Activities: $100\n- Total: ~$1,500" },
    ],
  },

  // ── 5. Research Lab ───────────────────────────────────────
  {
    meta: { name: "Research Lab", emoji: "🔬", color: "#e11d48" },
    items: [
      { id: "rl-folder-ml", name: "Machine Learning", type: "folder", parentId: null },
      { id: "rl-folder-frontend-perf", name: "Frontend Performance", type: "folder", parentId: null },
      { id: "rl-folder-papers", name: "Paper Summaries", type: "folder", parentId: null },
      { id: "rl-folder-ml-transformers", name: "Transformers", type: "folder", parentId: "rl-folder-ml" },
      { id: "rl-folder-ml-training", name: "Training Techniques", type: "folder", parentId: "rl-folder-ml" },
      { id: "rl-file-overview", name: "RESEARCH-LOG.md", type: "file", parentId: null, content: "# Research Log\n\n## Active Investigations\n\n### 1. Transformer Efficiency\nExploring sparse attention mechanisms for reduced memory usage.\nGoal: 50% reduction in VRAM with <2% accuracy loss.\n\n### 2. Web Vitals Optimization\nBenchmarking different rendering strategies:\n- SSR vs SSG vs ISR\n- Streaming SSR with React 19\n- Partial hydration patterns\n\n### 3. LLM Fine-tuning\nTesting LoRA and QLoRA on small datasets for domain-specific tasks.\n\n## Recent Findings\n- Flash Attention 2.0 gives 2-3x speedup on A100\n- React Server Components reduce JS bundle by 30-40%\n- LoRA rank 8-16 is sweet spot for small datasets" },
      { id: "rl-file-attention", name: "attention-mechanisms.md", type: "file", parentId: "rl-folder-ml-transformers", content: "# Attention Mechanisms — Survey\n\n## Self-Attention\n```\nAttention(Q, K, V) = softmax(QK^T / √d_k) V\n```\n- O(n²) complexity\n- Full pairwise interaction\n\n## Sparse Attention\n- Longformer: Local + global attention\n- BigBird: Random + local + global\n- Complexity: O(n × window_size)\n\n## Linear Attention\n- Perform QK first, then multiply by V\n- O(n) complexity\n- Trade-off: slight accuracy loss\n\n## Flash Attention\n- IO-aware exact attention\n- Tiling approach reduces memory\n- 2-3x faster on modern GPUs\n\n## Key Papers\n1. \"Attention Is All You Need\" (2017)\n2. \"FlashAttention\" (2022)\n3. \"FlashAttention-2\" (2023)\n4. \"Ring Attention\" (2023)" },
      { id: "rl-file-lora", name: "lora-fine-tuning.md", type: "file", parentId: "rl-folder-ml-training", content: "# LoRA Fine-tuning Guide\n\n## What is LoRA?\nLow-Rank Adaptation — freezes pre-trained weights and adds trainable rank decomposition matrices.\n\n## Why LoRA?\n- Train large models on consumer GPUs\n- 10-100x less VRAM than full fine-tuning\n- Multiple LoRA adapters for different tasks\n- Merge adapters back into base model\n\n## Hyperparameters\n| Parameter | Recommended |\n|-----------|-------------|\n| rank (r)  | 8-16        |\n| alpha     | 2× rank     |\n| dropout   | 0.05-0.1    |\n| target    | q_proj, v_proj |\n\n## QLoRA\n- Quantize base model to 4-bit\n- LoRA in FP16/BF16\n- Even less VRAM (~6GB for 7B models)\n\n## Implementation (PEFT)\n```python\nfrom peft import LoraConfig, get_peft_model\n\nconfig = LoraConfig(\n    r=16,\n    lora_alpha=32,\n    target_modules=[\"q_proj\", \"v_proj\"],\n    lora_dropout=0.05,\n    task_type=\"CAUSAL_LM\"\n)\nmodel = get_peft_model(base_model, config)\n```" },
      { id: "rl-file-web-vitals", name: "web-vitals-benchmark.md", type: "file", parentId: "rl-folder-frontend-perf", content: "# Web Vitals Benchmark — React Rendering Strategies\n\n## Setup\n- Framework: Next.js 15\n- Page: Dashboard (50 components, 5 data sources)\n- Network: Simulated 3G (400ms RTT, 400kbps)\n\n## Results\n| Strategy     | FCP   | LCP   | TTI   | CLS  | JS Size |\n|-------------|-------|-------|-------|------|---------|\n| CSR         | 1.2s  | 3.8s  | 4.2s  | 0.05 | 285KB   |\n| SSR         | 0.8s  | 2.1s  | 3.5s  | 0.02 | 310KB   |\n| SSG         | 0.3s  | 0.8s  | 1.2s  | 0.01 | 285KB   |\n| ISR (60s)   | 0.3s  | 0.9s  | 1.3s  | 0.01 | 285KB   |\n| Streaming   | 0.4s  | 1.0s  | 1.5s  | 0.01 | 320KB   |\n| RSC         | 0.3s  | 0.7s  | 1.0s  | 0.01 | 195KB   |\n\n## Key Takeaways\n1. RSC wins on all metrics\n2. SSG is best for static content\n3. Streaming SSR improves FCP significantly\n4. CSR is always worst for initial load\n5. CLS is negligible across all strategies" },
      { id: "rl-file-paper-flash", name: "flash-attention-paper.md", type: "file", parentId: "rl-folder-papers", content: "# Paper Summary: FlashAttention\n\n**Paper**: \"FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness\"\n**Authors**: Tri Dao et al. (2022)\n\n## Problem\nStandard attention has O(n²) memory complexity. For long sequences, this is prohibitive.\n\n## Key Insight\nThe bottleneck is not computation (FLOPS) but **memory IO**. By being IO-aware, we can compute exact attention much faster.\n\n## Solution\n1. **Tiling**: Split Q, K, V into blocks that fit in SRAM\n2. **Kernel fusion**: One GPU kernel instead of multiple\n3. **Recomputation**: Don't store attention matrix, recompute in backward pass\n\n## Results\n- 2-4x speedup over PyTorch implementation\n- Memory: O(n) instead of O(n²)\n- No approximation — exact attention\n\n## Implications\n- Enables training with longer sequences\n- Reduces GPU memory requirements\n- Foundation for FlashAttention-2 and beyond\n\n## My Notes\nThis is a must-read for anyone working with transformers. The IO-aware approach is elegant and practical." },
    ],
  },
];

// ── Seed Data Functions ─────────────────────────────────────────

/**
 * Creates the seed registry with 5 workspaces.
 */
export function getSeedRegistry(): WorkspaceRegistry {
  const now = Date.now();
  const workspaces: WorkspaceMeta[] = SEED_WORKSPACES.map((ws, index) => ({
    id: `seed-ws-${index + 1}`,
    name: ws.meta.name,
    emoji: ws.meta.emoji,
    color: ws.meta.color,
    createdAt: now - (SEED_WORKSPACES.length - index) * 86400000, // Stagger dates
    updatedAt: now - (SEED_WORKSPACES.length - index) * 43200000,
    itemCount: ws.items.length,
  }));

  return {
    workspaces,
    activeWorkspaceId: workspaces[0].id,
  };
}

/** localStorage key to track if dummy seed data has been loaded once */
export const SEED_INITIALIZED_KEY = "wspace_seeded_dummy_v1";

/**
 * Returns seed data for a specific workspace by its ID.
 */
export function getSeedWorkspaceData(workspaceId: string): WorkspaceState {
  const now = 1730000000000; // Deterministic baseline timestamp to prevent SSR hydration mismatch
  const index = parseInt(workspaceId.replace("seed-ws-", ""), 10) - 1;

  if (index < 0 || index >= SEED_WORKSPACES.length) {
    return {};
  }

  const items: WorkspaceState = {};
  for (let i = 0; i < SEED_WORKSPACES[index].items.length; i++) {
    const item = SEED_WORKSPACES[index].items[i];
    items[item.id] = {
      ...item,
      createdAt: now - ((i + 1) * 3600000),
      updatedAt: now - (i * 1800000),
    };
  }
  return items;
}

/**
 * Returns seed data for the default workspace.
 */
export function getSeedData(): WorkspaceState {
  return getSeedWorkspaceData("seed-ws-1");
}
