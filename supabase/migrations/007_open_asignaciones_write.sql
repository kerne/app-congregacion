-- ============================================================
-- Abrir escritura en asignaciones sin requerir auth
-- ============================================================
-- TEMPORAL: mientras no exista autenticación, permitir
-- insert/update/delete sin restricción de rol.
-- Cuando se implemente auth, revertir a las policies
-- originales de 002_rls_policies.sql.
-- ============================================================

-- ─── asignaciones_semana ────────────────────────────────────

DROP POLICY "asig_sem_insert_editor" ON asignaciones_semana;
DROP POLICY "asig_sem_update_editor" ON asignaciones_semana;
DROP POLICY "asig_sem_delete_editor" ON asignaciones_semana;

CREATE POLICY "asig_sem_insert_open"
  ON asignaciones_semana FOR INSERT
  WITH CHECK (true);

CREATE POLICY "asig_sem_update_open"
  ON asignaciones_semana FOR UPDATE
  USING (true);

CREATE POLICY "asig_sem_delete_open"
  ON asignaciones_semana FOR DELETE
  USING (true);

-- ─── asignaciones_fds ───────────────────────────────────────

DROP POLICY "asig_fds_insert_editor" ON asignaciones_fds;
DROP POLICY "asig_fds_update_editor" ON asignaciones_fds;
DROP POLICY "asig_fds_delete_editor" ON asignaciones_fds;

CREATE POLICY "asig_fds_insert_open"
  ON asignaciones_fds FOR INSERT
  WITH CHECK (true);

CREATE POLICY "asig_fds_update_open"
  ON asignaciones_fds FOR UPDATE
  USING (true);

CREATE POLICY "asig_fds_delete_open"
  ON asignaciones_fds FOR DELETE
  USING (true);
