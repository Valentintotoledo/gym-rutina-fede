import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Check, CalendarRange, CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TOTAL_WEEKS } from '@/types'
import { useGym } from '@/store'
import { useComidas } from '@/hooks/useComidas'
import {
  reporteSemana,
  reporteMes,
  textoReporteSemana,
  textoReporteMes,
  descargarTexto,
} from '@/lib/report'

const MESES = Math.ceil(TOTAL_WEEKS / 4)

const fmt = (n: number) => new Intl.NumberFormat('es-AR').format(Math.round(n))

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
      <p className="text-xl font-extrabold tabular-nums leading-none">{value}</p>
      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

export function ReportesView() {
  const { logs } = useGym()
  const { entries: comidas } = useComidas()
  const [modo, setModo] = useState<'semanal' | 'mensual'>('semanal')
  const [semana, setSemana] = useState(1)
  const [mes, setMes] = useState(1)
  const [copiado, setCopiado] = useState(false)

  const repSemana = useMemo(() => reporteSemana(logs, semana), [logs, semana])
  const repMes = useMemo(() => reporteMes(logs, mes), [logs, mes])

  const texto = useMemo(
    () =>
      modo === 'semanal'
        ? textoReporteSemana(repSemana, comidas)
        : textoReporteMes(repMes, comidas),
    [modo, repSemana, repMes, comidas]
  )

  const onDescargar = () => {
    const nombre =
      modo === 'semanal'
        ? `reporte-semana-${semana}.txt`
        : `reporte-mes-${mes}.txt`
    descargarTexto(nombre, texto)
  }

  const onCopiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 1600)
    } catch {
      /* noop */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground">
          Extraé un resumen de tu semana o tu mes
        </p>
      </div>

      {/* Selector de modo */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setModo('semanal')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
            modo === 'semanal'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-secondary'
          }`}
        >
          <CalendarDays className="h-4 w-4" /> Semanal
        </button>
        <button
          onClick={() => setModo('mensual')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
            modo === 'mensual'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-secondary'
          }`}
        >
          <CalendarRange className="h-4 w-4" /> Mensual
        </button>
      </div>

      {/* Selector de período */}
      {modo === 'semanal' ? (
        <select
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((s) => (
            <option key={s} value={s}>
              Semana {s}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Array.from({ length: MESES }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              Mes {m} (semanas {(m - 1) * 4 + 1}-{m * 4})
            </option>
          ))}
        </select>
      )}

      {/* Acciones */}
      <div className="flex gap-2">
        <Button onClick={onDescargar} className="flex-1">
          <Download className="h-4 w-4" /> Descargar
        </Button>
        <Button variant="outline" onClick={onCopiar} className="flex-1">
          {copiado ? (
            <>
              <Check className="h-4 w-4" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copiar
            </>
          )}
        </Button>
      </div>

      {/* Vista del reporte */}
      {modo === 'semanal' ? (
        <SemanaReporte rep={repSemana} comidasCount={comidas.length} />
      ) : (
        <MesReporte rep={repMes} />
      )}
    </motion.div>
  )
}

function SemanaReporte({
  rep,
  comidasCount,
}: {
  rep: ReturnType<typeof reporteSemana>
  comidasCount: number
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Días entrenados" value={`${rep.diasEntrenados}/5`} />
        <Kpi label="Ejercicios" value={fmt(rep.ejerciciosCompletados)} />
        <Kpi label="Volumen kg" value={fmt(rep.volumenTotal)} />
      </div>

      {rep.diasEntrenados === 0 && comidasCount === 0 && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Todavía no hay nada cargado en esta semana. Registrá tus pesos en
            Rutina y van a aparecer acá.
          </p>
        </Card>
      )}

      {rep.dias.map((d) => (
        <Card key={d.dia} className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold">{d.titulo}</h3>
              <p className="text-xs text-muted-foreground">{d.nombre}</p>
            </div>
            <Badge variant={d.tipo === 'FUERZA' ? 'fuerza' : 'hipertrofia'}>
              {d.entrenado
                ? '✔'
                : `${d.ejerciciosCompletados}/${d.totalEjercicios}`}
            </Badge>
          </div>
          <ul className="space-y-1 text-sm">
            {d.ejercicios.map((ex, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-2 ${
                  ex.completado ? '' : 'text-muted-foreground/60'
                }`}
              >
                <span className="truncate">
                  {ex.completado ? '✓ ' : '· '}
                  {ex.nombre}
                </span>
                <span className="shrink-0 tabular-nums font-semibold">
                  {ex.pesos.length ? ex.pesos.join('/') : '—'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}

function MesReporte({ rep }: { rep: ReturnType<typeof reporteMes> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Días entrenados" value={fmt(rep.diasEntrenados)} />
        <Kpi label="Ejercicios" value={fmt(rep.ejerciciosCompletados)} />
        <Kpi label="Volumen kg" value={fmt(rep.volumenTotal)} />
      </div>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-extrabold">Detalle por semana</h3>
        <div className="space-y-2.5">
          {rep.detalleSemanas.map((s) => (
            <div key={s.semana}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Semana {s.semana}</span>
                <span className="text-muted-foreground">
                  {s.diasEntrenados}/5 días · {fmt(s.volumenTotal)} kg
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(s.diasEntrenados / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
