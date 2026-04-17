-- Permite registrar oradores invitados (de otras congregaciones) en el Discurso Público.
-- asignado_id pasa a nullable; orador_nombre almacena el nombre en texto libre.
-- Constraint: al menos uno de los dos debe estar presente.

ALTER TABLE asignaciones_fds
  ALTER COLUMN asignado_id DROP NOT NULL;

ALTER TABLE asignaciones_fds
  ADD COLUMN orador_nombre TEXT NULL;

ALTER TABLE asignaciones_fds
  ADD CONSTRAINT check_orador_presente
    CHECK (asignado_id IS NOT NULL OR orador_nombre IS NOT NULL);
