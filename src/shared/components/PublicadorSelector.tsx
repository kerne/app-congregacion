import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { PublicadorPublico } from '@/core/supabase/types'

interface PublicadorSelectorProps {
  publicadores: PublicadorPublico[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PublicadorSelector({
  publicadores,
  value,
  onChange,
  placeholder = 'Seleccionar publicador...',
  disabled,
}: PublicadorSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {publicadores.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.nombre} {p.apellido}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
