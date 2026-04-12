## MODIFIED Requirements

### Requirement: Indicador visual de modo lectura para visitantes
Las páginas de programa (Entre Semana y Fin de Semana) SHALL mostrar un indicador visual de "Solo lectura" cuando el usuario no tiene rol `admin`, para comunicar explícitamente el modo de la interfaz. Este requisito ahora aplica también a usuarios **anónimos** (no autenticados), no solo a visitantes autenticados sin rol admin.

#### Scenario: Visitante ve indicador de modo lectura en Entre Semana
- **WHEN** un usuario sin rol `admin` (incluyendo anónimos) accede a `/entre-semana`
- **THEN** el sistema DEBE mostrar un badge o chip con el texto "Solo lectura" visible en el encabezado de la página
- **AND** NO DEBE mostrar controles de edición

#### Scenario: Visitante ve indicador de modo lectura en Fin de Semana
- **WHEN** un usuario sin rol `admin` (incluyendo anónimos) accede a `/fin-de-semana`
- **THEN** el sistema DEBE mostrar un badge o chip con el texto "Solo lectura" visible en el encabezado de la página
- **AND** NO DEBE mostrar controles de edición

#### Scenario: Admin no ve indicador de solo lectura
- **WHEN** un usuario con rol `admin` accede a `/entre-semana` o `/fin-de-semana`
- **THEN** el sistema NO DEBE mostrar el indicador "Solo lectura"
- **AND** DEBE mostrar los controles de edición normalmente
