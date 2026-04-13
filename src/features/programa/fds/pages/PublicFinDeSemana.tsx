import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { NavSemana } from '@/shared/components/NavSemana'
import { TableSkeleton } from '@/shared/components/TableSkeleton'
import { ProgramaFDSView } from '../components/ProgramaFDSView'
import { useQuery } from '@tanstack/react-query'
import { getAsignacionesFDS } from '../api'
import {
  getProximoDomingo,
  siguienteDomingo,
  domingoAnterior,
  toISODate,
  formatDomingo,
  parseFecha,
} from '@/shared/utils/fechas'

export function PublicFinDeSemana() {
  const { congregacionId } = useOutletContext<{ congregacionId: string }>()
  const [fecha, setFecha] = useState(() => toISODate(getProximoDomingo(new Date())))

  const { data: asignaciones = [], isLoading } = useQuery({
    queryKey: ['public', 'asignaciones-fds', congregacionId, fecha],
    queryFn: () => getAsignacionesFDS(congregacionId, fecha),
    enabled: !!congregacionId,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reunión Fin de Semana</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {formatDomingo(parseFecha(fecha))}
          </p>
        </div>
        <NavSemana
          label={formatDomingo(parseFecha(fecha))}
          onPrev={() => setFecha(toISODate(domingoAnterior(parseFecha(fecha))))}
          onNext={() => setFecha(toISODate(siguienteDomingo(parseFecha(fecha))))}
          onHoy={() => setFecha(toISODate(getProximoDomingo(new Date())))}
          labelHoy="Este domingo"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : (
        <ProgramaFDSView
          asignaciones={asignaciones}
          canEdit={false}
          onEdit={() => {}}
          emptyMessage="El programa de este fin de semana no está disponible aún"
        />
      )}
    </div>
  )
}
