import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { RequireRole } from '@/features/auth/RequireRole'
import { RequireCongregacion } from '@/features/congregacion/RequireCongregacion'
import { Login } from '@/features/auth/pages/Login'
import { AuthCallback } from '@/features/auth/pages/AuthCallback'
import { Onboarding } from '@/features/congregacion/pages/Onboarding'
import { CrearCongregacion } from '@/features/congregacion/pages/CrearCongregacion'
import { Dashboard } from '@/features/dashboard/pages/Dashboard'
import { AdminPanel } from '@/features/admin/pages/AdminPanel'
import { EntreSemana } from '@/features/programa/semana/pages/EntreSemana'
import { FinDeSemana } from '@/features/programa/fds/pages/FinDeSemana'
import { MisAsignaciones } from '@/features/mis-asignaciones/pages/MisAsignaciones'
import { PublicadoresSkeleton } from '@/features/publicadores/components/PublicadoresSkeleton'

const Publicadores = lazy(() =>
  import('@/features/publicadores/pages/Publicadores').then((m) => ({ default: m.Publicadores }))
)

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
      <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
      <Route path="/onboarding/crear" element={<RequireAuth><CrearCongregacion /></RequireAuth>} />

      <Route element={<RequireCongregacion><AppLayout /></RequireCongregacion>}>
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
          path="admin"
          element={
            <RequireRole roles={['admin']}>
              <AdminPanel />
            </RequireRole>
          }
        />
        <Route
          path="admin/publicadores"
          element={
            <RequireRole roles={['admin']}>
              <Suspense fallback={<div className="space-y-6"><div className="h-10" /><PublicadoresSkeleton /></div>}>
                <Publicadores />
              </Suspense>
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
