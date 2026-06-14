import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TOTAL_WEEKS } from '@/types'
import { cn } from '@/lib/utils'

export function WeekSelector({
  semana,
  onChange,
}: {
  semana: number
  onChange: (s: number) => void
}) {
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, semana - 1))}
        disabled={semana <= 1}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        aria-label="Semana anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {weeks.map((w) => (
          <button
            key={w}
            onClick={() => onChange(w)}
            className={cn(
              'inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg px-2.5 text-sm font-bold transition-colors',
              w === semana
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-secondary'
            )}
          >
            {w}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(TOTAL_WEEKS, semana + 1))}
        disabled={semana >= TOTAL_WEEKS}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        aria-label="Semana siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
