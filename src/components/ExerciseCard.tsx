import { Check, Minus, Plus, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import type { DayId, Exercise } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGym } from '@/store'

const STEP = 2.5

export function ExerciseCard({
  exercise,
  semana,
  dia,
}: {
  exercise: Exercise
  semana: number
  dia: DayId
}) {
  const { getEntry, setPeso, setCompletado } = useGym()
  const entry = getEntry(semana, dia, exercise.id)

  const cambiarPeso = (delta: number) =>
    setPeso(semana, dia, exercise.id, Math.max(0, round(entry.peso + delta)))

  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl border bg-card p-4 shadow-sm transition-colors',
        entry.completado
          ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
          : 'border-border'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-tight">
            {exercise.nombre}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {exercise.series}
            </span>{' '}
            ×{' '}
            <span className="font-semibold text-foreground">
              {exercise.repsLabel}
            </span>{' '}
            {exercise.pesoCorporal && (
              <span className="ml-1 text-xs">· peso corporal</span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={exercise.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver técnica de ${exercise.nombre} en YouTube`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
          >
            <Youtube className="h-5 w-5" />
          </a>
          <button
            onClick={() =>
              setCompletado(semana, dia, exercise.id, !entry.completado)
            }
            aria-label="Marcar completado"
            aria-pressed={entry.completado}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95',
              entry.completado
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-border bg-background text-muted-foreground hover:border-emerald-500/50'
            )}
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Control de peso */}
      <div className="mt-3.5 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl text-base"
          onClick={() => cambiarPeso(-STEP)}
          aria-label="Restar 2.5 kg"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Input
            type="number"
            inputMode="decimal"
            step={STEP}
            value={Number.isFinite(entry.peso) ? entry.peso : 0}
            onChange={(e) =>
              setPeso(semana, dia, exercise.id, parseFloat(e.target.value) || 0)
            }
            className="h-11 rounded-xl pr-10 text-center text-lg font-bold tabular-nums"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            kg
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl text-base"
          onClick={() => cambiarPeso(STEP)}
          aria-label="Sumar 2.5 kg"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}

function round(n: number) {
  return Math.round(n * 100) / 100
}
