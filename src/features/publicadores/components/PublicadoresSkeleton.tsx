import { Skeleton } from '@/shared/components/ui/skeleton'

export function PublicadoresSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted/50 px-3 py-3 grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-3 border-b">
        {['Nombre', 'Email', 'Rol', 'Estado', ''].map((_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-3 py-3 grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-3 border-b last:border-0 items-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex justify-end gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
