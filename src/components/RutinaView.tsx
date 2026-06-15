import { useMemo, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTINE, todayDayId } from '@/data/routine'
import { TOTAL_WEEKS, type DayId } from '@/types'
import { currentWeek } from '@/lib/week'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { WeekSelector } from './WeekSelector'
import { ExerciseCard } from './ExerciseCard'
import { useGym } from '@/store'

export function RutinaView() {
  const { getEntry, guardarDia } = useGym()
  const [semana, setSemana] = useState(() => currentWeek())
  const [diaId, setDiaId] = useState<DayId>(() => todayDayId())
  const [justSaved, setJustSaved] = useState(false)

  const day = ROUTINE.find((d) => d.id === diaId)!

  const completados = useMemo(
    () =>
      day.ejercicios.filter((e) => getEntry(semana, diaId, e.id).completado)
        .length,
    [day, semana, diaId, getEntry]
  )
  const total = day.ejercicios.length
  const pct = Math.round((completados / total) * 100)

  const onGuardar = () => {
    guardarDia(semana, diaId)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1800)
  }

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground">
          Semana {semana} de {TOTAL_WEEKS}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Mi rutina</h1>
      </div>

      {/* Selector de semana */}
      <WeekSelector semana={semana} onChange={setSemana} />

      {/* Pills de día */}
      <div className="grid grid-cols-5 gap-1.5">
        {ROUTINE.map((d) => {
          const active = d.id === diaId
          return (
            <button
              key={d.id}
              onClick={() => setDiaId(d.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl py-2.5 text-sm font-bold transition-colors',
                active
                  ? d.tipo === 'FUERZA'
                    ? 'bg-fuerza text-white shadow-sm'
                    : 'bg-hipertrofia text-white shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              {d.nombreCorto}
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  active
                    ? 'bg-white/80'
                    : d.tipo === 'FUERZA'
                      ? 'bg-fuerza'
                      : 'bg-hipertrofia'
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Tarjeta de día */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${semana}-${diaId}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold">{day.titulo}</h2>
                <Badge
                  variant={day.tipo === 'FUERZA' ? 'fuerza' : 'hipertrofia'}
                >
                  {day.tipo}
                </Badge>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                {day.nombre}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{day.foco}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold tabular-nums">
                {completados}
                <span className="text-base text-muted-foreground">
                  /{total}
                </span>
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                ejercicios
              </p>
            </div>
          </div>

          <Progress
            value={pct}
            indicatorClassName={
              day.tipo === 'FUERZA' ? 'bg-fuerza' : 'bg-hipertrofia'
            }
          />

          {/* Ejercicios agrupados por grupo muscular */}
          <div className="space-y-2.5">
            {day.ejercicios.map((ex, i) => {
              const nuevoGrupo = i === 0 || day.ejercicios[i - 1].grupo !== ex.grupo
              return (
                <div key={ex.id} className="space-y-2.5">
                  {nuevoGrupo && (
                    <div className="flex items-center gap-2 px-1 pt-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        {ex.grupo}
                      </span>
                      {ex.destacado && (
                        <span title="Prioridad" className="text-amber-500">
                          ★
                        </span>
                      )}
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <ExerciseCard exercise={ex} semana={semana} dia={diaId} />
                </div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Guardar */}
      <Button
        size="lg"
        onClick={onGuardar}
        className={cn(
          'w-full text-base transition-colors',
          justSaved && 'bg-emerald-500 hover:bg-emerald-500'
        )}
      >
        {justSaved ? (
          <>
            <Check className="h-5 w-5" /> ¡Día guardado!
          </>
        ) : (
          <>
            <Save className="h-5 w-5" /> Guardar pesos de hoy
          </>
        )}
      </Button>
      <p className="-mt-2 text-center text-xs text-muted-foreground">
        Tus pesos se guardan automáticamente al editarlos.
      </p>
    </div>
  )
}
