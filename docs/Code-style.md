# Aariva Voyages — Code Style

## 1. General
- Language: JavaScript/TypeScript (TypeScript preferred for new code).
- Formatting: Prettier; linting: ESLint. Both run in CI and as pre-commit hooks.
- 2-space indent, single quotes, semicolons, max line length 100.
- Prefer small, single-purpose functions and files.

## 2. Naming
| Item | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `PackageCard.tsx` |
| Files (utils/routes) | kebab-case | `callback-service.ts` |
| Variables/functions | camelCase | `getPackageBySlug` |
| Constants | UPPER_SNAKE_CASE | `MAX_GROUP_SIZE` |
| DB tables/columns | snake_case | `callback_requests`, `travel_dates` |
| API routes | plural nouns, kebab-case | `/api/callbacks` |

## 3. Project Structure
```
frontend/
  app/            # Next.js routes
  components/     # UI components
  lib/            # API client, helpers
  styles/
backend/
  src/
    routes/  controllers/  services/  middleware/  validators/
  tests/
```

## 4. React / Next.js
- Function components and hooks only.
- Server components/ISR for package pages; client components only when interactivity is needed.
- No inline business logic in JSX; move it to hooks or `lib/`.
- Use `next/image` with lazy loading and WebP.
- Semantic HTML, labelled inputs, alt text on all images.

## 5. Backend (Node/Express)
- Layering: route -> controller -> service -> database. Controllers stay thin.
- Validate input in middleware; centralized error handler returning consistent JSON.
- `async/await` with try/catch; never swallow errors.
- No `console.log` in production code; use a logger.

## 6. CSS
- Mobile-first; breakpoints at 640px and 1024px.
- Use design tokens (see Design-system.md); no hard-coded colors or spacing.
- Flat cards with 1px borders; no drop shadows.

## 7. Git
- Branches: `feature/…`, `fix/…`, `chore/…`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
- Pull requests need at least one review and passing CI.

## 8. Testing
- Unit tests for services and validators; integration tests for API routes; Playwright E2E for the callback flow.
- New features and bug fixes come with tests.

## 9. Comments & Docs
- Comment the why, not the what.
- Public functions get short JSDoc; update docs when behavior changes.
