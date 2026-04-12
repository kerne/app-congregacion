## Why

El archivo `supabase/PROGRAMA MARZO Y ABRIL 2026.csv` contiene 8 semanas de programa de reunión entre semana (marzo-abril 2026). Los publicadores ya están cargados. Se necesita un script TypeScript que inserte las asignaciones en `asignaciones_semana` relacionando cada parte con su publicador por nombre.

## What Changes

- Nuevo script `supabase/scripts/seed-asignaciones.ts` que:
  - Tiene las 8 semanas hardcodeadas (el CSV es irregular, no parseable genéricamente)
  - Busca IDs de publicadores por nombre con ilike (tolerante a acentos)
  - Hace DELETE + INSERT por semana (idempotente, re-ejecutable)
  - Soporta `--dry-run` para verificar lookups antes de insertar

## Capabilities

### New Capabilities
<!-- ninguna — script de utilidad -->

### Modified Capabilities
<!-- ninguna -->

## Impact

- Nuevo archivo: `supabase/scripts/seed-asignaciones.ts`
- Requiere `VITE_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`

## Semanas en el CSV

| Fecha CSV | Semana (lunes) | Particularidades |
|-----------|----------------|-----------------|
| 5-mar | 2026-03-02 | 3 partes SMT |
| 12-mar | 2026-03-09 | 4 partes SMT, Sala B en `mejores_maestros` |
| 19-mar | 2026-03-16 | Sala B en `mejores_maestros` y SMT |
| 26-mar | 2026-03-23 | Solo 1 parte NVC |
| 9-abr | 2026-04-06 | (sin semana 2-abr: Conmemoración) |
| 16-abr | 2026-04-13 | Typo "Sala Proncipal" en CSV |
| 23-abr | 2026-04-20 | 4 partes SMT |
| 30-abr | 2026-04-27 | Solo 1 parte NVC |

## Casos edge detectados

- **No encontrados en publicadores**: "Aarón Liempi", "Alison Moya"
- **Ortografía diferente**: "Daisy" vs "Deysi", "Jahaziel" vs "Jaziel", "Estephany" vs "Stephany", "Franklyn" vs "Franklin"
- **Ambiguos**: "Pedro Jiménez" (2 en DB), "Marcos Moya" (2 en DB)
- El script reporta todos estos en output pero continúa insertando los que sí resuelve
