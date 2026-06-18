import { useState } from 'react'
import {
  LogOut,
  Moon,
  RotateCcw,
  Sun,
  Trash2,
  Github,
  Cloud,
  CloudOff,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGym } from '@/store'
import { clearLogs } from '@/lib/storage'
import { ROUTINE } from '@/data/routine'
import { syncEnabled } from '@/lib/sync'

export function ConfigView({
  theme,
  onToggleTheme,
  onLogout,
}: {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onLogout: () => void
}) {
  const { resetMock } = useGym()
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const totalEjercicios = ROUTINE.reduce(
    (a, d) => a + d.ejercicios.length,
    0
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Config</h1>
        <p className="text-sm text-muted-foreground">Ajustes de la app</p>
      </div>

      {/* Sincronización */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              syncEnabled()
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {syncEnabled() ? (
              <Cloud className="h-5 w-5" />
            ) : (
              <CloudOff className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">
              {syncEnabled()
                ? 'Sincronización activada'
                : 'Sincronización desactivada'}
            </p>
            <p className="text-sm text-muted-foreground">
              {syncEnabled()
                ? 'Tus datos se comparten entre el celular y la computadora.'
                : 'Por ahora los datos quedan solo en este dispositivo.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Apariencia */}
      <Card className="divide-y divide-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Tema</p>
            <p className="text-sm text-muted-foreground">
              {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={onToggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </Card>

      {/* Datos */}
      <Card className="divide-y divide-border">
        <div className="p-4">
          <p className="font-semibold">Restaurar datos de ejemplo</p>
          <p className="mb-3 text-sm text-muted-foreground">
            Vuelve a cargar las 4 semanas de demostración.
          </p>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  resetMock()
                  setConfirmReset(false)
                }}
              >
                Sí, restaurar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmReset(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="h-4 w-4" /> Restaurar
            </Button>
          )}
        </div>

        <div className="p-4">
          <p className="font-semibold text-destructive">Borrar todo</p>
          <p className="mb-3 text-sm text-muted-foreground">
            Elimina todos tus registros. No se puede deshacer.
          </p>
          {confirmClear ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  clearLogs()
                  window.location.reload()
                }}
              >
                Sí, borrar todo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmClear(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 className="h-4 w-4" /> Borrar todo
            </Button>
          )}
        </div>
      </Card>

      {/* Sesión */}
      <Card className="p-4">
        <p className="font-semibold">Sesión</p>
        <p className="mb-3 text-sm text-muted-foreground">
          Cerrá la sesión en este dispositivo.
        </p>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Button>
      </Card>

      {/* Info */}
      <Card className="p-4">
        <p className="font-semibold">Sobre la app</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>Rutina de 5 días · {totalEjercicios} ejercicios</li>
          <li>
            {syncEnabled()
              ? 'Datos en la nube (Supabase) + copia local'
              : 'Datos guardados en este dispositivo (localStorage)'}
          </li>
          <li>Hecha a medida para Juan 💪</li>
        </ul>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Github className="h-3.5 w-3.5" /> Mi Rutina · v0.1.0
        </div>
      </Card>
    </div>
  )
}
