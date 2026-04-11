# Design — platform-v1

**Change**: platform-v1
**Fecha**: 2026-04-11

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel (SPA)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React App (Vite + TypeScript)                      │    │
│  │  ├── React Router v6  (client-side routing)         │    │
│  │  ├── TanStack Query   (server state + cache)        │    │
│  │  ├── shadcn/ui        (componentes)                 │    │
│  │  └── Supabase Client  (auth + data)                 │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                ┌──────────▼──────────┐
                │   Supabase          │
                │  ├── Auth (Google)  │
                │  ├── PostgreSQL     │
                │  │   └── RLS        │
                │  └── Storage (*)    │
                └─────────────────────┘
                (* no usado en v1)
```

---

## Schema de Base de Datos

### Tabla: `publicadores`

```sql
CREATE TABLE publicadores (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    TEXT NOT NULL,
  apellido  TEXT NOT NULL,
  email     TEXT UNIQUE NOT NULL,
  telefono  TEXT,
  rol       TEXT NOT NULL DEFAULT 'publicador'
              CHECK (rol IN ('publicador', 'editor', 'admin')),
  activo    BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Tabla: `asignaciones_semana`

```sql
CREATE TABLE asignaciones_semana (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semana       DATE NOT NULL,         -- lunes de la semana (ISO)
  parte_id     TEXT NOT NULL,         -- referencia a constante en código
  asignado_id  UUID NOT NULL REFERENCES publicadores(id),
  asistente_id UUID REFERENCES publicadores(id),
  tema         TEXT,
  sala         TEXT CHECK (sala IN ('principal', 'B')),
  notas        TEXT,
  modificado   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (semana, parte_id, sala)    -- evita duplicados por parte+semana+sala
);
```

### Tabla: `asignaciones_fds`

```sql
CREATE TABLE asignaciones_fds (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha        DATE NOT NULL,          -- domingo (ISO)
  parte_id     TEXT NOT NULL,          -- referencia a constante en código
  asignado_id  UUID NOT NULL REFERENCES publicadores(id),
  asistente_id UUID REFERENCES publicadores(id),
  tema         TEXT,
  notas        TEXT,
  modificado   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (fecha, parte_id)
);
```

### Índices

```sql
CREATE INDEX idx_asig_semana_semana ON asignaciones_semana(semana);
CREATE INDEX idx_asig_semana_asignado ON asignaciones_semana(asignado_id);
CREATE INDEX idx_asig_fds_fecha ON asignaciones_fds(fecha);
CREATE INDEX idx_asig_fds_asignado ON asignaciones_fds(asignado_id);
CREATE INDEX idx_publicadores_email ON publicadores(email);
```

---

## RLS Policies

### Política helper: función de rol

```sql
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS TEXT AS $$
  SELECT rol FROM publicadores
  WHERE email = auth.jwt() ->> 'email'
    AND activo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### `publicadores` — RLS

```sql
ALTER TABLE publicadores ENABLE ROW LEVEL SECURITY;

-- Anónimo y autenticado: solo pueden ver nombre+apellido+rol (sin contacto)
-- Se resuelve con columnas en la query, no con RLS de columna
-- RLS de fila: todos pueden leer publicadores activos
CREATE POLICY "publicadores_select_activos" ON publicadores
  FOR SELECT USING (activo = true);

-- Admin ve todos (activos e inactivos)
CREATE POLICY "publicadores_select_admin" ON publicadores
  FOR SELECT USING (get_user_rol() = 'admin');

-- Solo admin puede insertar/actualizar/eliminar
CREATE POLICY "publicadores_insert_admin" ON publicadores
  FOR INSERT WITH CHECK (get_user_rol() = 'admin');

CREATE POLICY "publicadores_update_admin" ON publicadores
  FOR UPDATE USING (get_user_rol() = 'admin');
```

### `asignaciones_semana` — RLS

```sql
ALTER TABLE asignaciones_semana ENABLE ROW LEVEL SECURITY;

-- Lectura: todos (anónimo y autenticado)
CREATE POLICY "asig_semana_select_all" ON asignaciones_semana
  FOR SELECT USING (true);

-- Escritura: solo editor y admin
CREATE POLICY "asig_semana_insert_editor" ON asignaciones_semana
  FOR INSERT WITH CHECK (get_user_rol() IN ('editor', 'admin'));

CREATE POLICY "asig_semana_update_editor" ON asignaciones_semana
  FOR UPDATE USING (get_user_rol() IN ('editor', 'admin'));

CREATE POLICY "asig_semana_delete_editor" ON asignaciones_semana
  FOR DELETE USING (get_user_rol() IN ('editor', 'admin'));
```

### `asignaciones_fds` — RLS

```sql
ALTER TABLE asignaciones_fds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asig_fds_select_all" ON asignaciones_fds
  FOR SELECT USING (true);

CREATE POLICY "asig_fds_insert_editor" ON asignaciones_fds
  FOR INSERT WITH CHECK (get_user_rol() IN ('editor', 'admin'));

CREATE POLICY "asig_fds_update_editor" ON asignaciones_fds
  FOR UPDATE USING (get_user_rol() IN ('editor', 'admin'));

CREATE POLICY "asig_fds_delete_editor" ON asignaciones_fds
  FOR DELETE USING (get_user_rol() IN ('editor', 'admin'));
```

---

## Constantes del Programa (en código — no tabla)

```typescript
// src/core/config/programa-semana.ts

export type SeccionSemana = 'apertura' | 'tesoros' | 'smt' | 'nvc' | 'cierre'

export interface ParteSemana {
  id: string
  nombre: string
  seccion: SeccionSemana
  tieneAsistente: boolean
  tieneTema: boolean
  tieneSala: boolean
  opcional: boolean
  duracionMin: number
}

export const PROGRAMA_SEMANA: ParteSemana[] = [
  { id: 'presidente',         nombre: 'Presidente',                   seccion: 'apertura',  tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0  },
  { id: 'lector_tesoros',     nombre: 'Lector (Tesoros)',             seccion: 'apertura',  tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0  },
  { id: 'discurso_tesoros',   nombre: 'Discurso',                     seccion: 'tesoros',   tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 10 },
  { id: 'mejores_maestros',   nombre: 'Seamos Mejores Maestros',      seccion: 'tesoros',   tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 8  },
  { id: 'busqueda_tesoros',   nombre: 'Búsqueda de Tesoros Bíblicos', seccion: 'tesoros',   tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 10 },
  { id: 'smt_parte1',         nombre: 'Parte de Estudiantes 1',       seccion: 'smt',       tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: false, duracionMin: 4  },
  { id: 'smt_parte2',         nombre: 'Parte de Estudiantes 2',       seccion: 'smt',       tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: false, duracionMin: 4  },
  { id: 'smt_parte3',         nombre: 'Parte de Estudiantes 3',       seccion: 'smt',       tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: true,  duracionMin: 4  },
  { id: 'smt_parte4',         nombre: 'Parte de Estudiantes 4',       seccion: 'smt',       tieneAsistente: true,  tieneTema: true,  tieneSala: true,  opcional: true,  duracionMin: 4  },
  { id: 'nvc_parte1',         nombre: 'Parte Vida Cristiana 1',       seccion: 'nvc',       tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 10 },
  { id: 'nvc_parte2',         nombre: 'Parte Vida Cristiana 2',       seccion: 'nvc',       tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: true,  duracionMin: 10 },
  { id: 'estudio_congregacion', nombre: 'Estudio Bíblico Congregación', seccion: 'nvc',   tieneAsistente: false, tieneTema: true,  tieneSala: false, opcional: false, duracionMin: 30 },
  { id: 'cierre',             nombre: 'Cierre (Presidente)',          seccion: 'cierre',    tieneAsistente: false, tieneTema: false, tieneSala: false, opcional: false, duracionMin: 0  },
]

// src/core/config/programa-fds.ts

export type SeccionFDS = 'apertura' | 'discurso' | 'atalaya' | 'cierre'

export interface ParteFDS {
  id: string
  nombre: string
  seccion: SeccionFDS
  tieneTema: boolean
  tieneAsistente: boolean
}

export const PROGRAMA_FDS: ParteFDS[] = [
  { id: 'fds_presidente',        nombre: 'Presidente',              seccion: 'apertura', tieneTema: false, tieneAsistente: false },
  { id: 'fds_orador',            nombre: 'Orador Discurso Público', seccion: 'discurso', tieneTema: true,  tieneAsistente: false },
  { id: 'fds_presidente_atalaya',nombre: 'Presidente Atalaya',      seccion: 'atalaya',  tieneTema: false, tieneAsistente: false },
  { id: 'fds_lector_atalaya',    nombre: 'Lector Atalaya',          seccion: 'atalaya',  tieneTema: false, tieneAsistente: false },
  { id: 'fds_oracion_final',     nombre: 'Oración Final',           seccion: 'cierre',   tieneTema: false, tieneAsistente: false },
]
```

---

## Estructura de Rutas

```typescript
// src/app/router.tsx

const routes = [
  {
    path: '/',
    element: <AppLayout />,          // Sidebar + header
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'entre-semana', element: <EntreSemana /> },
      { path: 'fin-de-semana', element: <FinDeSemana /> },
      {
        path: 'mis-asignaciones',
        element: <RequireAuth><MisAsignaciones /></RequireAuth>
      },
      {
        path: 'admin',
        element: <RequireRole roles={['admin']}><AdminLayout /></RequireRole>,
        children: [
          { path: 'publicadores', element: <Publicadores /> },
        ]
      },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '*', element: <NotFound /> },
]
```

---

## Gestión de Estado

### TanStack Query — Query Keys

```typescript
export const queryKeys = {
  publicadores: {
    all: ['publicadores'] as const,
    list: (soloActivos: boolean) => ['publicadores', { soloActivos }] as const,
  },
  asignacionesSemana: {
    semana: (semana: string) => ['asignaciones-semana', semana] as const,
    misAsignaciones: (userId: string) => ['mis-asignaciones', userId] as const,
  },
  asignacionesFds: {
    fecha: (fecha: string) => ['asignaciones-fds', fecha] as const,
  },
  stats: ['dashboard-stats'] as const,
}
```

### Cache TTL

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // 60 segundos (RNF-01.3)
      gcTime: 5 * 60 * 1000,     // 5 minutos en memoria
    }
  }
})
```

