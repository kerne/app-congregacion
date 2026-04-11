# Spec — publicadores-filtros (source of truth)

**Origin**: mejora-ux-diseno-performance
**Archived**: 2026-04-11

---

### Requirement: Búsqueda por nombre en tabla de Publicadores
El sistema SHALL permitir al administrador filtrar publicadores por nombre mediante un input de búsqueda en tiempo real, sin hacer requests adicionales al servidor.

#### Scenario: Búsqueda encuentra coincidencias
- **WHEN** el administrador escribe en el campo de búsqueda
- **THEN** la tabla se filtra instantáneamente mostrando solo publicadores cuyo nombre contiene el texto ingresado (case-insensitive)

#### Scenario: Búsqueda sin resultados
- **WHEN** el administrador escribe un texto que no coincide con ningún publicador
- **THEN** la tabla muestra el componente EmptyState con mensaje "No se encontraron publicadores para tu búsqueda"

#### Scenario: Limpiar búsqueda
- **WHEN** el administrador borra el texto del input de búsqueda
- **THEN** la tabla muestra todos los publicadores nuevamente

### Requirement: Filtro por rol en tabla de Publicadores
El sistema SHALL permitir al administrador filtrar publicadores por rol (admin, editor, publicador) mediante un selector.

#### Scenario: Filtrar por rol específico
- **WHEN** el administrador selecciona un rol en el filtro
- **THEN** la tabla muestra solo los publicadores que tienen ese rol asignado

#### Scenario: Filtro "Todos los roles"
- **WHEN** el administrador selecciona la opción "Todos" en el filtro de rol
- **THEN** la tabla muestra todos los publicadores sin importar su rol

### Requirement: Combinación de búsqueda y filtro por rol
El sistema SHALL aplicar simultáneamente el filtro de texto y el filtro de rol cuando ambos están activos.

#### Scenario: Búsqueda con filtro activo
- **WHEN** el administrador tiene un filtro de rol seleccionado y además escribe en el campo de búsqueda
- **THEN** la tabla muestra solo los publicadores que coinciden con AMBOS criterios (rol Y texto)

### Requirement: Contador de resultados filtrados
El sistema SHALL mostrar la cantidad de publicadores visibles tras aplicar filtros.

#### Scenario: Mostrar conteo con filtros activos
- **WHEN** hay filtros activos y la lista está filtrada
- **THEN** se muestra un texto del tipo "X de Y publicadores" bajo los controles de filtro
