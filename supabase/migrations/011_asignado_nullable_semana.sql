-- Permite asignaciones sin publicador asignado (pendientes de asignación)
ALTER TABLE asignaciones_semana
  ALTER COLUMN asignado_id DROP NOT NULL;