---

## Flujo de Autenticación

```
1. Usuario click "Iniciar sesión con Google"
2. supabase.auth.signInWithOAuth({ provider: 'google' })
3. Supabase redirige a Google OAuth
4. Google redirige a /auth/callback con code
5. AuthCallback component llama supabase.auth.exchangeCodeForSession()
6. useCurrentUser hook consulta: SELECT rol FROM publicadores WHERE email = $email
7. Contexto de auth se actualiza con { user, rol, publicador }
8. Redirect a dashboard
```

---

## Componentes Clave

### `<RequireAuth>`
Redirige a `/login` si no hay sesión activa. Guarda `returnTo` en sessionStorage.

### `<RequireRole roles=[...]>`
Redirige a `/` si el rol del usuario no está en el array permitido.

### `<ModalAsignacion>`
Modal reutilizable para asignar una parte (semana o FDS). Recibe `parte`, `semanaOFecha`, `asignacionActual`. Maneja los campos dinámicos según flags de la parte (asistente, tema, sala).

### `<ProgramaSemanaView>`
Renderiza las partes agrupadas por sección. Pasa callbacks de edición solo si el rol es editor/admin.

### `useCurrentUser()`
Hook que expone `{ user, rol, publicador, loading }`. Suscrito al estado de Supabase auth.

