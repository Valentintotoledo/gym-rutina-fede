import { useState } from 'react'
import {
  Dumbbell,
  BarChart3,
  Settings,
  Moon,
  Sun,
  UtensilsCrossed,
  FileText,
  Home,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { InicioView } from '@/components/InicioView'
import { RutinaView } from '@/components/RutinaView'
import { ProgresoView } from '@/components/ProgresoView'
import { ReportesView } from '@/components/ReportesView'
import { ComidasView } from '@/components/ComidasView'
import { ConfigView } from '@/components/ConfigView'
import { Login } from '@/components/Login'
import { isAuthed, logout } from '@/lib/auth'
import type { DayId } from '@/types'

type View = 'inicio' | 'rutina' | 'progreso' | 'reportes' | 'comidas' | 'config'

const NAV: { id: View; label: string; icon: typeof Dumbbell }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'rutina', label: 'Rutina', icon: Dumbbell },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
  { id: 'reportes', label: 'Reportes', icon: FileText },
  { id: 'comidas', label: 'Comidas', icon: UtensilsCrossed },
  { id: 'config', label: 'Config', icon: Settings },
]

export default function App() {
  const [view, setView] = useState<View>('inicio')
  const [authed, setAuthed] = useState(() => isAuthed())
  const [rutinaInit, setRutinaInit] = useState<{ semana: number; dia: DayId }>()
  const [rutinaKey, setRutinaKey] = useState(0)
  const { theme, toggle } = useTheme()

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  const onLogout = () => {
    logout()
    setAuthed(false)
    setView('inicio')
  }

  const abrirDia = (semana: number, dia: DayId) => {
    setRutinaInit({ semana, dia })
    setRutinaKey((k) => k + 1)
    setView('rutina')
  }

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
        {/* Header + tabs (mobile) */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur md:hidden">
          <header className="flex items-center justify-between px-4 py-3">
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
          {/* Barra de secciones arriba */}
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  view === id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <main className="mx-auto max-w-3xl px-4 pb-10 pt-5 md:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {view === 'inicio' && (
                <InicioView
                  onAbrirDia={abrirDia}
                  onIrComidas={() => setView('comidas')}
                />
              )}
              {view === 'rutina' && (
                <RutinaView key={rutinaKey} initial={rutinaInit} />
              )}
              {view === 'progreso' && <ProgresoView />}
              {view === 'reportes' && <ReportesView />}
              {view === 'comidas' && <ComidasView />}
              {view === 'config' && (
                <ConfigView
                  theme={theme}
                  onToggleTheme={toggle}
                  onLogout={onLogout}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
