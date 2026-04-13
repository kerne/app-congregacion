## 1. Database — Slug + Anon Policies

- [x] 1.1 Create migration `009_public_slug.sql`: ADD COLUMN `slug TEXT UNIQUE` to `congregaciones`, generate slugs for existing rows, set NOT NULL
- [x] 1.2 Add anon RLS policy on `congregaciones` for SELECT by slug (columns: id, nombre, slug)
- [x] 1.3 Add anon RLS policy on `publicadores` for SELECT (columns: id, nombre, apellido; filter: activo=true, by congregacion_id)
- [x] 1.4 Add anon RLS policy on `asignaciones_semana` for SELECT (filter: by congregacion_id)
- [x] 1.5 Add anon RLS policy on `asignaciones_fds` for SELECT (filter: by congregacion_id)
- [x] 1.6 Update `reset.sql` with slug column and anon policies

## 2. Frontend — Slug Utilities + Hook

- [x] 2.1 Create `slugify()` utility function in `src/shared/utils/slugify.ts`
- [x] 2.2 Create `usePublicCongregacion(slug)` hook in `src/features/congregacion/usePublicCongregacion.ts` — resolves slug → { congregacionId, nombre }
- [x] 2.3 Reuse existing API functions (getAsignacionesSemana/FDS) — they already accept congregacionId and work with anon key

## 3. Frontend — Public Layout + Routes

- [x] 3.1 Create `PublicLayout` component in `src/app/layout/PublicLayout.tsx` — minimal header with congregation name, nav tabs (entre-semana / fin-de-semana), login link
- [x] 3.2 Create `PublicEntreSemana` page in `src/features/programa/semana/pages/PublicEntreSemana.tsx` — read-only, uses slug from URL params
- [x] 3.3 Create `PublicFinDeSemana` page in `src/features/programa/fds/pages/PublicFinDeSemana.tsx` — read-only, uses slug from URL params
- [x] 3.4 Add routes to `router.tsx`: `/c/:slug` (redirect), `/c/:slug/entre-semana`, `/c/:slug/fin-de-semana`

## 4. Frontend — Onboarding + Admin Integration

- [x] 4.1 Update `CrearCongregacion.tsx` to generate and store slug from nombre using `slugify()`
- [x] 4.2 Add `slug` to `Congregacion` type in `src/core/supabase/types.ts`
- [x] 4.3 Add "Copiar link público" card/section in `AdminPanel.tsx` with copy-to-clipboard button

## 5. Seed + Verification

- [x] 5.1 Update `seed.sql` to include slug for seed congregation
- [ ] 5.2 Verify public routes work without authentication (manual test)
