## Tasks: config-reuniones-navigation

### Phase 1: New Pages

- [x] Create `ConfiguracionReunionesIndex.tsx` with 2 navigation cards (Entre Semana, Fin de Semana)
- [x] Create `ConfigES.tsx` wrapper page (loads publicadores, renders SeccionConfigES, back button)
- [x] Create `ConfigFDS.tsx` wrapper page (loads publicadores, renders SeccionConfigFDS, back button)

### Phase 2: Router & Cleanup

- [x] Update `router.tsx`: replace single route with 3 sub-routes under `admin/configuracion-reuniones`
- [x] Remove old `ConfiguracionReuniones.tsx` (replaced by Index + sub-pages)
- [x] Update Sidebar link if needed (already points to `/admin/configuracion-reuniones` — no change needed)
