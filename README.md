<div align="center">

# 🚀 wSpace — Workspace Explorer

**A premium, browser-based file manager with multi-workspace support.**  
Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-wSpace.vercel.app-00C7B7?style=flat-square&logo=vercel)](https://wSpace.vercel.app)

### 🌐 [Live Demo → https://wSpace.vercel.app](https://wSpace.vercel.app)

</div>

---

## ✨ Features

- 📁 **Multi-Workspace Support** — Create, switch, rename, and delete multiple independent workspaces
- 🌲 **Recursive Tree View** — Nested folder/file tree with expand/collapse animations
- ✏️ **Full CRUD** — Create, rename, and delete folders and files inline
- 📝 **File Editor** — Built-in text editor with dirty-state tracking and `Ctrl+S` to save
- 🔍 **Global Search** — Workspace-wide search via `Ctrl+K` (command palette)
- 💾 **Persistent Storage** — All data auto-saved to `localStorage` — zero backend required
- 📱 **Responsive Layout** — Collapsible sidebar that works on both mobile and desktop
- 🎨 **Premium Design** — Clean white theme, colorful icons, smooth micro-animations

---

## 🚀 How to Run

### Prerequisites

- **Node.js** `v18.18+` — [Download](https://nodejs.org)
- **npm** `v9+` (bundled with Node.js) or **[Bun](https://bun.sh)** `v1+`

```bash
node --version   # v18.18 or higher
npm --version    # v9 or higher
```

### 1 — Install dependencies

```bash
cd wSpace
npm install
# or
bun install
```

### 2 — Start the dev server

```bash
npm run dev
# or
bun dev
```

### 3 — Open in browser

```
http://localhost:3000
```

The app hot-reloads automatically as you edit source files.

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port `3000` |
| `npm run build` | Build production bundle |
| `npm run start` | Serve production build (after `build`) |
| `npm run lint` | Run ESLint |

---

## 🗂 Project Structure

```
wSpace/
├── public/
│   └── images/wSpace.png           # App logo
└── src/
    ├── app/
    │   ├── layout.tsx              # Root layout (fonts, metadata)
    │   ├── page.tsx                # Entry page → mounts WorkspaceExplorer
    │   └── globals.css             # Tailwind v4 + custom CSS tokens
    ├── _components/
    │   ├── module/                 # Feature-level components
    │   │   ├── WorkspaceExplorer.tsx   # Root shell (sidebar + main panel)
    │   │   ├── Sidebar.tsx             # Left nav: tree view + toolbar
    │   │   ├── MainPanel.tsx           # Right content: cards / editor
    │   │   ├── FileEditor.tsx          # Full-screen text editor
    │   │   ├── TreeNode.tsx            # Recursive tree item
    │   │   ├── ItemCard.tsx            # Grid card for folders/files
    │   │   ├── SearchOverlay.tsx       # Ctrl+K command palette
    │   │   ├── WorkspaceSwitcher.tsx   # Workspace list + create form
    │   │   └── Breadcrumb.tsx          # Path navigation bar
    │   └── ui/                     # Reusable primitives (Button, Modal, Icons…)
    ├── context/
    │   ├── WorkspaceContext.tsx         # Per-workspace CRUD context
    │   ├── WorkspaceManagerContext.tsx  # Multi-workspace registry context
    │   └── ToastContext.tsx             # Global toast notifications
    ├── hooks/
    │   ├── useWorkspace.ts         # Core state: useReducer + localStorage sync
    │   ├── useWorkspaceManager.ts  # Registry CRUD (add/rename/delete workspaces)
    │   ├── useSearch.ts            # Search logic with debounce
    │   ├── useKeyboard.ts          # Global keyboard shortcuts
    │   └── useToast.ts             # Toast queue management
    ├── lib/
    │   ├── constants.ts            # Storage keys, seed data, timing constants
    │   ├── workspace-utils.ts      # Pure helpers (tree building, path resolving)
    │   ├── workspace-manager-utils.ts  # localStorage registry read/write + seeding
    │   └── icon-resolver.ts        # Maps file extensions → icon components
    └── types/
        └── workspace.ts            # All TypeScript types and interfaces
```

---

## 🧠 State Management

wSpace uses a **three-layer state architecture** — no external state library required.

```
┌─────────────────────────────────────────────────────┐
│  WorkspaceManagerContext  (top-level)               │
│  → Registry: list of workspaces + active ID         │
│  → useWorkspaceManager: add / rename / delete       │
├─────────────────────────────────────────────────────┤
│  WorkspaceContext  (per active workspace)            │
│  → useWorkspace: useReducer for items CRUD          │
│  → Syncs to localStorage on every dispatch          │
├─────────────────────────────────────────────────────┤
│  ToastContext  (global)                              │
│  → Lightweight notification queue                   │
└─────────────────────────────────────────────────────┘
```

### How `useWorkspace` works

```
User Action
    │
    ▼
dispatch(action)           ← e.g. CREATE / RENAME / DELETE / UPDATE_CONTENT
    │
    ▼
workspaceReducer(state, action)   ← pure function, returns new state
    │
    ▼
useEffect (watches state)
    │
    ▼
localStorage.setItem(`wspace-data-${workspaceId}`, JSON.stringify(state))
```

- Uses **`useReducer`** so all mutations are explicit, traceable actions.
- State is initialized synchronously from `localStorage` via the reducer's **init function** — avoiding `useEffect` race conditions and SSR hydration mismatches.
- Writes are synchronous on each dispatch (no debounce) to guarantee persistence before navigation.

---

## 📦 File-System Data Structure

All items (folders and files) are stored in a **flat map** keyed by ID.  
The tree hierarchy is expressed through `parentId` references — similar to how a real filesystem inode table works.

```ts
// Flat map — O(1) lookups, O(n) tree builds
type WorkspaceState = Record<string, WorkspaceItem>

interface WorkspaceItem {
  id: string
  name: string
  type: "folder" | "file"
  parentId: string | null   // null = root-level item
  content?: string          // only present on files
  createdAt: number         // Unix ms timestamp
  updatedAt: number
}
```

**Example — a folder containing a file:**

```json
{
  "folder-1": {
    "id": "folder-1",
    "name": "Components",
    "type": "folder",
    "parentId": null
  },
  "file-1": {
    "id": "file-1",
    "name": "Button.tsx",
    "type": "file",
    "parentId": "folder-1",
    "content": "export function Button() { ... }"
  }
}
```

**Tree rendering** calls `buildTree(state)` — a utility that converts the flat map into a `TreeNodeData[]` array of recursive nodes, sorted folders-first then alphabetically.

### localStorage Layout

```
wspace-registry          → WorkspaceRegistry  (list of workspaces + active ID)
wspace-data-{id}         → WorkspaceState     (flat item map per workspace)
wspace_seeded_dummy_v1   → "true"             (one-time seed guard flag)
```

---

## 🔧 Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Flat map over nested tree** | O(1) item access by ID; tree is derived at render time. Avoids deep recursive mutations. |
| **`useReducer` over `useState`** | Explicit action types make all mutations auditable and easy to debug. |
| **Init-function pattern** | Passing the localStorage loader as the `useReducer` init argument initializes state synchronously on mount, preventing hydration mismatches with Next.js SSR. |
| **No backend / database** | Entire app runs in the browser via `localStorage`. Zero setup, zero cost, works offline. |
| **One-time seed guard** | `wspace_seeded_dummy_v1` key prevents re-seeding demo data on page refresh, so user edits are never overwritten. |
| **Deterministic seed timestamps** | Seed items use a fixed baseline timestamp (`1730000000000`) instead of `Date.now()` to prevent server/client HTML mismatches during SSR. |
| **Collapsible sidebar (all viewports)** | Instead of a mobile drawer overlay, the sidebar collapses to icon-width on mobile automatically. Users can toggle it wider; the main panel scrolls horizontally to prevent layout breakage. |
| **`suppressHydrationWarning`** | Applied to color-coded UI elements (workspace initials, emoji) that are computed client-side from localStorage data, silencing expected SSR→CSR differences. |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl / ⌘ + K` | Open global search |
| `Ctrl / ⌘ + N` | Create new folder |
| `Ctrl / ⌘ + S` | Save file (in editor) |
| `Escape` | Close modal / search / cancel rename |
| `Enter` | Confirm rename |
| `Double-click` | Rename an item inline |

---

## 📄 License

MIT © wSpace Contributors
