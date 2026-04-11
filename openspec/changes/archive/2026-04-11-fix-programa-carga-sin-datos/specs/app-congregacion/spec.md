## MODIFIED Requirements

### Requirement: Carga del programa semanal
El sistema SHALL mostrar los datos del programa de reuniones cuando Supabase retorne filas, y SHALL mostrar tabla vacía (sin error) cuando no haya datos para esa semana. Cuando la query falle, SHALL mostrar un estado de error con opción de reintentar.

#### Scenario: Carga exitosa con datos
- **WHEN** el usuario navega a `/entre-semana` o `/fin-de-semana` y Supabase retorna asignaciones
- **THEN** la tabla muestra las partes con sus asignados correctamente

#### Scenario: Semana sin asignaciones
- **WHEN** el usuario navega a una semana que no tiene asignaciones en la base de datos
- **THEN** la tabla se muestra vacía (o con estado vacío por parte), sin mensaje de error

#### Scenario: Error de carga
- **WHEN** la query a Supabase falla (error de red, RLS, timeout)
- **THEN** se muestra un estado de error con mensaje descriptivo y botón "Reintentar"
- **THEN** al hacer click en "Reintentar" se ejecuta nuevamente la query

#### Scenario: Navegación entre semanas preserva asignaciones guardadas
- **WHEN** el usuario guarda una asignación en la semana A y luego navega a semana B y vuelve a semana A
- **THEN** la asignación guardada en semana A sigue visible (cache invalidado correctamente)
