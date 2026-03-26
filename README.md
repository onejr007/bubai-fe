# Frontend - AI Agent Framework

## Tech Stack
- React 18
- TypeScript 5
- Vite 5 (Hot Reload)
- Custom SPA Router

## Quick Start

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```

Server: `http://localhost:3000`

### Build
```bash
npm run build
```

### Preview Production
```bash
npm run preview
```

## Project Structure

```
src/
├── core/           # Framework core (Router)
├── components/     # Shared components
│   └── layouts/    # Layout components
├── modules/        # AI Agent modules
│   └── claude-example/  # Example module
├── pages/          # Global pages
├── utils/          # Shared utilities
├── styles/         # Global styles
├── routes.ts       # Route registry
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Path Aliases

```typescript
@/              → src/
@components/    → src/components/
@pages/         → src/pages/
@modules/       → src/modules/
@core/          → src/core/
@utils/         → src/utils/
```

## Creating a Module

See: `../AI_DOCS/MODULE_TEMPLATE.md`

Quick steps:
1. Create folder in `src/modules/[agent-name]-[feature]/`
2. Create `module.json`, `routes.ts`, pages
3. Register routes in `src/routes.ts`
4. Document in `../AI_DOCS/AGENTS/[agent-name]/`

## Example Module

Check `src/modules/claude-example/` for a complete example.

## Hot Reload

Vite automatically reloads on file changes. No manual refresh needed.

## TypeScript

Strict mode enabled. All files must be properly typed.

## Routing

Custom SPA router with:
- No page reload on navigation
- Dynamic routes with params
- Layout support
- 404 handling

See: `../AI_DOCS/ROUTING_GUIDE.md`

## Documentation

Full documentation in `../AI_DOCS/`

Start with: `../AI_DOCS/INDEX.md`
