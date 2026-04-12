## Why

El stat card "Publicadores activos" no es relevante para el público general que visita el dashboard sin autenticación. El conteo de publicadores es información interna de la congregación, no parte del programa visible.

## What Changes

- Remover el `StatCard` de "Publicadores activos" del componente `Dashboard`
- La grilla de stats pasa de 3 columnas a 2 columnas (`sm:grid-cols-2`)
- La query de conteo de publicadores en `getDashboardStats` puede eliminarse o mantenerse si otras partes la usan

## Capabilities

### New Capabilities
<!-- ninguna -->

### Modified Capabilities
- `app-congregacion`: El dashboard ya no muestra la estadística de publicadores activos

## Impact

- `src/features/dashboard/pages/Dashboard.tsx` — remover el StatCard y ajustar la grilla
- `src/features/dashboard/api.ts` — remover la query de conteo de publicadores si no tiene otros usos
- `src/features/dashboard/hooks.ts` — posible limpieza si el tipo `DashboardStats` expone el campo
- `src/core/supabase/types.ts` — posible limpieza del campo `publicadoresActivos` en `DashboardStats`