### `useProgramaSemana(semana: string)`
TanStack Query hook que fetcha asignaciones + join con publicadores para la semana dada.

---

## Aislamiento de Datos de Contacto

Los campos `email` y `telefono` de publicadores se excluyen en todas las queries de lectura pública:

```typescript
// Para queries de lectura pública / anónima:
const { data } = await supabase
  .from('publicadores')
  .select('id, nombre, apellido, rol')   // sin email, sin telefono
  .eq('activo', true)

// Para admin (puede ver todo):
const { data } = await supabase
  .from('publicadores')
  .select('*')
```

> NOTA: Esto complementa RLS pero no lo reemplaza. RLS garantiza que aunque alguien llame directo a la API, los datos de contacto están protegidos. Se implementará una vista SQL restringida para el caso anónimo.

---

## Bootstrap — Primer Admin

```sql
-- Función para ejecutar desde el editor de Supabase (una sola vez)
CREATE OR REPLACE FUNCTION crear_primer_admin(
  p_nombre TEXT,
  p_apellido TEXT,
  p_email TEXT
) RETURNS void AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM publicadores WHERE rol = 'admin') THEN
    RAISE EXCEPTION 'Ya existe un admin en el sistema';
  END IF;
  INSERT INTO publicadores (nombre, apellido, email, rol, activo)
  VALUES (p_nombre, p_apellido, p_email, 'admin', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Variables de Entorno

```env
# .env.local
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Solo la `anon_key` va al frontend. La `service_role_key` **nunca** al frontend.

