import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Check, UtensilsCrossed, Dumbbell } from 'lucide-react'
import { ROUTINE } from '@/data/routine'
import { TOTAL_WEEKS, type DayId } from '@/types'
import { currentWeek } from '@/lib/week'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WeekSelector } from './WeekSelector'
import { useGym } from '@/store'

function hoyLargo(): string {
  return new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export function InicioView({
  onAbrirDia,
  onIrComidas,
}: {
  onAbrirDia: (semana: number, dia: DayId) => void
  onIrComidas: () => void
}) {
  const { getEntry } = useGym()
  const [semana, setSemana] = useState(() => currentWeek())

  // Estado de cada día de la semana elegida
  const dias = useMemo(
    () =>
      ROUTINE.map((d) => {
        let completados = 0
        let saltados = 0
        for (const e of d.ejercicios) {
          const en = getEntry(semana, d.id, e.id)
          if (en.completado) completados++
          else if (en.saltado) saltados++
        }
        const total = d.ejercicios.length
        // "Hecho" = no queda ningún ejercicio pendiente (hecho ✓ o "no lo hice" ✗)
        const hecho = completados > 0 && completados + saltados === total
        return { day: d, completados, saltados, total, hecho }
      }),
    [semana, getEntry]
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Hola, Juan 💪</h1>
        <p className="text-sm capitalize text-muted-foreground">{hoyLargo()}</p>
      </div>

      {/* Selector de semana */}
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Semana</p>
          <p className="text-sm font-semibold text-muted-foreground">
            {semana} de {TOTAL_WEEKS}
          </p>
        </div>
        <WeekSelector semana={semana} onChange={setSemana} />
      </Card>

      {/* Elegí el día a entrenar */}
      <div>
        <h2 className="mb-2 text-lg font-extrabold tracking-tight">
          Elegí el día
        </h2>
        <div className="space-y-2.5">
          {dias.map(({ day, completados, saltados, total, hecho }) => (
            <button
              key={day.id}
              onClick={() => onAbrirDia(semana, day.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-colors active:scale-[0.99]',
                hecho
                  ? 'border-emerald-500/50 bg-emerald-500/[0.08] hover:border-emerald-500'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              {/* Indicador del día */}
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white',
                  hecho
                    ? 'bg-emerald-500'
                    : day.tipo === 'FUERZA'
                      ? 'bg-fuerza'
                      : 'bg-hipertrofia'
                )}
              >
                <span className="text-base font-extrabold leading-none">
                  {day.nombreCorto}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[15px] font-bold">
                    {day.titulo}
                  </h3>
                  <Badge
                    variant={day.tipo === 'FUERZA' ? 'fuerza' : 'hipertrofia'}
                  >
                    {day.tipo}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {day.foco}
                </p>
                {/* Progreso */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        hecho
                          ? 'bg-emerald-500'
                          : day.tipo === 'FUERZA'
                            ? 'bg-fuerza'
                            : 'bg-hipertrofia'
                      )}
                      style={{
                        width: `${hecho ? 100 : (completados / total) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold tabular-nums',
                      hecho
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    {hecho && <Check className="h-3.5 w-3.5" />}
                    {completados}/{total}
                    {saltados > 0 && (
                      <span className="font-normal opacity-70">
                        {' '}
                        ({saltados} ✗)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onAbrirDia(semana, ROUTINE[0].id)}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold leading-tight">
            Ir a la rutina
          </span>
        </button>
        <button
          onClick={onIrComidas}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold leading-tight">
            Cargar comidas
          </span>
        </button>
      </div>
    </motion.div>
  )
}
