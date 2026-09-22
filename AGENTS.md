# wSpace

Next.js 16 App Router project (React 19, Tailwind CSS 4, TypeScript 5).

## Commands

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals` + `typescript`)
- `npx tsc --noEmit` — typecheck only (no separate `typecheck` script defined)

No test framework is configured. No CI workflows exist yet.

## Key conventions

- Tailwind CSS 4: uses `@tailwindcss/postcss` plugin, NOT the v3 `tailwindcss` PostCSS plugin.
- CSS entry point: `src/app/globals.css` — uses `@import "tailwindcss"` and `@theme inline` (Tailwind v4 syntax).
- ESLint 9 flat config in `eslint.config.mjs` — do not create `.eslintrc` files.
- Path alias: `@/*` maps to project root (configured in `tsconfig.json`).
- Layout uses `LayoutProps<"/">` typing (Next.js 16 generated type).
- Both `bun.lock` and `package-lock.json` exist; prefer whichever the team uses.

## Project structure

```
src/app/
  layout.tsx   — root layout (Geist fonts, dark mode CSS vars)
  page.tsx     — home page (default create-next-app scaffold)
  globals.css  — Tailwind v4 imports + theme tokens
public/        — static assets
```

This is a fresh scaffold. All source lives under `src/app/` (App Router).
