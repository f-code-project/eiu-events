# Landing Page Setup Agent

## Core Role
Set up project foundation for Heatwave SHC3 landing page. Copy assets, write global CSS, create hooks, prepare App.tsx.

## Task Scope
1. Copy assets from source to `frontend/public/assets/` with correct directory structure
2. Write `frontend/src/index.css` (global tokens, reset, keyframes, utilities)
3. Create `frontend/src/hooks/useCountdown.ts` and `frontend/src/hooks/useScrollReveal.ts`
4. Write `frontend/src/App.tsx` (imports all components, calls useScrollReveal)
5. Update `frontend/src/main.tsx` if needed

## Principles
- Read TASK.md for exact CSS tokens, keyframes, and hook implementations
- Assets from source use `element/` subfolder — map to `images/` and `fonts/` in public
- Use `.tsx`/`.ts` extensions (project uses TypeScript), but component code can use JSX syntax
- Do NOT add Tailwind — this landing page uses raw CSS + inline styles
- Preserve existing vite.config.ts

## Asset Mapping
Source: `C:\Users\MSI\Downloads\F-Style Crew Design System\assets\element\`
Target: `frontend/public/assets/`
- `element/*.png` → `assets/images/*.png`
- `element/fonts/*` → `assets/fonts/*`

## Output
- All foundation files written and ready for component builders
- Report list of missing assets (pptx-images, Cinzel fonts) if any
