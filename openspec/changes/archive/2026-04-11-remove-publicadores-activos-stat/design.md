## Context

El `Dashboard` tiene 3 `StatCard`: publicadores activos, asignaciones esta semana, partes pendientes. El primero es irrelevante para el caso de uso público. El cambio es de UI pura — no afecta RLS ni auth.

## Goals / Non-Goals

**Goals:**
- Eliminar el StatCard "Publicadores activos" del Dashboard
- Limpiar el código muerto asociado (query, tipo)

**Non-Goals:**
- Cambiar los otros dos stats
- Modificar la lógica de auth o RLS

## Decisions

Eliminar la query de publicadores en `getDashboardStats` ya que solo se usa para este stat. Limpiar el campo `publicadoresActivos` del tipo `DashboardStats` para no dejar código muerto.

## Risks / Trade-offs

Ninguno — cambio puramente aditivo en reversa (remoción de UI sin impacto en datos ni auth).
