## 1. AdminPanel — Command Center con stats

- [x] 1.1 En `AdminPanel.tsx`, importar `useProgramaSemana` y calcular `semanaActual` con `getLunesDeSemana(new Date())`
- [x] 1.2 Importar `useProgramaFDS` y calcular `proximoDomingo` con `getProximoDomingo(new Date())`
- [x] 1.3 Calcular `pendientesES` como partes de `PARTES_SEMANA` sin match en las asignaciones retornadas
- [x] 1.4 Calcular `pendientesFDS` como partes de `PARTES_FDS` sin match en las asignaciones del domingo
- [x] 1.5 Agregar sección de stats antes de las cards: dos chips/badges mostrando "X pendientes esta semana" y "X pendientes este domingo"
- [x] 1.6 Mostrar skeleton o `—` mientras los datos están cargando (no bloquear el render de las cards)

## 2. Badge "Solo lectura" en páginas de programa

- [x] 2.1 En `EntreSemana.tsx`, agregar `<Badge variant="secondary">Solo lectura</Badge>` en el header cuando `!isAdmin()`
- [x] 2.2 En `FinDeSemana.tsx`, agregar el mismo badge en el header cuando `!isAdmin()`
- [x] 2.3 Verificar que el badge no aparece cuando el usuario es admin

## 3. Empty states diferenciados por rol

- [x] 3.1 En `ProgramaSemanaView.tsx`, agregar prop `emptyMessage?: string` y renderizarlo cuando `asignaciones.length === 0` en lugar de tabla vacía
- [x] 3.2 En `ProgramaFDSView.tsx`, agregar la misma prop `emptyMessage?: string`
- [x] 3.3 En `EntreSemana.tsx`, pasar `emptyMessage` calculado: `isAdmin() ? "No hay asignaciones — empezá asignando partes" : "El programa de esta semana no está disponible aún"`
- [x] 3.4 En `FinDeSemana.tsx`, pasar el mismo `emptyMessage` calculado

## 4. Verificación end-to-end

- [x] 4.1 Verificar AdminPanel como admin: stats muestran conteo correcto (o 0 si no hay datos), cards siguen funcionando
- [x] 4.2 Verificar badge "Solo lectura" aparece en Entre Semana y Fin de Semana como visitante
- [x] 4.3 Verificar badge NO aparece como admin
- [x] 4.4 Verificar empty state correcto para visitante (semana sin datos)
- [x] 4.5 Verificar empty state correcto para admin (semana sin datos)