---

## Estructura de Archivos Final

```
app-congregacion/
├── public/
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── providers.tsx        # QueryClient + AuthProvider
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── core/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── types.ts         # generado con supabase gen types
│   │   └── config/
│   │       ├── programa-semana.ts
│   │       └── programa-fds.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── useCurrentUser.ts
│   │   │   ├── RequireAuth.tsx
│   │   │   ├── RequireRole.tsx
│   │   │   └── pages/
│   │   │       ├── Login.tsx
│   │   │       └── AuthCallback.tsx
│   │   ├── publicadores/
│   │   │   ├── api.ts           # queries + mutations
│   │   │   ├── hooks.ts
│   │   │   └── pages/
│   │   │       └── Publicadores.tsx
│   │   ├── programa/
│   │   │   ├── semana/
│   │   │   │   ├── api.ts
│   │   │   │   ├── hooks.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProgramaSemanaView.tsx
│   │   │   │   │   ├── SeccionPartes.tsx
│   │   │   │   │   ├── ParteRow.tsx
│   │   │   │   │   └── ModalAsignacion.tsx
│   │   │   │   └── pages/
│   │   │   │       └── EntreSemana.tsx
│   │   │   └── fds/
│   │   │       ├── api.ts
│   │   │       ├── hooks.ts
│   │   │       ├── components/
│   │   │       └── pages/
│   │   │           └── FinDeSemana.tsx
│   │   ├── mis-asignaciones/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   └── pages/
│   │   │       └── MisAsignaciones.tsx
│   │   └── dashboard/
│   │       ├── api.ts
│   │       ├── hooks.ts
│   │       └── pages/
│   │           └── Dashboard.tsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── PublicadorSelector.tsx   # selector reutilizable
│   │   │   ├── NavSemana.tsx            # navegador prev/next/hoy
│   │   │   └── EmptyState.tsx
│   │   └── utils/
│   │       ├── fechas.ts                # helpers con date-fns
│   │       └── query-keys.ts
│   └── main.tsx
├── supabase/
│   └── migrations/
│       ├── 001_schema_inicial.sql
│       └── 002_rls_policies.sql
├── .env.local
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
