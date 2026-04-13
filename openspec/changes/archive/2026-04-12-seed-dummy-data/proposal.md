## Why

El desarrollo local y las pruebas manuales requieren datos representativos para validar la UI, las asignaciones de reuniones y los filtros. Sin datos dummy, los desarrolladores trabajan con tablas vacías, lo que hace imposible verificar flujos reales.

## What Changes

- Se crea un script SQL (o TypeScript/Node) de seeding que inserta datos en las tablas existentes de Supabase
- El script cubre un periodo de 4 semanas de reuniones (reuniones de entre semana + fin de semana)
- Se insertan publicadores, asignaciones a discursos, presidencias, lectores y otras partes del programa
- El script es idempotente: puede re-ejecutarse sin duplicar datos (usa DELETE o TRUNCATE + INSERT)

## Capabilities

### New Capabilities

- `seed-dummy-data`: Script de seeding que popula las tablas con datos dummy para 4 semanas de reuniones y asignaciones

### Modified Capabilities

*(ninguna — no se modifican specs existentes)*

## Impact

- Tablas afectadas: `publicadores`, `reuniones` (o equivalente), `asignaciones`, y cualquier tabla de partes del programa
- No afecta código de producción — es solo un script utilitario de desarrollo
- Sin cambios a RLS policies ni componentes React
- Se recomienda ejecutar solo en entorno de desarrollo/staging, nunca en producción
