## Context

Hoy los visitantes anónimos pasan el guard `RequireCongregacion` (línea 12: `if (!user) return children`) pero los hooks de programa tienen `enabled: !!congregacionId`, y `congregacionId` es `undefined` sin sesión. Además, las RLS policies solo permiten SELECT a miembros activos vía `get_user_congregacion_ids()`.

Se necesita un mecanismo para que un anónimo acceda al programa de una congregación específica usando un slug amigable en la URL.

## Goals / Non-Goals

**Goals:**
- Visitante puede ver el programa de reuniones (solo lectura) accediendo a `/c/:slug/entre-semana` o `/c/:slug/fin-de-semana`
- Admin puede copiar el link público de su congregación
- Slug generado automáticamente al crear congregación, editable por admin
- RLS permite SELECT anon scoped a una congregación específica

**Non-Goals:**
- Buscador público de congregaciones (el acceso es solo por link directo)
- Edición desde rutas públicas (siempre `canEdit={false}`)
- SEO / SSR (es una SPA, no aplica)
- Acceso público a datos de publicadores más allá de nombre y apellido

## Decisions

### 1. Slug en tabla congregaciones

**Decisión**: Agregar campo `slug TEXT UNIQUE` a `congregaciones`. Generar como kebab-case del nombre al crear.

**Alternativa descartada**: Usar `numero` como identificador público — no es único garantizado y puede no existir.

**Migración**: Para congregaciones existentes, generar slug desde `nombre` con fallback a UUID corto si hay colisión.

### 2. Resolución slug → congregacionId en frontend

**Decisión**: Un hook `usePublicCongregacion(slug)` que hace un SELECT a `congregaciones` filtrando por slug. Retorna `congregacionId` y `nombre`. Usa React Query con cache largo (la relación slug→id es estable).

**Alternativa descartada**: Función RPC en Supabase — innecesario para un simple SELECT por slug.

### 3. Rutas públicas separadas del layout principal

**Decisión**: Rutas bajo `/c/:slug/*` con un layout mínimo (header con nombre de congregación, sin sidebar). No reutilizan `AppLayout` para evitar que el sidebar muestre opciones que no aplican a anónimos.

```
/c/:slug                    → redirect a /c/:slug/entre-semana
/c/:slug/entre-semana       → ProgramaSemanaView (read-only)
/c/:slug/fin-de-semana      → ProgramaFDSView (read-only)
```

**Alternativa descartada**: Reusar las rutas existentes con `?slug=x` — mezcla lógica pública/privada en los mismos componentes.

### 4. RLS policies para anon

**Decisión**: Crear policies `FOR SELECT` con `TO anon` en:

| Tabla | Policy | Columnas expuestas |
|-------|--------|--------------------|
| `congregaciones` | `cong_select_anon_slug` | id, nombre, slug (filtrado por slug) |
| `publicadores` | `pub_select_anon` | id, nombre, apellido (filtrado por congregacion_id + activo) |
| `asignaciones_semana` | `asig_sem_select_anon` | todas (filtrado por congregacion_id) |
| `asignaciones_fds` | `asig_fds_select_anon` | todas (filtrado por congregacion_id) |

Las policies anon usan `USING (true)` scoped por congregacion_id (el filtro va en el query, no en la policy). Esto es seguro porque:
- No hay buscador de congregaciones (necesitás el slug para llegar)
- Solo se exponen datos del programa (nombres y asignaciones, no emails/teléfonos)

**Nota sobre publicadores**: la policy anon solo permite ver publicadores activos. Los campos `email`, `telefono`, `cargo` NO se exponen — las queries públicas solo seleccionan `id, nombre, apellido`.

### 5. Generación de slug

**Decisión**: Generar en el frontend al crear congregación (función `slugify`). Validar unicidad con un SELECT antes de insertar.

Reglas de slugify:
- Lowercase, espacios → `-`, eliminar acentos y caracteres especiales
- Ejemplo: "Congregación Norte Quilmes" → `congregacion-norte-quilmes`

### 6. Link público en AdminPanel

**Decisión**: Agregar card o sección en AdminPanel que muestre el link público y un botón "Copiar". El link se construye como `${window.location.origin}/c/${congregacion.slug}/entre-semana`.

## Risks / Trade-offs

- **[Slug collision]** → Validar unicidad antes de insertar. Si colisiona, appendear sufijo numérico (`-2`, `-3`).
- **[Datos expuestos a anon]** → Solo nombre+apellido de publicadores y datos del programa. No emails, no teléfonos, no datos administrativos. Aceptable para un programa que se imprime y reparte físicamente.
- **[Crawling/scraping]** → Sin buscador público, el slug funciona como token de baja entropía. Aceptable para el contexto (no es data sensible). Si se necesita más seguridad, se puede agregar un flag `publico` a la congregación.
- **[Slug rename]** → Si el admin renombra la congregación, el slug viejo deja de funcionar. Non-goal por ahora — el admin puede editar el slug manualmente.
