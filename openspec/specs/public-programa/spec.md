# public-programa Specification

## Purpose
TBD - created by archiving change public-programa-slug. Update Purpose after archive.
## Requirements
### Requirement: Congregation slug field
The system SHALL store a `slug` field (TEXT, UNIQUE, NOT NULL) in the `congregaciones` table. The slug SHALL be auto-generated from the congregation name using kebab-case normalization (lowercase, no accents, spaces to hyphens). The slug MUST be unique across all congregations.

#### Scenario: Slug generated on congregation creation
- **WHEN** an admin creates a congregation with name "Congregación Norte Quilmes"
- **THEN** the system generates slug `congregacion-norte-quilmes` and stores it in the `slug` field

#### Scenario: Slug collision handling
- **WHEN** an admin creates a congregation and the generated slug already exists
- **THEN** the system appends a numeric suffix (`-2`, `-3`, etc.) until a unique slug is found

#### Scenario: Existing congregations receive slug via migration
- **WHEN** the migration runs on a database with existing congregations
- **THEN** each congregation receives a slug generated from its `nombre` field

### Requirement: Public routes for programa
The system SHALL expose public routes under `/c/:slug/` that display the programa in read-only mode without requiring authentication.

#### Scenario: Visitor accesses entre-semana programa
- **WHEN** a visitor navigates to `/c/norte-quilmes/entre-semana`
- **THEN** the system resolves slug `norte-quilmes` to a congregation ID and displays the weekly programa in read-only mode (no edit buttons, no modal)

#### Scenario: Visitor accesses fin-de-semana programa
- **WHEN** a visitor navigates to `/c/norte-quilmes/fin-de-semana`
- **THEN** the system resolves the slug and displays the weekend programa in read-only mode

#### Scenario: Visitor accesses base congregation URL
- **WHEN** a visitor navigates to `/c/norte-quilmes`
- **THEN** the system redirects to `/c/norte-quilmes/entre-semana`

#### Scenario: Invalid slug
- **WHEN** a visitor navigates to `/c/nonexistent-slug/entre-semana`
- **THEN** the system displays a "Congregación no encontrada" message

### Requirement: Slug resolution hook
The system SHALL provide a `usePublicCongregacion(slug)` hook that resolves a slug to congregation data (id, nombre) via Supabase query. The hook SHALL cache the result (slug→id mapping is stable).

#### Scenario: Successful slug resolution
- **WHEN** the hook is called with a valid slug
- **THEN** it returns `{ congregacionId, nombre, isLoading: false, isError: false }`

#### Scenario: Invalid slug resolution
- **WHEN** the hook is called with a slug that doesn't exist
- **THEN** it returns `{ congregacionId: null, nombre: null, isLoading: false, isError: false }`

### Requirement: Anon RLS policies for programa data
The system SHALL create RLS policies allowing anonymous (unauthenticated) users to SELECT from `congregaciones`, `publicadores`, `asignaciones_semana`, and `asignaciones_fds`.

#### Scenario: Anonymous user reads congregacion by slug
- **WHEN** an anonymous Supabase client queries `congregaciones` filtered by slug
- **THEN** the query returns the matching row (id, nombre, slug only)

#### Scenario: Anonymous user reads publicadores for a congregation
- **WHEN** an anonymous Supabase client queries `publicadores` filtered by `congregacion_id`
- **THEN** the query returns active publicadores with only `id`, `nombre`, `apellido` fields populated
- **AND** inactive publicadores, emails, and phone numbers SHALL NOT be returned

#### Scenario: Anonymous user reads asignaciones_semana
- **WHEN** an anonymous Supabase client queries `asignaciones_semana` filtered by `congregacion_id` and `semana`
- **THEN** the query returns matching rows

#### Scenario: Anonymous user reads asignaciones_fds
- **WHEN** an anonymous Supabase client queries `asignaciones_fds` filtered by `congregacion_id` and `fecha`
- **THEN** the query returns matching rows

#### Scenario: Anonymous user cannot write data
- **WHEN** an anonymous Supabase client attempts INSERT, UPDATE, or DELETE on any table
- **THEN** the operation is denied by RLS

### Requirement: Public programa layout
The public programa pages SHALL use a minimal layout (header with congregation name, no sidebar) distinct from the authenticated `AppLayout`.

#### Scenario: Public layout displays congregation name
- **WHEN** a visitor views a public programa page
- **THEN** the header displays the congregation name and navigation between entre-semana and fin-de-semana

#### Scenario: Public layout shows login option
- **WHEN** a visitor views a public programa page
- **THEN** the header includes a link to `/login` for users who want to authenticate

### Requirement: Admin can copy public link
The admin panel SHALL display the public link for the congregation and provide a "Copy" button.

#### Scenario: Admin sees public link
- **WHEN** an admin views the AdminPanel
- **THEN** the panel displays the public URL (e.g., `https://domain.com/c/norte-quilmes/entre-semana`)

#### Scenario: Admin copies public link
- **WHEN** an admin clicks "Copiar link público"
- **THEN** the public URL is copied to the clipboard and a success toast is shown

