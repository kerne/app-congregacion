# Spec — skeleton-ui (source of truth)

**Origin**: mejora-ux-diseno-performance
**Archived**: 2026-04-11

---

### Requirement: Skeleton component base
El sistema SHALL proveer un componente `Skeleton` reutilizable en `/shared/components/ui/skeleton.tsx` que renderiza un placeholder animado con `animate-pulse` y fondo `bg-muted`.

#### Scenario: Render skeleton base
- **WHEN** se monta el componente `<Skeleton />`
- **THEN** se muestra un div con clases `animate-pulse rounded-md bg-muted` y acepta `className` adicional vía props

### Requirement: Skeleton en tablas de programa
El sistema SHALL mostrar un skeleton de tabla mientras se cargan los datos en EntreSemana y FinDeSemana, reemplazando el texto "Cargando...".

#### Scenario: Carga inicial de programa semanal
- **WHEN** el usuario navega a `/entre-semana` o `/fin-de-semana` y los datos aún no están disponibles
- **THEN** se muestra una tabla skeleton con filas placeholder que refleja la estructura de la tabla real (columnas: sección, tarea, publicador asignado)

#### Scenario: Navegación entre semanas con datos en cache
- **WHEN** el usuario navega a una semana que ya fue consultada
- **THEN** los datos se muestran inmediatamente desde cache de React Query sin mostrar skeleton

### Requirement: Skeleton en stats del Dashboard
El sistema SHALL mostrar skeleton cards mientras se cargan las estadísticas del Dashboard.

#### Scenario: Carga de stats del Dashboard
- **WHEN** el usuario accede al Dashboard y los conteos de asignaciones/publicadores no están disponibles
- **THEN** se muestran 3 cards skeleton del mismo tamaño que las cards reales

### Requirement: Skeleton en lista de Mis Asignaciones
El sistema SHALL mostrar skeleton items mientras se cargan las asignaciones personales.

#### Scenario: Carga de asignaciones personales
- **WHEN** el usuario autenticado navega a `/mis-asignaciones` y los datos están pendientes
- **THEN** se muestran 4 filas skeleton que reflejan el layout de cada ítem de asignación

### Requirement: Skeleton en tabla de Publicadores
El sistema SHALL mostrar skeleton rows mientras se cargan los publicadores.

#### Scenario: Carga de publicadores (admin)
- **WHEN** el administrador accede a `/admin/publicadores` y los datos están pendientes
- **THEN** se muestran 6 filas skeleton con columnas placeholder (nombre, rol, estado)
