## Context

La app maneja tres tablas principales: `publicadores`, `asignaciones_semana` y `asignaciones_fds`. Las partes del programa están hardcodeadas en `src/core/config/programa-semana.ts` y `programa-fds.ts` — los `parte_id` válidos vienen de ahí, no de la DB.

El script de seeding debe respetar estos IDs exactos y las restricciones UNIQUE de las tablas.

## Goals / Non-Goals

**Goals:**
- Generar un script SQL idempotente con datos realistas para 4 semanas
- Poblar las 3 tablas respetando FKs, UNIQUEs y CHECKs del schema
- Cubrir todas las partes del programa tanto entre semana como fin de semana
- Incluir publicadores con distintos roles (`publicador`, `editor`, `admin`)

**Non-Goals:**
- No modifica ni crea tablas — solo INSERT data
- No genera usuarios de Supabase Auth (solo la tabla `publicadores`)
- No se integra con CI/CD ni se ejecuta automáticamente
- No se ejecuta en producción

## Decisions

### Formato: SQL puro (no TypeScript/Node)

**Decisión**: Script SQL ejecutable directo en Supabase Dashboard o con `psql`.

**Alternativas consideradas**:
- TypeScript con `@supabase/supabase-js`: requiere variables de entorno y runtime Node
- `supabase db seed`: requiere integración con CLI de Supabase y archivo `seed.sql` en lugar específico

**Razón**: SQL puro es el formato más portable, ejecutable en cualquier entorno sin dependencias adicionales. Se puede pegar directo en el SQL Editor de Supabase.

### Idempotencia: DELETE explícito antes de INSERT

**Decisión**: Usar `DELETE FROM` en orden correcto (respetando FKs) antes de insertar.

**Razón**: `TRUNCATE CASCADE` puede ser peligroso si hay datos reales; `ON CONFLICT DO NOTHING` no garantiza datos actualizados. Un `DELETE WHERE email LIKE '%@seed.test'` es quirúrgico y seguro.

### Datos identificables: dominio `@seed.test`

**Decisión**: Todos los emails de publicadores dummy usan el dominio `@seed.test`.

**Razón**: Permite identificarlos y borrarlos limpiamente sin afectar datos reales.

### Semanas: lunes de cada semana (4 semanas a partir de fecha fija)

**Decisión**: Usar fechas hardcodeadas a partir del lunes siguiente a la fecha de creación del script (2026-04-13, 2026-04-20, 2026-04-27, 2026-05-04). FDS: domingo de cada semana (2026-04-12, 2026-04-19, 2026-04-26, 2026-05-03).

**Razón**: Fechas fijas son reproducibles. El campo `semana` en `asignaciones_semana` es el lunes de la semana; `fecha` en `asignaciones_fds` es el domingo.

## Risks / Trade-offs

- [RLS activo] → El script debe ejecutarse con el rol `service_role` o desde el SQL Editor de Supabase (que bypasea RLS). **Mitigación**: documentar esto en comentarios del script.
- [UUIDs hardcodeados] → Usar UUIDs fijos con `gen_random_uuid()` inline haría cada ejecución no-idempotente. **Mitigación**: declarar UUIDs fijos con variables `\set` o CTEs para reusar referencias entre tablas.
- [parte_id hardcoded] → Los IDs de partes en el config de TypeScript deben coincidir exactamente con los valores en el script SQL. **Mitigación**: copiar IDs directamente del config.
