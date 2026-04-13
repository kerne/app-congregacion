-- ============================================================
-- Public Slug: acceso público al programa vía slug amigable
-- ============================================================
-- Agrega campo slug a congregaciones y policies anon para
-- permitir lectura pública del programa sin autenticación.
-- ============================================================

-- ─── 1. Campo slug en congregaciones ────────────────────────

ALTER TABLE congregaciones
  ADD COLUMN slug TEXT UNIQUE;

-- Generar slugs para congregaciones existentes
DO $$
DECLARE
  r RECORD;
  v_slug TEXT;
  v_base TEXT;
  v_suffix INT;
BEGIN
  FOR r IN SELECT id, nombre FROM congregaciones WHERE slug IS NULL LOOP
    -- Generar slug base: lowercase, sin acentos, espacios → guiones
    v_base := lower(r.nombre);
    v_base := translate(v_base,
      'áéíóúüñàèìòùâêîôûäëïöü',
      'aeiouunaeioua eiouaeiou');
    v_base := regexp_replace(v_base, '[^a-z0-9\s-]', '', 'g');
    v_base := regexp_replace(trim(v_base), '\s+', '-', 'g');
    v_base := regexp_replace(v_base, '-+', '-', 'g');

    v_slug := v_base;
    v_suffix := 2;

    -- Handle collisions
    WHILE EXISTS (SELECT 1 FROM congregaciones WHERE slug = v_slug) LOOP
      v_slug := v_base || '-' || v_suffix;
      v_suffix := v_suffix + 1;
    END LOOP;

    UPDATE congregaciones SET slug = v_slug WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE congregaciones
  ALTER COLUMN slug SET NOT NULL;

CREATE INDEX idx_congregaciones_slug ON congregaciones(slug);

-- ─── 2. Anon RLS policies ──────────────────────────────────

-- Congregaciones: anon puede ver por slug (id, nombre, slug)
CREATE POLICY "cong_select_anon"
  ON congregaciones FOR SELECT
  TO anon
  USING (true);

-- Publicadores: anon puede ver activos (id, nombre, apellido)
CREATE POLICY "pub_select_anon"
  ON publicadores FOR SELECT
  TO anon
  USING (activo = true);

-- Asignaciones semana: anon puede leer por congregacion_id
CREATE POLICY "asig_sem_select_anon"
  ON asignaciones_semana FOR SELECT
  TO anon
  USING (true);

-- Asignaciones fds: anon puede leer por congregacion_id
CREATE POLICY "asig_fds_select_anon"
  ON asignaciones_fds FOR SELECT
  TO anon
  USING (true);
