## 1. Publicadores dummy

- [x] 1.1 Crear bloque DELETE que borra asignaciones y publicadores con email `@seed.test` en orden correcto (asignaciones primero, publicadores después)
- [x] 1.2 Insertar 15 publicadores con emails `@seed.test`: 1 admin, 2 editores, 12 publicadores; incluir nombre, apellido, teléfono y `activo = true`

## 2. Asignaciones entre semana (4 semanas)

- [x] 2.1 Insertar asignaciones para la semana del 2026-04-13: todas las partes no-opcionales de `programa-semana.ts` con `asignado_id` válido
- [x] 2.2 Insertar asignaciones para la semana del 2026-04-20
- [x] 2.3 Insertar asignaciones para la semana del 2026-04-27
- [x] 2.4 Insertar asignaciones para la semana del 2026-05-04
- [x] 2.5 Asegurar que `smt_parte1` y `smt_parte2` tienen `asistente_id` asignado en las 4 semanas
- [x] 2.6 Asegurar que todas las partes con `tieneTema: true` tienen campo `tema` no vacío
- [x] 2.7 Asegurar que partes SMT tienen `sala` asignada (`principal` o `B`)

## 3. Asignaciones fin de semana (4 domingos)

- [x] 3.1 Insertar asignaciones para el 2026-04-12: las 5 partes de `programa-fds.ts`
- [x] 3.2 Insertar asignaciones para el 2026-04-19
- [x] 3.3 Insertar asignaciones para el 2026-04-26
- [x] 3.4 Insertar asignaciones para el 2026-05-03
- [x] 3.5 Asegurar que `fds_orador` tiene `tema` no vacío en las 4 fechas

## 4. Validación del script

- [ ] 4.1 Verificar que el script se ejecuta sin errores en una base limpia (Supabase SQL Editor)
- [ ] 4.2 Verificar que una segunda ejecución no genera errores de UNIQUE constraint
- [ ] 4.3 Verificar que los datos son visibles en las vistas de la app (EntreSemana, FinDeSemana, Admin)
