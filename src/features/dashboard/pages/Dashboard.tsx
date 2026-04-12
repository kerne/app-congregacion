import { Users, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useDashboardStats } from '../hooks'
import { useMisAsignaciones } from '@/features/mis-asignaciones/hooks'
import { useProgramaSemana } from '@/features/programa/semana/hooks'
import { useProgramaFDS } from '@/features/programa/fds/hooks'
import { ProgramaSemanaView } from '@/features/programa/semana/components/ProgramaSemanaView'
import { ProgramaFDSView } from '@/features/programa/fds/components/ProgramaFDSView'
import {
  getLunesDeSemana,
  getProximoDomingo,
  toISODate,
  formatRangoSemana,
  formatDomingo,
  formatFechaCorta,
  parseFecha,
} from '@/shared/utils/fechas'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import type { AsignacionPersonal } from '@/core/supabase/types'

function getVistaSegunDia(): 'semana' | 'fds' {
  const dia = new Date().getDay()
  return dia === 0 || dia === 6 ? 'fds' : 'semana'
}

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

function ProgramaDelDia() {
  const vista    = getVistaSegunDia()
  const { isAdmin } = useCurrentUser()
  const semana   = toISODate(getLunesDeSemana(new Date()))
  const fechaFds = toISODate(getProximoDomingo(new Date()))

  const semanaQuery = useProgramaSemana(semana)
  const fdsQuery    = useProgramaFDS(fechaFds)

  const isLoading = vista === 'semana' ? semanaQuery.isLoading : fdsQuery.isLoading
  const titulo    = vista === 'semana' ? 'Reunión Entre Semana' : 'Reunión Fin de Semana'
  const subtitulo = vista === 'semana'
    ? formatRangoSemana(parseFecha(semana))
    : formatDomingo(parseFecha(fechaFds))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{titulo}</h2>
        {!isAdmin() && <Badge variant="secondary">Solo lectura</Badge>}
        <span className="text-sm text-muted-foreground capitalize ml-1">{subtitulo}</span>
      </div>

      {isLoading ? (
        <TableSkeleton rows={vista === 'semana' ? 8 : 5} cols={3} />
      ) : vista === 'semana' ? (
        <ProgramaSemanaView
          asignaciones={semanaQuery.data ?? []}
          canEdit={false}
          onEdit={() => {}}
          emptyMessage="El programa de esta semana no está disponible aún"
        />
      ) : (
        <ProgramaFDSView
          asignaciones={fdsQuery.data ?? []}
          canEdit={false}
          onEdit={() => {}}
          emptyMessage="El programa de este fin de semana no está disponible aún"
        />
      )}
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

      {/* Mis próximas asignaciones — solo para usuarios autenticados */}
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

      {/* Programa del día */}
      <ProgramaDelDia />
    </div>
  )
}
