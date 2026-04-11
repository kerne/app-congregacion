import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from './ui/button'

interface NavSemanaProps {
  label: string
  onPrev: () => void
  onNext: () => void
  onHoy: () => void
  labelHoy?: string
}

export function NavSemana({ label, onPrev, onNext, onHoy, labelHoy = 'Esta semana' }: NavSemanaProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="icon" onClick={onPrev} aria-label="Anterior">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="min-w-[160px] text-center text-sm font-medium capitalize">
        {label}
      </span>

      <Button variant="outline" size="icon" onClick={onNext} aria-label="Siguiente">
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" onClick={onHoy} className="gap-1">
        <Calendar className="h-4 w-4" />
        {labelHoy}
      </Button>
    </div>
  )
}
