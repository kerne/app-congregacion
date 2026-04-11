## MODIFIED Requirements

### Requirement: Indicador visual de modo lectura para visitantes
Las páginas de programa (Entre Semana y Fin de Semana) SHALL mostrar un indicador visual de "Solo lectura" cuando el usuario no tiene rol `admin`, para comunicar explícitamente el modo de la interfaz.

#### Scenario: Visitante ve indicador de modo lectura en Entre Semana
- **WHEN** un usuario sin rol `admin` accede a `/entre-semana`
- **THEN** el sistema DEBE mostrar un badge o chip con el texto "Solo lectura" visible en el encabezado de la página
- **AND** NO DEBE mostrar controles de edición

#### Scenario: Visitante ve indicador de modo lectura en Fin de Semana
- **WHEN** un usuario sin rol `admin` accede a `/fin-de-semana`
- **THEN** el sistema DEBE mostrar un badge o chip con el texto "Solo lectura" visible en el encabezado de la página
- **AND** NO DEBE mostrar controles de edición

#### Scenario: Admin no ve indicador de solo lectura
- **WHEN** un usuario con rol `admin` accede a `/entre-semana` o `/fin-de-semana`
- **THEN** el sistema NO DEBE mostrar el indicador "Solo lectura"
- **AND** DEBE mostrar los controles de edición normalmente

## ADDED Requirements

### Requirement: Empty states diferenciados por rol en páginas de programa
Las páginas de programa SHALL mostrar mensajes de estado vacío diferenciados según el rol del usuario, para comunicar adecuadamente la situación a cada tipo de usuario.

#### Scenario: Visitante ve semana sin programa cargado
- **WHEN** un usuario sin rol `admin` accede a `/entre-semana` o `/fin-de-semana` y no hay asignaciones para esa semana
- **THEN** el sistema DEBE mostrar el mensaje "El programa de esta semana no está disponible aún"
- **AND** NO DEBE mostrar ningún call-to-action de edición

#### Scenario: Admin ve semana sin asignaciones
- **WHEN** un usuario con rol `admin` accede a `/entre-semana` o `/fin-de-semana` y no hay asignaciones para esa semana
- **THEN** el sistema DEBE mostrar el mensaje "No hay asignaciones — empezá asignando partes"
- **AND** la tabla DEBE mostrarse con las partes disponibles pero sin asignados
