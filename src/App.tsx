import { useState } from 'react'
import {
  Dumbbell,
  BarChart3,
  Settings,
  Moon,
  Sun,
  UtensilsCrossed,
  FileText,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { RutinaView } from '@/components/RutinaView'
import { ProgresoView } from '@/components/ProgresoView'
import { ReportesView } from '@/components/ReportesView'
import { ComidasView } from '@/components/ComidasView'
import { ConfigView } from '@/components/ConfigView'

type View = 'rutina' | 'progreso' | 'reportes' | 'comidas' | 'config'

const NAV: { id: View; label: string; icon: typeof Dumbbell }[] = [
  { id: 'rutina', label: 'Rutina', icon: Dumbbell },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
  { id: 'reportes', label: 'Reportes', icon: FileText },
  { id: 'comidas', label: 'Comidas', icon: UtensilsCrossed },
  { id: 'config', label: 'Config', icon: Settings },
]

export default function App() {
  const [view, setView] = useState<View>('rutina')
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card p-4 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Mi Rutina</p>
            <p className="text-xs text-muted-foreground">Juan</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                view === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={toggle}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </Button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="md:pl-60">
        {/* Header mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </div>
            <p className="text-base font-bold">Mi Rutina</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </header>

        <main className="mx-auto max-w-3xl px-4 pb-28 pt-5 md:pb-10 md:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {view === 'rutina' && <RutinaView />}
              {view === 'progreso' && <ProgresoView />}
              {view === 'reportes' && <ReportesView />}
              {view === 'comidas' && <ComidasView />}
              {view === 'config' && (
                <ConfigView theme={theme} onToggleTheme={toggle} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors',
                view === id ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-6 w-6', view === id && 'scale-110')} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
