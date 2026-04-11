import { Users, CheckCircle, Clock, ArrowRight, BookOpen, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useDashboardStats } from '../hooks'
import { useMisAsignaciones } from '@/features/mis-asignaciones/hooks'
import { formatFechaCorta, parseFecha } from '@/shared/utils/fechas'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import type { AsignacionPersonal } from '@/core/supabase/types'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className="rounded-lg border bg-card p-5 flex items-center gap-4">
      <div className={`rounded-full p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function ProximaAsignacionItem({ a }: { a: AsignacionPersonal }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0">
      <div>
        <p className="text-sm font-medium">{a.parte_nombre}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {a.tipo === 'semana' ? 'Entre semana' : 'Fin de semana'}
          {a.rol === 'asistente' && ' · Asistente'}
        </p>
      </div>
      <span className="text-sm text-muted-foreground shrink-0 ml-2">
        {formatFechaCorta(parseFecha(a.fecha))}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { user, publicador, isPublicador } = useCurrentUser()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: proximas = [] } = useMisAsignaciones(publicador?.id)

  const proximasTres = proximas.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {user ? `Hola, ${publicador?.nombre ?? user.email?.split('@')[0]}` : 'Programa de Reuniones'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de la congregación
        </p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Publicadores activos"
            value={stats?.publicadoresActivos ?? 0}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={CheckCircle}
            label="Asignaciones esta semana"
            value={stats?.asignacionesEstaSemana ?? 0}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={Clock}
            label="Partes pendientes"
            value={stats?.partesPendientesEstaSemana ?? 0}
            color="bg-amber-100 text-amber-700"
          />
        </div>
      )}

      {/* Mis próximas asignaciones */}
      {isPublicador() && publicador && (
        <div className="rounded-lg border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Tus próximas asignaciones</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/mis-asignaciones">
                Ver todas
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          {proximasTres.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tenés asignaciones próximas</p>
          ) : (
            <div>
              {proximasTres.map((a) => (
                <ProximaAsignacionItem key={`${a.tipo}-${a.id}`} a={a} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" asChild className="h-auto py-4 flex-col items-center gap-1.5">
            <Link to="/entre-semana">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">Entre semana</span>
              <span className="text-xs text-muted-foreground">Ver programa</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex-col items-center gap-1.5">
            <Link to="/fin-de-semana">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">Fin de semana</span>
              <span className="text-xs text-muted-foreground">Ver programa</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
