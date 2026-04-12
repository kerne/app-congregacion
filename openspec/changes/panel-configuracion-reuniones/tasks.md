## 1. Base de Datos — Migración

- [x] 1.1 Crear `supabase/migrations/006_cargo_publicadores.sql` con `ALTER TABLE publicadores ADD COLUMN cargo TEXT CHECK (cargo IN ('anciano', 'siervo_ministerial', 'publicador', 'publicadora'))`
- [x] 1.2 Actualizar la política RLS de lectura pública para incluir el campo `cargo` en las columnas permitidas

## 2. Tipos TypeScript

- [x] 2.1 Agregar tipo `CargoCongregacion = 'anciano' | 'siervo_ministerial' | 'publicador' | 'publicadora'` en `src/core/supabase/types.ts`
- [x] 2.2 Agregar campo `cargo: CargoCongregacion | null` a la interfaz `Publicador`
- [x] 2.3 Agregar `cargo` a `PublicadorPublico` (Pick existente)

## 3. Config Estático — Cargos por Parte

- [x] 3.1 Agregar campo `cargosPermitidos: CargoCongregacion[]` a la interfaz `ParteSemana` en `src/core/config/programa-semana.ts`
- [x] 3.2 Definir `cargosPermitidos` en cada entrada de `PROGRAMA_SEMANA`:
  - `presidente`: `['anciano', 'siervo_ministerial']`
  - `lector_tesoros`: `['anciano', 'siervo_ministerial']`
  - `discurso_tesoros`: `['anciano', 'siervo_ministerial']`
  - `mejores_maestros`: `['anciano', 'siervo_ministerial']`
  - `busqueda_tesoros`: `['anciano', 'siervo_ministerial']`
  - `smt_parte1..4` (asignado): `['publicador', 'publicadora', 'siervo_ministerial', 'anciano']`
  - `nvc_parte1..2`: `['anciano', 'siervo_ministerial']`
  - `estudio_congregacion`: `['anciano']`
  - `cierre`: `['anciano', 'siervo_ministerial']`
- [x] 3.3 Agregar campo `cargosPermitidos: CargoCongregacion[]` a la interfaz `ParteFDS` en `src/core/config/programa-fds.ts`
- [x] 3.4 Definir `cargosPermitidos` en cada entrada de `PROGRAMA_FDS`:
  - `fds_presidente`: `['anciano', 'siervo_ministerial']`
  - `fds_orador`: `['anciano', 'siervo_ministerial']`
  - `fds_presidente_atalaya`: `['anciano', 'siervo_ministerial']`
  - `fds_lector_atalaya`: `['anciano', 'siervo_ministerial']`
  - `fds_oracion_final`: `['anciano', 'siervo_ministerial']`

## 4. API y Hooks de Publicadores

- [x] 4.1 Actualizar `COLS_PUBLICAS` en `src/features/publicadores/api.ts` para incluir `cargo`
- [x] 4.2 Agregar `cargo` a la interfaz `CreatePublicadorData` y `UpdatePublicadorData`

## 5. Componente PublicadorSelector

- [x] 5.1 Agregar prop opcional `cargosFiltro?: CargoCongregacion[]` a `PublicadorSelectorProps` en `src/shared/components/PublicadorSelector.tsx`
- [x] 5.2 Aplicar filtro en el `useMemo` interno: si `cargosFiltro` tiene valores, filtrar `publicadores` por cargo antes de mapear a items

## 6. ModalAsignacion — Filtrado por cargo

- [x] 6.1 Agregar prop opcional `cargosAsistente?: CargoCongregacion[]` a `ModalAsignacionProps` en `src/shared/components/ModalAsignacion.tsx`
- [x] 6.2 Pasar `cargosPermitidos` de la parte al `PublicadorSelector` del campo "Asignado"
- [x] 6.3 Pasar `cargosAsistente` (vacío/undefined = sin filtro) al `PublicadorSelector` del campo "Asistente"

## 7. Formulario de Publicadores — Campo Cargo

- [x] 7.1 Agregar `cargo` al schema Zod en `src/features/publicadores/pages/Publicadores.tsx` como campo optional
- [x] 7.2 Agregar `Controller` para el campo "Cargo en la congregación" con un `Select` de 5 opciones (las 4 + vacío)
- [x] 7.3 Asegurar que el label diga "Cargo en la congregación" para distinguirlo del campo "Rol en la app"
- [x] 7.4 Mostrar el cargo en la tabla de publicadores junto al badge de rol

## 8. Feature — Configuración de Reuniones

- [x] 8.1 Crear `src/features/configuracion-reuniones/` con estructura: `pages/`, `components/`
- [x] 8.2 Crear `src/features/configuracion-reuniones/pages/ConfiguracionReuniones.tsx` — página principal con tabs o secciones para "Entre Semana" y "Fin de Semana"
- [x] 8.3 Crear componente `SeccionConfigES.tsx` que renderiza el programa entre semana con `ParteRow` o similar, con navegación de semana (`NavSemana` existente)
- [x] 8.4 Crear componente `SeccionConfigFDS.tsx` que renderiza el programa fin de semana con navegación de fecha
- [x] 8.5 Conectar el `ModalAsignacion` en la página de configuración con las listas de publicadores filtradas por `cargosPermitidos`
- [x] 8.6 Reutilizar hooks `useProgramaSemana` y `useProgramaFDS` existentes para cargar asignaciones
- [x] 8.7 Reutilizar mutation hooks de `semana/hooks` y `fds/hooks` para guardar y eliminar asignaciones

## 9. Router y AdminPanel

- [x] 9.1 Agregar ruta `/admin/configuracion-reuniones` en `src/app/router.tsx` con `RequireRole roles={['admin']}`
- [x] 9.2 Agregar card "Configuración de reuniones" en `CARDS` de `src/features/admin/pages/AdminPanel.tsx`
