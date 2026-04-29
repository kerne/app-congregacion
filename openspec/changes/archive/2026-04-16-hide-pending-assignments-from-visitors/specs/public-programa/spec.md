## ADDED Requirements

### Requirement: Partes pendientes ocultas para visitantes y acceso público
El sistema NO SHALL mostrar el indicador "Pendiente" en las partes del programa cuando el usuario accede en modo visitante (autenticado sin rol admin) o mediante las rutas públicas (`/c/:slug/...`). Las partes sin asignación SHALL mostrarse con la celda de asignado vacía.

#### Scenario: Visitante ve parte sin asignar — entre semana
- **WHEN** un usuario visitante (autenticado, sin rol admin) accede a la vista de entre semana
- **THEN** las partes sin asignación muestran la celda "Asignado" vacía
- **AND** el badge "Pendiente" NO es visible

#### Scenario: Acceso público ve parte sin asignar — entre semana
- **WHEN** un usuario anónimo accede a `/c/:slug/entre-semana`
- **THEN** las partes sin asignación muestran la celda "Asignado" vacía
- **AND** el badge "Pendiente" NO es visible

#### Scenario: Visitante ve parte sin asignar — fin de semana
- **WHEN** un usuario visitante accede a la vista de fin de semana
- **THEN** las partes sin asignación muestran la celda "Asignado" vacía
- **AND** el badge "Pendiente" NO es visible

#### Scenario: Admin sigue viendo el badge Pendiente
- **WHEN** un usuario con rol admin accede a la vista de entre semana o fin de semana
- **THEN** las partes sin asignación muestran el badge "Pendiente" como antes
