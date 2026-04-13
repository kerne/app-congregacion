import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Star,
  BookOpen,
  Users,
  Settings,
  LayoutGrid,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useCongregacion } from '@/features/congregacion/useCongregacion'

interface SidebarProps {
  onNavigate?: () => void
}

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  requiresAuth?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',                              label: 'Dashboard',           icon: LayoutDashboard },
  { to: '/entre-semana',                  label: 'Entre semana',        icon: Calendar        },
  { to: '/fin-de-semana',                 label: 'Fin de semana',       icon: Star            },
  { to: '/mis-asignaciones',              label: 'Mis asignaciones',    icon: BookOpen, requiresAuth: true },
]

const ADMIN_ITEMS: NavItem[] = [
  { to: '/admin',              label: 'Panel',        icon: LayoutGrid },
  { to: '/admin/publicadores', label: 'Publicadores', icon: Users      },
]

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, loading } = useCurrentUser()
  const { congregacion, isAdmin } = useCongregacion()
  const showAdmin = !loading && isAdmin()

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.requiresAuth && !user) return false
    return true
  })

  return (
    <nav className="flex flex-col h-full">
      {/* Logo + Congregation name */}
      <div className="flex h-16 items-center px-4 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">
              {congregacion?.nombre?.charAt(0)?.toUpperCase() ?? 'C'}
            </span>
          </div>
          <span className="font-semibold text-sm truncate">
            {congregacion?.nombre ?? 'Congregación'}
          </span>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {showAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="h-3 w-3" />
                Administración
              </p>
            </div>
            {ADMIN_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <p className="text-xs text-muted-foreground text-center">
          Programa de Reuniones v1.0
        </p>
      </div>
    </nav>
  )
}
