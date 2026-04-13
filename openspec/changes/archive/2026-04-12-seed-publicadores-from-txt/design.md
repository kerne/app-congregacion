## Context

El archivo tiene líneas como:
- `ACUÑA MATIAS` → apellido: Acuña, nombre: Matias
- `CAMPOS MENDEZ JACKELINE` → apellido: Campos Mendez, nombre: Jackeline
- `ASTORGA PAULINA TOLEDO DE` → apellido: Astorga Paulina Toledo De, nombre: De (edge case)
- `ARAYA DE DEYSI` → apellido: Araya De, nombre: Deysi

La regla más simple y consistente: **última palabra = nombre, todo lo anterior = apellido**. Para líneas terminadas en `DE` (sufijo de casada), el resultado puede ser raro pero es manejable — se puede corregir manualmente después.

La tabla `publicadores` requiere `email UNIQUE NOT NULL`. Como la lista no tiene emails, se genera un placeholder: `nombre-apellido@placeholder.local` slugificado y colisionable.

## Goals / Non-Goals

**Goals:**
- Script ejecutable una sola vez (o N veces de forma idempotente via upsert por email)
- Parseo robusto del formato TXT
- Usa `SUPABASE_SERVICE_ROLE_KEY` para bypasear RLS en la inserción

**Non-Goals:**
- Importar emails o teléfonos reales (no están en el archivo)
- Asignar roles distintos a `publicador` (se hace manualmente en la app)
- Validación de duplicados por nombre (puede haber dos personas con el mismo nombre)

## Decisions

- **Runtime**: `tsx` (ya disponible en proyectos Vite/TS) para ejecutar TypeScript directamente con `npx tsx`
- **Upsert por email**: evita duplicados en re-ejecuciones del script
- **Email placeholder**: `${slugNombre}.${slugApellido}@placeholder.local` — único si no hay duplicados de nombre completo
- **Title Case manual**: sin dependencia externa, función simple de capitalización

## Risks / Trade-offs

- Líneas con nombres ambiguos (ej. `ASTORGA PAULINA TOLEDO DE`) quedarán con apellido largo y nombre `De`. Se corrigen manualmente.
- Si hay dos personas con exactamente el mismo nombre, el email colisiona y el upsert actualiza en lugar de insertar. Riesgo bajo con nombres reales.
