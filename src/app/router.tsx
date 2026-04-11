import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { RequireRole } from '@/features/auth/RequireRole'
import { Login } from '@/features/auth/pages/Login'
import { AuthCallback } from '@/features/auth/pages/AuthCallback'
import { Dashboard } from '@/features/dashboard/pages/Dashboard'
import { EntreSemana } from '@/features/programa/semana/pages/EntreSemana'
import { FinDeSemana } from '@/features/programa/fds/pages/FinDeSemana'
import { MisAsignaciones } from '@/features/mis-asignaciones/pages/MisAsignaciones'
import { Publicadores } from '@/features/publicadores/pages/Publicadores'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
        <p className="mt-2 text-muted-foreground">Página no encontrada</p>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="entre-semana" element={<EntreSemana />} />
        <Route path="fin-de-semana" element={<FinDeSemana />} />
        <Route
          path="mis-asignaciones"
          element={
            <RequireAuth>
              <MisAsignaciones />
            </RequireAuth>
          }
        />
        <Route
          path="admin/publicadores"
          element={
            <RequireRole roles={['admin']}>
              <Publicadores />
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
