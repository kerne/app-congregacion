## Architecture

### Approach: Cards + Sub-rutas con React Router

La página base muestra dos cards (Entre Semana / Fin de Semana). Cada card navega a una sub-ruta dedicada donde se renderiza la sección correspondiente con su propio header y botón de volver.

### Component Structure

```
/admin/configuracion-reuniones          → ConfiguracionReunionesIndex (cards)
/admin/configuracion-reuniones/entre-semana  → ConfigES (wrapper + SeccionConfigES)
/admin/configuracion-reuniones/fin-de-semana → ConfigFDS (wrapper + SeccionConfigFDS)
```

### New Files

1. **`src/features/configuracion-reuniones/pages/ConfiguracionReunionesIndex.tsx`**
   - Muestra 2 cards con ícono, título y descripción
   - Cada card es un `<Link>` a la sub-ruta correspondiente
   - Usa los componentes `Card` de shadcn/ui existentes

2. **`src/features/configuracion-reuniones/pages/ConfigES.tsx`**
   - Wrapper que carga publicadores y renderiza `SeccionConfigES`
   - Incluye botón "Volver" a la lista de cards

3. **`src/features/configuracion-reuniones/pages/ConfigFDS.tsx`**
   - Wrapper que carga publicadores y renderiza `SeccionConfigFDS`
   - Incluye botón "Volver" a la lista de cards

### Modified Files

4. **`src/app/router.tsx`**
   - Reemplaza la ruta única `admin/configuracion-reuniones` por rutas anidadas:
     - `admin/configuracion-reuniones` → `ConfiguracionReunionesIndex`
     - `admin/configuracion-reuniones/entre-semana` → `ConfigES`
     - `admin/configuracion-reuniones/fin-de-semana` → `ConfigFDS`

5. **`src/features/configuracion-reuniones/pages/ConfiguracionReuniones.tsx`**
   - Se elimina o reemplaza por `ConfiguracionReunionesIndex`

### Design Decisions

- **Cards en vez de tabs**: Las cards con navegación por ruta permiten deep-linking y son más claras para un menú de 2 opciones. Tabs serían más apropiadas si las secciones fueran 4+.
- **Reutilización total**: `SeccionConfigES` y `SeccionConfigFDS` no se modifican. Los wrappers solo manejan la carga de publicadores y el layout.
- **Sin layout anidado**: Cada sub-ruta es independiente (no usa `<Outlet>`). Es más simple dado que solo son 2 secciones.

### Rollback

Revertir los 3 archivos nuevos + los cambios en `router.tsx`. No hay cambios en DB ni APIs.
