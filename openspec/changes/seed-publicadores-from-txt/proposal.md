## Why

Existe una lista de 141 publicadores en `supabase/publicadores.txt` con el formato `APELLIDO NOMBRE` (mayúsculas, un publicador por línea). Se necesita un script de Node.js para parsear ese archivo e insertar los registros en la tabla `publicadores` de Supabase.

## What Changes

- Nuevo script `supabase/scripts/seed-publicadores.ts` que:
  - Lee `supabase/publicadores.txt`
  - Parsea cada línea en `apellido` y `nombre` (última palabra = nombre, resto = apellido)
  - Normaliza a Title Case
  - Genera un email placeholder único por publicador (`nombre.apellido@placeholder.local`)
  - Inserta en Supabase via el cliente con `upsert` (idempotente por email)
  - Imprime resumen: insertados, omitidos, errores

## Capabilities

### New Capabilities
<!-- ninguna — es un script de utilidad, no modifica el flujo de la app -->

### Modified Capabilities
<!-- ninguna -->

## Impact

- Nuevo archivo: `supabase/scripts/seed-publicadores.ts`
- Requiere variables de entorno: `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (service role para bypass de RLS)
- Sin impacto en el código de la app
