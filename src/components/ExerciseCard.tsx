import { Check, Minus, Plus, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import type { DayId, Exercise } from '@/types'
import { cn } from '@/lib/utils'
import { useGym } from '@/store'

function round(n: number) {
  return Math.round(n * 100) / 100
}

function youtubeSearch(nombre: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    nombre + ' técnica ejercicio'
  )}`
}

export function ExerciseCard({
  exercise,
  semana,
  dia,
}: {
  exercise: Exercise
  semana: number
  dia: DayId
}) {
  const { getEntry, setPesoSerie, setCompletado } = useGym()
  const entry = getEntry(semana, dia, exercise.id)
  const step = exercise.step ?? 2.5
  const unidad: 'kg' | 'reps' =
    exercise.unidad ?? (exercise.pesoCorporal ? 'reps' : 'kg')

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
          <h3 className="text-[15px] font-bold leading-tight">
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
          {exercise.nota && (
            <p className="mt-1 text-xs italic leading-snug text-muted-foreground/80">
              {exercise.nota}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={youtubeSearch(exercise.nombre)}
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

      {/* Pesos por serie */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {entry.pesos.map((peso, i) => (
          <SetInput
            key={i}
            serie={i + 1}
            peso={peso}
            unidad={unidad}
            step={step}
            onChange={(v) => setPesoSerie(semana, dia, exercise.id, i, v)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function SetInput({
  serie,
  peso,
  unidad,
  step,
  onChange,
}: {
  serie: number
  peso: number
  unidad: 'kg' | 'reps'
  step: number
  onChange: (peso: number) => void
}) {
  const suffix = unidad === 'reps' ? 'reps' : 'kg'
  return (
    <div className="rounded-xl border border-border bg-background/60 p-2">
      <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Serie {serie}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, round(peso - step)))}
          aria-label={`Restar ${step} ${suffix} a serie ${serie}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            type="number"
            inputMode="decimal"
            step={step}
            value={Number.isFinite(peso) ? peso : 0}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="h-8 w-full rounded-lg border border-input bg-background pr-8 text-center text-base font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
            {suffix}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange(round(peso + step))}
          aria-label={`Sumar ${step} ${suffix} a serie ${serie}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
