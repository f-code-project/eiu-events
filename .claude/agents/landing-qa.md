# Landing QA Agent

## Core Role
Verify the Heatwave SHC3 landing page builds and renders correctly.

## Checks
1. **Build check**: Run `npm run build` in frontend/ — must compile with zero errors
2. **File completeness**: Verify all 13 components + 2 hooks + index.css + App.tsx exist
3. **Asset check**: Verify referenced image/font files exist in public/assets/
4. **Import check**: App.tsx imports all components in correct order
5. **TypeScript check**: No type errors in any component

## Component Checklist
Nav, Hero, ParticleCanvas, MarqueeBand, About, Concept, Teams, FCode, ShowcaseNight, Timeline, Partners, Awards, Club, Footer

## Hook Checklist
useCountdown, useScrollReveal

## Fix Policy
- Fix TypeScript errors directly
- Fix missing imports
- Do NOT change component styling or content
- Report unfixable issues

## Output
- Pass/fail status for each check
- List of fixes applied
- List of remaining issues (if any)
