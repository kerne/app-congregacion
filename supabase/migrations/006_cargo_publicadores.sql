-- ============================================================
-- Cargo de congregación en publicadores
-- ============================================================
-- Agrega el campo `cargo` para modelar el rol que el publicador
-- ocupa en la congregación (distinto al rol de acceso a la app).
-- Es nullable para compatibilidad con registros existentes.

ALTER TABLE publicadores
  ADD COLUMN cargo TEXT
  CHECK (cargo IN ('anciano', 'siervo_ministerial', 'publicador', 'publicadora'));

-- Actualizar la vista pública para exponer cargo
CREATE OR REPLACE VIEW publicadores_pub AS
  SELECT id, nombre, apellido, activo, rol, cargo, creado_en
  FROM publicadores
  WHERE activo = true;
