## Context

El CSV no es parseable genéricamente — es un export de hoja de cálculo con filas de sección, celdas multi-línea, y nombres en formatos variados. Las asignaciones se hardcodean en el script directamente desde el análisis del CSV.

El problema principal es el **lookup de publicadores por nombre**: los nombres en el CSV tienen acentos y pueden diferir levemente del texto seedeado (ej: "Hernán" vs "Hernan", "Melissa" vs "Melisa"). La búsqueda se hace con `ilike` sobre `nombre` y `apellido`.

## Goals / Non-Goals

**Goals:**
- Insertar las 11 asignaciones de la semana 2026-03-02 en `asignaciones_semana`
- Lookup robusto de publicadores que tolere diferencias de acento
- Dry-run que muestre qué encontró (o no encontró) antes de insertar

**Non-Goals:**
- Parsear el CSV genéricamente (el formato no lo permite)
- Cargar semanas futuras (no están en el archivo)
- Insertar `lector_tesoros` (no está en el CSV)

## Decisions

- **Script TypeScript** (no SQL puro): más fácil para hacer lookups y manejar errores por nombre
- **ilike para búsqueda**: `ilike('%nombre%')` para tolerar diferencias de acento en la base de datos
- **Upsert por (semana, parte_id)**: idempotente, permite re-ejecutar sin duplicar

## Risks / Trade-offs

- Nombres ambiguos: "Pedro Jiménez" → hay dos Pedros en la base (JIMENEZ CACERES PEDRO y JIMENEZ SALAZAR PEDRO IGNACIO). El script reporta ambigüedad en dry-run y usa el primero que encuentre en producción — requiere verificación manual.
- "Melissa Gutierrez" en CSV vs "Melisa Gutierrez" en la base → el ilike sobre apellido + nombre debería resolverlo.
