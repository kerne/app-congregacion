## 1. Dashboard UI

- [x] 1.1 Remover el `StatCard` de "Publicadores activos" en `Dashboard.tsx`
- [x] 1.2 Cambiar la grilla de `sm:grid-cols-3` a `sm:grid-cols-2`

## 2. Limpieza de código

- [x] 2.1 Remover la query de conteo de publicadores en `getDashboardStats` (`src/features/dashboard/api.ts`)
- [x] 2.2 Remover el campo `publicadoresActivos` del tipo `DashboardStats` en `src/core/supabase/types.ts`
- [x] 2.3 Remover el import de `Users` de lucide-react en `Dashboard.tsx` si queda sin usar
