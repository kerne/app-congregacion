## ADDED Requirements

### Requirement: Script SQL idempotente de seeding

El sistema SHALL proveer un script SQL en `supabase/seed.sql` que inserte datos dummy para desarrollo y testing.

El script MUST:
- Borrar datos dummy existentes (identificados por email `@seed.test`) antes de insertar
- Insertar al menos 15 publicadores con variedad de roles (`publicador`, `editor`, `admin`)
- Cubrir 4 semanas consecutivas de reuniones entre semana (lunes) y fin de semana (domingo)
- Asignar todas las partes no-opcionales del programa entre semana para cada semana
- Asignar todas las partes del programa de fin de semana para cada fecha
- Ser ejecutable directo en Supabase SQL Editor sin dependencias externas

#### Scenario: Ejecución inicial en base vacía
- **WHEN** se ejecuta el script en una base sin datos
- **THEN** se insertan publicadores, asignaciones entre semana y asignaciones FDS sin errores

#### Scenario: Re-ejecución idempotente
- **WHEN** se ejecuta el script por segunda vez
- **THEN** no se duplican registros y los datos quedan en el mismo estado que tras la primera ejecución

### Requirement: Publicadores con roles variados

El script SHALL insertar publicadores con los roles definidos en el schema (`publicador`, `editor`, `admin`).

#### Scenario: Publicadores con rol admin
- **WHEN** se consulta la tabla `publicadores` tras el seeding
- **THEN** existe al menos 1 publicador con `rol = 'admin'`

#### Scenario: Publicadores con rol editor
- **WHEN** se consulta la tabla `publicadores` tras el seeding
- **THEN** existe al menos 1 publicador con `rol = 'editor'`

### Requirement: Asignaciones entre semana completas

El script SHALL insertar asignaciones en `asignaciones_semana` para las 4 semanas, cubriendo todas las partes obligatorias.

Las partes obligatorias son (extraídas de `programa-semana.ts`):
- `presidente`, `lector_tesoros` (apertura)
- `discurso_tesoros`, `mejores_maestros`, `busqueda_tesoros` (tesoros)
- `smt_parte1`, `smt_parte2` (smt — sala `principal` y opcionalmente sala `B`)
- `nvc_parte1`, `estudio_congregacion` (nvc)
- `cierre` (cierre)

Las partes con `tieneAsistente: true` (`smt_parte1`, `smt_parte2`) MUST tener `asistente_id` asignado.
Las partes con `tieneTema: true` MUST tener el campo `tema` con un texto no vacío.

#### Scenario: Cobertura completa de partes por semana
- **WHEN** se consulta `asignaciones_semana` para una semana del seed
- **THEN** existen registros para todas las partes no-opcionales

#### Scenario: Asistentes en partes SMT
- **WHEN** se consulta `asignaciones_semana` para `parte_id IN ('smt_parte1', 'smt_parte2')`
- **THEN** todos los registros tienen `asistente_id IS NOT NULL`

### Requirement: Asignaciones de fin de semana completas

El script SHALL insertar asignaciones en `asignaciones_fds` para los 4 domingos, cubriendo todas las partes del programa FDS.

Las partes son (extraídas de `programa-fds.ts`):
- `fds_presidente` (apertura)
- `fds_orador` (discurso) — MUST tener `tema` no vacío
- `fds_presidente_atalaya`, `fds_lector_atalaya` (atalaya)
- `fds_oracion_final` (cierre)

#### Scenario: Cobertura completa de partes FDS por fecha
- **WHEN** se consulta `asignaciones_fds` para un domingo del seed
- **THEN** existen registros para las 5 partes del programa FDS

#### Scenario: Tema en discurso público
- **WHEN** se consulta `asignaciones_fds` para `parte_id = 'fds_orador'`
- **THEN** todos los registros tienen `tema IS NOT NULL AND tema != ''`

### Requirement: Identificación y limpieza de datos dummy

El script SHALL usar el dominio `@seed.test` en los emails de publicadores dummy para permitir su identificación y borrado selectivo.

#### Scenario: Borrado selectivo de datos dummy
- **WHEN** se ejecuta `DELETE FROM publicadores WHERE email LIKE '%@seed.test'` con CASCADE
- **THEN** se eliminan todos los publicadores y sus asignaciones asociadas sin afectar datos reales

#### Scenario: Ejecución segura con datos reales
- **WHEN** existen publicadores reales (email sin `@seed.test`) en la base
- **THEN** el script no los modifica ni elimina
