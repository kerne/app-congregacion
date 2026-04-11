# Tasks — platform-v1

**Change**: platform-v1
**Fecha**: 2026-04-11

---

## Fase 1 — Infraestructura del Proyecto

- [x] 1.1 Crear proyecto con Vite + React + TypeScript
  - `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` creados manualmente
- [x] 1.2 Instalar y configurar Tailwind CSS v3
  - `tailwind.config.ts` y `postcss.config.js` configurados; `src/index.css` con variables CSS
- [x] 1.3 Instalar y configurar shadcn/ui
  - Componentes creados en `src/shared/components/ui/`: button, input, label, select, dialog, badge
- [x] 1.4 Instalar dependencias core
  - Todas declaradas en `package.json` (sonner en lugar de date-fns-tz — date-fns v4 tiene soporte TZ nativo)
- [x] 1.5 Crear cliente Supabase en `src/core/supabase/client.ts`
- [x] 1.6 Configurar providers en `src/app/providers.tsx`
  - QueryClient con staleTime: 60000 + BrowserRouter + AuthProvider + Toaster (sonner)
- [x] 1.7 Crear layout base en `src/app/layout/`
  - AppLayout.tsx, Sidebar.tsx, Header.tsx — sidebar colapsable en mobile
- [x] 1.8 Configurar rutas base en `src/app/router.tsx`
- [x] 1.9 Crear constantes del programa
  - `src/core/config/programa-semana.ts` + `src/core/config/programa-fds.ts`
  - Incluye colores por sección y helpers de agrupación
- [x] 1.10 Migraciones Supabase
  - `supabase/migrations/001_schema_inicial.sql` — tablas + índices
  - `supabase/migrations/002_rls_policies.sql` — función get_user_rol() + todas las policies + crear_primer_admin()

---

## Fase 2 — Autenticación

- [ ] 2.1 Configurar Google OAuth en Supabase Dashboard
  - Habilitar provider Google, configurar redirect URL *(manual — requiere acceso al dashboard)*
- [x] 2.2 Crear `AuthProvider` en `src/features/auth/AuthProvider.tsx`
- [x] 2.3 Crear hook `useCurrentUser` en `src/features/auth/useCurrentUser.ts`
  - Helpers: isAdmin(), isEditor(), isPublicador(), isAnon()
- [x] 2.4 Crear página `Login.tsx`
- [x] 2.5 Crear página `AuthCallback.tsx`
- [x] 2.6 Crear `RequireAuth.tsx` — guarda returnTo en sessionStorage
- [x] 2.7 Crear `RequireRole.tsx` — redirige con toast si sin acceso

---

## Fase 3 — Gestión de Publicadores (Admin)

- [x] 3.1 Crear `src/features/publicadores/api.ts`
- [x] 3.2 Crear hooks en `src/features/publicadores/hooks.ts`
- [x] 3.3 + 3.4 Crear página `Publicadores.tsx` con `ModalPublicador` inline
- [x] 3.5 Rutas admin protegidas con `<RequireRole roles={['admin']}>`

---

## Fase 4 — Programa Entre Semana

- [x] 4.1 Crear `src/features/programa/semana/api.ts`
- [x] 4.2 Crear hooks `src/features/programa/semana/hooks.ts`
- [x] 4.3 Crear `NavSemana.tsx` en `src/shared/components/`
- [x] 4.4 Crear `ProgramaSemanaView.tsx`
- [x] 4.5 Crear `SeccionPartes.tsx`
- [x] 4.6 Crear `ParteRow.tsx`
- [x] 4.7 Crear `ModalAsignacion.tsx` — maneja semana y FDS (genérico)
- [x] 4.8 Crear `PublicadorSelector.tsx`
- [x] 4.9 Crear página `EntreSemana.tsx`

---

## Fase 5 — Programa Fin de Semana

- [x] 5.1 Crear `src/features/programa/fds/api.ts`
- [x] 5.2 Crear hooks `src/features/programa/fds/hooks.ts`
- [x] 5.3 NavSemana reutilizado con prop `labelHoy="Este domingo"`
- [x] 5.4 Crear `ProgramaFDSView.tsx`
- [x] 5.5 Crear página `FinDeSemana.tsx`

---

## Fase 6 — Mis Asignaciones

- [x] 6.1 Crear `src/features/mis-asignaciones/api.ts`
  - UNION de asignaciones_semana + asignaciones_fds via Promise.all
  - Resuelve nombre de parte desde constantes en código
- [x] 6.2 Crear hooks `useMisAsignaciones`
- [x] 6.3 Crear página `MisAsignaciones.tsx`
- [x] 6.4 Ruta protegida con `<RequireAuth>`

---

## Fase 7 — Dashboard

- [x] 7.1 Crear `src/features/dashboard/api.ts`
- [x] 7.2 Crear hooks `useDashboardStats`
- [x] 7.3 Crear página `Dashboard.tsx`
  - Stats cards + próximas asignaciones personales + accesos rápidos

---

## Fase 8 — Acceso Anónimo y Polish

- [x] 8.1 Rutas públicas funcionan sin autenticación (no hay RequireAuth en `/`, `/entre-semana`, `/fin-de-semana`)
- [x] 8.2 Queries excluyen email/teléfono — PublicadorPublico solo tiene id/nombre/apellido/rol
- [x] 8.3 `EmptyState.tsx` creado
- [ ] 8.4 Manejo de sesión caducada en AuthProvider *(parcial — Supabase refresca tokens automáticamente; sesiones expiradas redirigen a login)*
- [x] 8.5 Responsividad — sidebar colapsable, layout mobile-first, min-h/w 44px en botones

---

## Fase 9 — Deploy

- [ ] 9.1 Crear proyecto en Supabase Cloud + correr migraciones *(requiere cuenta Supabase)*
- [ ] 9.2 Configurar Google OAuth en Supabase Cloud *(manual)*
- [ ] 9.3 Conectar a Vercel + variables de entorno *(manual)*
- [ ] 9.4 Verificar deploy *(manual)*

---

## Checklist de Seguridad Pre-Deploy

- [ ] SEC-1 Verificar que RLS está habilitado en las 3 tablas *(en migración 002 — verificar en dashboard)*
- [ ] SEC-2 Testear queries como usuario anónimo
- [ ] SEC-3 Testear INSERT como publicador: rechazado por RLS
- [ ] SEC-4 Testear UPDATE publicadores como editor: rechazado por RLS
- [ ] SEC-5 Verificar que VITE_SUPABASE_ANON_KEY es la anon key
- [ ] SEC-6 Verificar .gitignore cubre .env.local
