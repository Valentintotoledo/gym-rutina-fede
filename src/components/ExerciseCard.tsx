import { useEffect, useMemo, useState } from 'react'
import { Check, Link2, Minus, Plus, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import type { DayId, Exercise } from '@/types'
import { cn } from '@/lib/utils'
import { useGym } from '@/store'

function round(n: number) {
  return Math.round(n * 100) / 100
}

/** Convierte el texto del input (acepta coma o punto) a número. */
function toNum(s: string): number {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

/** Muestra un número con coma decimal (estilo AR). '' si es 0. */
function fmtNum(n: number): string {
  if (!n) return ''
  return String(n).replace('.', ',')
}

function youtubeSearch(nombre: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    nombre + ' técnica ejercicio'
  )}`
}

/** Opciones de repeticiones a partir de la etiqueta (ej "6-8" → [6,7,8]). */
function repOptions(label: string): number[] {
  if (label.includes('@')) {
    const m = label.match(/(\d+)/)
    return m ? [Number(m[1])] : []
  }
  const range = label.match(/(\d+)\s*-\s*(\d+)/)
  if (range) {
    const a = Number(range[1])
    const b = Number(range[2])
    if (b >= a && b - a <= 12) {
      return Array.from({ length: b - a + 1 }, (_, i) => a + i)
    }
  }
  const single = label.match(/^\s*(\d+)\s*$/)
  if (single) return [Number(single[1])]
  return []
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
  const { getEntry, setPesoSerie, setRepSerie, setCompletado } = useGym()
  const entry = getEntry(semana, dia, exercise.id)
  const step = exercise.step ?? 2.5
  const unidad: 'kg' | 'reps' =
    exercise.unidad ?? (exercise.pesoCorporal ? 'reps' : 'kg')
  // Sólo mostramos el registro de reps en ejercicios de carga (kg)
  const mostrarReps = unidad === 'kg'
  const opts = useMemo(() => repOptions(exercise.repsLabel), [exercise.repsLabel])

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
          {exercise.biserie && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              <Link2 className="h-3 w-3" /> Bi-serie
            </span>
          )}
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

      {/* Series: peso + repeticiones */}
      <div className="mt-3.5 space-y-2">
        {entry.pesos.map((peso, i) => (
          <SerieRow
            key={i}
            serie={i + 1}
            peso={peso}
            reps={entry.reps[i] ?? 0}
            unidad={unidad}
            step={step}
            opts={opts}
            mostrarReps={mostrarReps}
            onPeso={(v) => setPesoSerie(semana, dia, exercise.id, i, v)}
            onReps={(v) => setRepSerie(semana, dia, exercise.id, i, v)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function SerieRow({
  serie,
  peso,
  reps,
  unidad,
  step,
  opts,
  mostrarReps,
  onPeso,
  onReps,
}: {
  serie: number
  peso: number
  reps: number
  unidad: 'kg' | 'reps'
  step: number
  opts: number[]
  mostrarReps: boolean
  onPeso: (peso: number) => void
  onReps: (reps: number) => void
}) {
  const suffix = unidad === 'reps' ? 'reps' : 'kg'

  // Input de peso editable libremente (string local sincronizado con el store)
  const [pesoStr, setPesoStr] = useState(() => fmtNum(peso))
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!focused) setPesoStr(fmtNum(peso))
  }, [peso, focused])

  const onPesoInput = (raw: string) => {
    const clean = raw.replace(/[^0-9.,]/g, '')
    setPesoStr(clean)
    onPeso(toNum(clean))
  }
  const applyDelta = (d: number) => {
    const v = Math.max(0, round((peso || 0) + d))
    onPeso(v)
    setPesoStr(fmtNum(v))
  }

  // Reps: "otras" se activa al tocarlo o si el valor no está entre las opciones
  const [otroOpen, setOtroOpen] = useState(false)
  const otroActivo =
    otroOpen || (reps > 0 && (opts.length === 0 || !opts.includes(reps)))
  const [otroStr, setOtroStr] = useState(
    reps && (opts.length === 0 || !opts.includes(reps)) ? String(reps) : ''
  )
  useEffect(() => {
    if (reps && (opts.length === 0 || !opts.includes(reps))) {
      setOtroStr(String(reps))
    }
  }, [reps, opts])

  return (
    <div className="rounded-xl border border-border bg-background/60 p-2.5">
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Serie {serie}
        </span>
        <button
          type="button"
          onClick={() => applyDelta(-step)}
          aria-label={`Restar ${step} ${suffix} a serie ${serie}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={pesoStr}
            placeholder="0"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onPesoInput(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-background pr-8 text-center text-base font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
            {suffix}
          </span>
        </div>
        <button
          type="button"
          onClick={() => applyDelta(step)}
          aria-label={`Sumar ${step} ${suffix} a serie ${serie}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Repeticiones hechas */}
      {mostrarReps && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-14">
          <span className="mr-0.5 text-[11px] font-semibold text-muted-foreground">
            Reps:
          </span>
          {opts.map((o) => {
            const sel = !otroActivo && reps === o
            return (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setOtroOpen(false)
                  setOtroStr('')
                  // Volver a tocar la opción ya elegida la desmarca (vuelve a 0)
                  onReps(sel ? 0 : o)
                }}
                className={cn(
                  'h-7 min-w-7 rounded-lg border px-2 text-sm font-bold tabular-nums transition-colors',
                  sel
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                )}
              >
                {o}
              </button>
            )
          })}
          {opts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                // Si ya está activo, lo cierra y borra el valor
                if (otroActivo) {
                  setOtroOpen(false)
                  setOtroStr('')
                  onReps(0)
                } else {
                  setOtroOpen(true)
                }
              }}
              className={cn(
                'h-7 rounded-lg border px-2 text-xs font-bold transition-colors',
                otroActivo
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              )}
            >
              Otras
            </button>
          )}
          {otroActivo && (
            <input
              type="text"
              inputMode="numeric"
              value={otroStr}
              placeholder="N°"
              autoFocus={otroOpen}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^0-9]/g, '')
                setOtroStr(clean)
                onReps(clean ? Number(clean) : 0)
              }}
              className="h-7 w-14 rounded-lg border border-input bg-background text-center text-sm font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}
        </div>
      )}
    </div>
  )
}
