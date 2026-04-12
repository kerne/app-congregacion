## Context

Actualmente el dashboard (`/`) requiere autenticación para mostrarse. Los visitantes anónimos son redirigidos a login. La SPEC-01.1 ya define que un visitante DEBE poder ver el programa sin autenticación, pero esa intención no está completamente implementada en la ruta raíz. Este cambio completa esa brecha y agrega lógica de selección automática de vista según el día de la semana.

Estado actual:
- El router tiene guards de auth que bloquean rutas no autenticadas
- Las tablas `asignaciones_semana` y `asignaciones_fds` probablemente no tienen RLS de lectura pública habilitada
- El componente dashboard puede depender de `useAuth()` de forma bloqueante

## Goals / Non-Goals

**Goals:**
- El dashboard raíz `/` es accesible sin autenticación
- La vista mostrada se determina por el día actual: lunes-viernes → entre semana; sábado-domingo → fin de semana
- Las rutas de edición (`/entre-semana`, `/fin-de-semana`, `/admin/*`) siguen protegidas
- Las RLS de Supabase permiten `SELECT` anónimo en las tablas de asignaciones (sin exponer emails ni teléfonos)

**Non-Goals:**
- Eliminar el sistema de autenticación
- Hacer públicas las rutas de edición
- Cambiar el modelo de roles (admin / visitante)
- Personalización de qué día se considera "entre semana" — se usa la detección por `new Date().getDay()`

## Decisions

### Decisión 1: Detección de día en el cliente (no en servidor)
**Opción elegida**: `new Date().getDay()` en el componente del dashboard.
**Alternativa descartada**: URL param o cookie para forzar vista.
**Rationale**: Simple, sin estado, sin dependencia de backend. El caso de uso es visualización — no necesita override.

### Decisión 2: Ajuste del guard de auth solo en ruta raíz
**Opción elegida**: El `PrivateRoute` o auth guard se elimina exclusivamente para `/`. Las otras rutas no cambian.
**Alternativa descartada**: Wrapper de "modo anónimo" global.
**Rationale**: Mínimo impacto, cambio quirúrgico. No hay riesgo de exponer accidentalmente rutas protegidas.

### Decisión 3: RLS pública con `anon` role en Supabase
**Opción elegida**: Agregar política `SELECT` para el rol `anon` en `asignaciones_semana`, `asignaciones_fds` y `publicadores` (campos no sensibles: nombre, apellido, rol — excluir email, teléfono).
**Alternativa descartada**: Edge Function o proxy que filtre campos.
**Rationale**: Supabase RLS es el mecanismo correcto. La SPEC-08.1 ya requiere que el email no se devuelva en queries anónimas. Este cambio implementa esa spec correctamente.

### Decisión 4: Dashboard como componente agnóstico de auth
El componente `Dashboard` (o la vista de programa que muestra la ruta `/`) NO debe llamar a `supabase.auth.getUser()` de forma bloqueante. Puede leer el estado del context de auth para mostrar/ocultar el botón de login, pero no puede depender de él para renderizar el programa.

## Risks / Trade-offs

- **[Riesgo] RLS mal configurada expone datos sensibles** → Mitigation: Verificar que las columnas `email`, `telefono` de `publicadores` no estén incluidas en la política pública. Usar `SELECT (columnas específicas)` en la política RLS, nunca `SELECT *`.
- **[Riesgo] El componente dashboard llama hooks de auth de forma que rompe sin sesión** → Mitigation: Auditar el componente antes de implementar. Reemplazar `useRequireAuth()` por `useOptionalAuth()` si existe, o refactorizar para que el contexto de auth sea nullable.
- **[Trade-off] Sin autenticación, el dashboard no puede mostrar "Mis próximas asignaciones"** → Aceptado: el panel de asignaciones personales solo se muestra cuando hay sesión activa.

## Migration Plan

1. Actualizar políticas RLS en Supabase (migration SQL)
2. Ajustar el router para excluir `/` del guard de auth
3. Refactorizar el componente de dashboard para que no bloquee sin sesión
4. Agregar lógica de selección de vista por día de semana
5. Verificar que rutas admin siguen protegidas (test manual)

**Rollback**: Revertir el commit del router es suficiente para volver al estado anterior. La migración RLS es aditiva — no rompe nada si se revierte quitando las políticas.

## Open Questions

- ¿El componente raíz es un `Dashboard` separado o directamente renderiza `ProgramaEntreSemana` / `ProgramaFinDeSemana`? Determina el alcance del refactor.
- ¿Existe ya una política RLS para `anon` en alguna tabla? Verificar antes de crear políticas duplicadas.
