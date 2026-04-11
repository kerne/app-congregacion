## Context

Las funciones de API de Supabase retornan `{ data: null | T[], error }`. Cuando no hay filas el `data` es `null`, no `[]`. El código actual castea `null` a array con TypeScript (`as AsignacionSemana[]`), lo que silencia el problema en tiempo de compilación pero causa fallos en runtime. Sumado a eso, la UI no tiene rama de error y las mutaciones capturan la fecha en un closure que puede ser stale.

## Goals / Non-Goals

**Goals:**
- La API nunca retorna `null` — siempre retorna `[]` cuando no hay datos
- La UI muestra un estado de error visible y accionable cuando la query falla
- Las mutaciones invalidan siempre el cache de la semana/fecha correcta
- Eliminación de la condición `enabled: !!semana` innecesaria

**Non-Goals:**
- Rediseño de la capa de datos o cambio de librería
- Retry automático de queries (el comportamiento actual de React Query con `retry: 1` es suficiente)
- Cambios al schema de Supabase
- Paginación o streaming de datos

## Decisions

### D1: `data ?? []` en la API — dónde poner el fix

**Decisión**: Corregir en la función API, no en los hooks ni en la UI.

**Alternativas consideradas**:
- Corregir en el hook (`return { ...query, data: query.data ?? [] }`): Oculta el bug real en la capa incorrecta
- Corregir en el componente: Mismo problema, más disperso

**Rationale**: La función API promete `Promise<AsignacionSemana[]>`. Que retorne `null` es una violación de su propio contrato. El fix va donde está la mentira.

```typescript
// Antes
return data as AsignacionSemana[]  // null cast silencioso

// Después
return (data ?? []) as AsignacionSemana[]
```

### D2: Error state en UI — qué mostrar

**Decisión**: Mostrar un componente `EmptyState` con ícono de error, mensaje descriptivo y botón "Reintentar" que llama a `refetch()`.

**Alternativas consideradas**:
- Toast de error: No es suficiente — el usuario no sabe si la tabla está vacía o falló
- Texto inline: Menos visible y accesible que EmptyState

**Rationale**: Consistente con el pattern de EmptyState ya usado en el proyecto. El botón de reintentar da agencia al usuario sin recargar la página.

```tsx
// Patrón
{isLoading ? <TableSkeleton /> : isError ? <ErrorState onRetry={refetch} /> : <ProgramaView />}
```

### D3: Mutaciones — parámetro en `mutationFn` en lugar de closure del hook

**Decisión**: La semana/fecha se pasa como parte de los datos de la mutación, no se captura en el closure del hook.

**El problema con el patrón actual**:
```typescript
// Actual — semana capturada en closure, puede ser stale
export function useUpsertAsignacionSemana(semana: string) {
  return useMutation({
    mutationFn: (data) => upsertAsignacionSemana(semana, data), // semana fija
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) }) // semana fija
  })
}
```

**El fix**:
```typescript
// La semana viaja con los datos de la mutación
export function useUpsertAsignacionSemana() {
  return useMutation({
    mutationFn: ({ semana, ...data }) => upsertAsignacionSemana(semana, data),
    onSuccess: (_, { semana }) => qc.invalidateQueries({ queryKey: queryKeys.asignacionesSemana.semana(semana) })
  })
}
```

Esto garantiza que `onSuccess` siempre invalida el cache de la semana que se mutó, no la que estaba en el closure cuando se creó el hook.

**Impacto en los componentes**: Los call sites pasan `semana` en el payload:
```typescript
// Antes
upsert.mutateAsync({ parteId, data, asignacionId })

// Después
upsert.mutateAsync({ semana, parteId, data, asignacionId })
```

### D4: Remover `enabled: !!semana`

**Decisión**: Eliminar la condición.

**Rationale**: `semana` se inicializa con `toISODate(getLunesDeSemana(new Date()))` — nunca es falsy en el primer render ni en navegaciones posteriores. La condición nunca fue necesaria y puede causar que queries se deshabiliten en condiciones de race en el ciclo de vida del componente.

## Risks / Trade-offs

- **[Riesgo] Cambiar la firma de los hooks rompe call sites** → Impacto acotado: solo `EntreSemana.tsx` y `FinDeSemana.tsx` usan estos hooks. Ambos se actualizan en el mismo PR.
- **[Trade-off] `data ?? []` enmascara si hay un bug real en RLS** → Aceptable: el estado de error en UI ya muestra si hay un error de Supabase. El `?? []` solo aplica cuando la query tiene éxito pero no hay filas.

## Migration Plan

1. Fix API: `data ?? []` en `getAsignacionesSemana` y `getAsignacionesFDS`
2. Fix hooks: Remover `semana`/`fecha` del hook, pasarlos en el payload de mutación; remover `enabled`
3. Fix páginas: Actualizar call sites de mutaciones; agregar rama `isError` con EmptyState + refetch
4. Verificar manualmente navegación entre semanas y guardado de asignaciones

Sin rollback especial. Todos los cambios son en frontend, deployable como hotfix.

## Open Questions

*(ninguna — root cause confirmada por investigación del código)*
