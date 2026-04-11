# Proposal — platform-v1

**Change**: platform-v1
**Estado**: Aprobado
**Fecha**: 2026-04-11

---

## Intención

Construir desde cero la plataforma **app-congregacion** — una SPA web que permite a una congregación de los Testigos de Jehová gestionar el programa semanal de reuniones, reemplazando planillas de cálculo y comunicación dispersa por una herramienta centralizada, accesible y segura.

## Alcance

### Dentro del alcance

- Setup del proyecto: Vite + React + TypeScript + Tailwind + shadcn/ui
- Autenticación Google OAuth via Supabase Auth
- Gestión de publicadores (CRUD) con roles: publicador, editor, admin
- Programa Entre Semana: vista, asignaciones, navegación semanal
- Programa Fin de Semana: vista, asignaciones, navegación dominical
- Vista "Mis asignaciones" para usuarios autenticados
- Dashboard con estadísticas básicas
- Acceso anónimo de solo lectura (sin datos de contacto)
- Schema Supabase + migraciones + RLS policies
- Deploy en Vercel (configuración inicial)

### Fuera del alcance (v1.0)

- Notificaciones / recordatorios
- Múltiples congregaciones
- Exportación PDF / impresión
- Auditoría de cambios
- App móvil nativa

## Decisiones de Stack

| Decisión | Elección | Alternativa rechazada | Razón |
|----------|----------|-----------------------|-------|
| Framework | React + Vite | Next.js | No se necesita SSR; SPA es suficiente y más simple en Vercel |
| Lenguaje | TypeScript | JavaScript | Tipos generables desde Supabase schema — esencial para seguridad |
| Routing | React Router v6 | TanStack Router | Más maduro, mejor soporte comunitario |
| Server state | TanStack Query v5 | SWR | Cache granular por query + invalidation explícita (cumple RNF-01.2) |
| UI components | shadcn/ui + Tailwind | MUI / Chakra | Sin lock-in, accesible, fácil de customizar, idiomático con Tailwind |
| Formularios | React Hook Form + Zod | Formik | Más performante, validación en runtime + tipado en compilación |
| Supabase client | @supabase/supabase-js v2 | API REST directa | Cliente oficial con auth helpers y realtime integrado |

## Enfoque de Seguridad

La seguridad se implementa en DOS capas independientes:

1. **RLS en Supabase** — cada tabla tiene políticas que verifican `auth.uid()` y el rol del usuario
2. **Guards de React Router** — redirigen según rol, pero NUNCA son la única barrera

El rol del usuario se determina consultando la tabla `publicadores` por email autenticado. **Nunca** desde el JWT directamente ni desde el frontend sin verificación de base de datos.

## Estructura de Módulos

```
src/
├── core/               # Config global, cliente Supabase, tipos generados
│   ├── supabase/       # Cliente + tipos DB generados
│   └── config/         # Constantes (programa semana, programa FDS)
├── features/           # Módulos por dominio
│   ├── auth/           # Login, guard, contexto de usuario
│   ├── publicadores/   # CRUD admin
│   ├── programa/       # Entre semana + Fin de semana
│   ├── asignaciones/   # Lógica de asignación (editor/admin)
│   ├── mis-asignaciones/
│   └── dashboard/
├── shared/             # Componentes, hooks, utils reutilizables
│   ├── components/     # UI atómico (Button, Modal, Table, etc.)
│   └── hooks/          # useCurrentUser, useCacheQuery, etc.
└── app/                # Router, layout, providers
```

## Modelo de Datos (resumen)

- `publicadores` — miembros de la congregación con roles
- `asignaciones_semana` — asignaciones de partes entre semana
- `asignaciones_fds` — asignaciones de partes del fin de semana
- Las **partes** son constantes en código (no tabla) — la estructura del programa es fija

## Fases de Implementación

| Fase | Descripción |
|------|-------------|
| 1. Infraestructura | Setup Vite+TS, Supabase project, schema+RLS, router, layout |
| 2. Auth | Google OAuth, perfil de usuario, guards por rol |
| 3. Publicadores | CRUD admin de publicadores |
| 4. Programa Entre Semana | Vista + asignaciones por parte |
| 5. Programa Fin de Semana | Vista + asignaciones |
| 6. Mis Asignaciones | Vista personal del publicador |
| 7. Dashboard | Estadísticas + próximas asignaciones |
| 8. Acceso anónimo | Modo visitante sin auth |

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| RLS mal configurado permite lectura de datos privados | Media | Alto | Tests de RLS por rol antes de cualquier deploy |
| Primer admin bloqueado (bootstrap del sistema) | Alta | Alto | Función SQL especial para crear primer admin |
| Tipos de Supabase desincronizados | Media | Medio | Agregar `supabase gen types` al workflow de desarrollo |
| Fecha/zona horaria mal manejada | Media | Alto | Usar `date-fns-tz` con zona horaria explícita en todas las operaciones de fecha |

## Plan de Rollback

- Todo el schema vive en migraciones versionadas en `supabase/migrations/`
- Revertir un deploy de Vercel: botón en el dashboard de Vercel (< 1 minuto)
- Revertir schema: `supabase db reset` + replay de migraciones hasta el punto anterior
