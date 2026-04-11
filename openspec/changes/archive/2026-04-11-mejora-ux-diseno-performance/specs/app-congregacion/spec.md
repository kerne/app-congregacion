## MODIFIED Requirements

### Requirement: Tipografía base de la aplicación
El sistema SHALL usar Inter como fuente principal, cargada via Google Fonts CDN con `preconnect` y `font-display: swap`, configurada en Tailwind como `fontFamily.sans`.

#### Scenario: Aplicación carga con Inter
- **WHEN** el usuario abre la aplicación
- **THEN** todo el texto de la UI usa la fuente Inter con los pesos 400, 500, 600 y 700

#### Scenario: Fallback si Inter no carga
- **WHEN** Google Fonts no está disponible (offline o bloqueado)
- **THEN** la aplicación usa el stack de fuentes sans-serif del sistema sin pérdida de funcionalidad

### Requirement: Lazy loading de rutas admin
El sistema SHALL cargar el componente de la página Publicadores de forma diferida (lazy) usando `React.lazy` y `Suspense`.

#### Scenario: Primer acceso a /admin/publicadores
- **WHEN** un administrador navega a `/admin/publicadores` por primera vez en la sesión
- **THEN** se muestra un skeleton de página mientras se carga el chunk JS del módulo

#### Scenario: Acceso subsiguiente a /admin/publicadores
- **WHEN** el administrador navega nuevamente a la ruta en la misma sesión
- **THEN** el componente carga instantáneamente desde la cache del navegador

### Requirement: Memoización de callbacks en ModalAsignacion
El sistema SHALL usar `useCallback` en los handlers `onSubmit` y `handleDelete` del componente `ModalAsignacion` para evitar re-renders innecesarios en hijos.

#### Scenario: Modal se abre sin re-renders de formulario
- **WHEN** el modal de asignación está abierto y el componente padre actualiza estado no relacionado
- **THEN** los handlers del formulario mantienen la misma referencia y no causan re-render del formulario

### Requirement: Memoización de lista filtrada en PublicadorSelector
El sistema SHALL usar `useMemo` para calcular la lista filtrada de publicadores en `PublicadorSelector`, recalculando solo cuando cambian los datos o el filtro.

#### Scenario: Selector no recalcula en re-renders no relacionados
- **WHEN** el componente padre re-renderiza por cambio de estado no relacionado al selector
- **THEN** la lista filtrada de publicadores no se recalcula innecesariamente

## ADDED Requirements

### Requirement: Jerarquía visual mejorada en Dashboard
El sistema SHALL presentar el Dashboard con jerarquía visual clara: título de sección prominente, stats cards con valores numéricos destacados, y accesos rápidos diferenciados visualmente.

#### Scenario: Stats cards visibles y legibles
- **WHEN** el usuario accede al Dashboard
- **THEN** los valores numéricos de stats (asignaciones, publicadores) se muestran con `text-2xl font-bold` y las etiquetas con `text-sm text-muted-foreground`

#### Scenario: Accesos rápidos distinguibles
- **WHEN** el usuario ve la sección de accesos rápidos del Dashboard
- **THEN** cada acceso rápido tiene ícono, título y descripción alineados consistentemente con hover state visible

### Requirement: Estados vacíos accionables
El sistema SHALL mostrar estados vacíos con CTAs claros cuando corresponda, en lugar de solo texto informativo.

#### Scenario: MisAsignaciones sin asignaciones
- **WHEN** el usuario autenticado no tiene asignaciones en el período actual
- **THEN** el EmptyState muestra mensaje descriptivo del contexto (ej: "No tenés asignaciones para esta semana") sin CTA (el usuario no puede auto-asignarse)

#### Scenario: Publicadores sin resultados de búsqueda
- **WHEN** la búsqueda en Publicadores no arroja resultados
- **THEN** el EmptyState incluye un botón "Limpiar búsqueda" que resetea los filtros
