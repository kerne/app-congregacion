## Context

La app tiene una base técnica sólida (shadcn/ui, Radix UI, React Query, Tailwind CSS) pero la capa visual y de experiencia de usuario está en estado "funcional mínimo". No hay estados de carga visuales, las listas no son filtrables, y React no está aprovechando optimizaciones disponibles (memo, lazy loading). Este cambio es puramente frontend — no toca Supabase, RLS, ni APIs.

Estado actual:
- Carga de datos: texto plano "Cargando..." en tablas y listas
- Tablas admin: sin búsqueda ni filtrado
- Performance React: sin memo, sin lazy loading, sin useMemo
- Tipografía: system font fallback, sin escala tipográfica explícita

## Goals / Non-Goals

**Goals:**
- Skeleton loaders en todos los estados de carga pesada (tablas, dashboard stats)
- Filtrado y búsqueda client-side en la tabla de Publicadores
- Lazy loading de rutas admin (Publicadores) con Suspense
- Memoización de callbacks y listas filtradas en componentes de listas
- Inter como tipografía base via Google Fonts (o local via Fontsource)
- Mejoras de jerarquía visual en Dashboard (mejor contraste, espaciado)
- Estados vacíos más descriptivos con CTAs accionables

**Non-Goals:**
- Cambios a la lógica de negocio o contratos de datos
- Modificaciones a Supabase, RLS, o Edge Functions
- Paginación server-side (el volumen de datos no lo justifica aún)
- Cambio de librería de componentes (shadcn/ui se mantiene)
- Internacionalización (i18n)
- Dark mode

## Decisions

### D1: Skeleton UI — componente propio vs librería externa

**Decisión**: Crear `skeleton.tsx` como componente shadcn/ui estilo (div con `animate-pulse`), consistente con el resto de la librería.

**Alternativas consideradas**:
- `react-loading-skeleton` (librería externa): más features pero dependencia adicional innecesaria para un caso simple
- CSS puro con keyframes: más verboso, menos mantenible que Tailwind animate-pulse

**Rationale**: El patrón de shadcn/ui ya usa `animate-pulse` internamente. Un div con `rounded` y `bg-muted` es todo lo que se necesita.

### D2: Filtrado de Publicadores — client-side vs server-side

**Decisión**: Filtrado client-side con `useMemo`.

**Rationale**: El número de publicadores en una congregación típica es < 200. Filtrar en cliente evita round-trips innecesarios y la UI es instantánea. React Query ya tiene los datos en cache.

### D3: Lazy loading — todas las rutas vs solo admin

**Decisión**: Lazy loading solo para rutas admin (`/admin/publicadores`).

**Rationale**: Las rutas de uso frecuente (dashboard, programas) deben cargar instantáneamente. Admin es usada por pocos usuarios y puede tolerar el overhead de carga inicial del chunk.

**Implementación**:
```tsx
const Publicadores = React.lazy(() => import('@/features/publicadores/pages/Publicadores'))
// En router: <Suspense fallback={<PageSkeleton />}>
```

### D4: Tipografía — Google Fonts CDN vs Fontsource local

**Decisión**: Google Fonts CDN con `preconnect`.

**Rationale**: Vercel tiene CDN global; Google Fonts con `display=swap` tiene impacto mínimo en LCP. Fontsource requiere configuración adicional de bundler para una ganancia marginal en este contexto.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### D5: Memoización — dónde y cuándo

**Decisión**: Aplicar `React.memo` en row components de tablas, `useMemo` en listas filtradas, `useCallback` en handlers de modals.

**Targets específicos**:
- `PublicadorRow` (si se extrae como componente): `React.memo`
- Lista filtrada en Publicadores: `useMemo(() => filter(publicadores, query, rol), [publicadores, query, rol])`
- `handleDelete` y `onSubmit` en ModalAsignacion: `useCallback`

## Risks / Trade-offs

- **[Riesgo] Inter font aumenta requests HTTP iniciales** → Mitigación: `preconnect` + `font-display: swap` garantizan que no bloqueen render
- **[Riesgo] Skeleton shapes incorrectos (no reflejan layout real)** → Mitigación: Crear skeletons específicos por componente, no genéricos
- **[Riesgo] Lazy loading con Suspense puede mostrar flash de fallback** → Mitigación: El skeleton de página es lo suficientemente similar al layout real para minimizar el efecto
- **[Trade-off] useMemo agrega complejidad de legibilidad** → Aceptable: el beneficio de evitar re-renders en listas medianas justifica el costo cognitivo

## Migration Plan

1. Agregar Inter a `index.html` (preconnect + stylesheet)
2. Actualizar `tailwind.config.ts` con `fontFamily.sans` → Inter
3. Crear `skeleton.tsx` en `/shared/components/ui/`
4. Implementar skeletons en tablas (EntreSemana, FinDeSemana, Publicadores) y Dashboard stats
5. Agregar búsqueda + filtro en Publicadores (state local + useMemo)
6. Lazy loading en `router.tsx` para ruta admin
7. Memoización en ModalAsignacion y PublicadorSelector
8. Ajustes visuales en Dashboard (jerarquía, espaciado)

Sin rollback especial necesario — todos los cambios son reversibles via git. No hay migraciones de DB.

## Open Questions

- ¿Agregar sort por columna en la tabla de Publicadores además del filtro? (aumento de scope moderado)
- ¿Los skeletons del programa semanal deben reflejar exactamente las filas de cada sección o usar un skeleton genérico de tabla?
