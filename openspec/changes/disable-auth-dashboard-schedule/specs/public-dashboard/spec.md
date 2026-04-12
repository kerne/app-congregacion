## ADDED Requirements

### Requirement: Dashboard público accesible sin autenticación
El sistema SHALL permitir el acceso a la ruta raíz `/` sin requerir autenticación, mostrando el programa de reuniones en modo solo lectura.

#### Scenario: Visitante anónimo accede al dashboard
- **WHEN** un usuario no autenticado navega a la URL raíz `/`
- **THEN** el sistema DEBE mostrar el programa de reuniones sin redirigir a login
- **AND** el sistema DEBE mostrar un botón "Iniciar sesión" accesible en la UI

#### Scenario: Usuario autenticado accede al dashboard
- **WHEN** un usuario autenticado navega a `/`
- **THEN** el sistema DEBE mostrar el programa igual que en modo anónimo
- **AND** si el usuario tiene rol admin, DEBE mostrar además los controles de administración

### Requirement: Selección automática de vista por día de la semana
El sistema SHALL determinar automáticamente qué tipo de programa mostrar en el dashboard según el día actual de la semana del cliente.

#### Scenario: Dashboard en día entre semana (lunes a viernes)
- **WHEN** un usuario accede al dashboard en un día lunes a viernes
- **THEN** el sistema DEBE mostrar el programa de la reunión entre semana de la semana actual
- **AND** el indicador de tipo de reunión DEBE reflejar "Entre Semana"

#### Scenario: Dashboard en día fin de semana (sábado o domingo)
- **WHEN** un usuario accede al dashboard en sábado o domingo
- **THEN** el sistema DEBE mostrar el programa de la reunión fin de semana del fin de semana actual
- **AND** el indicador de tipo de reunión DEBE reflejar "Fin de Semana"

### Requirement: Lectura anónima de asignaciones en Supabase
Las tablas `asignaciones_semana`, `asignaciones_fds` y `publicadores` SHALL permitir operaciones SELECT al rol `anon` de Supabase, excluyendo columnas de datos de contacto (email, teléfono).

#### Scenario: Query anónima a asignaciones_semana
- **WHEN** un cliente sin autenticación consulta `asignaciones_semana`
- **THEN** Supabase DEBE retornar las filas con nombre, apellido y datos del programa
- **AND** NO DEBE incluir email ni teléfono de los publicadores

#### Scenario: Query anónima a asignaciones_fds
- **WHEN** un cliente sin autenticación consulta `asignaciones_fds`
- **THEN** Supabase DEBE retornar las filas con nombre, apellido y datos del programa
- **AND** NO DEBE incluir email ni teléfono de los publicadores

#### Scenario: Intento de escritura anónima
- **WHEN** un cliente sin autenticación intenta INSERT, UPDATE o DELETE en cualquier tabla
- **THEN** Supabase DEBE rechazar la operación con error de permisos (RLS)
