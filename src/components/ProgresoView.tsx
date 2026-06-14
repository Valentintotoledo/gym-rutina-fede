import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CalendarCheck,
  Dumbbell,
  Flame,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ALL_EXERCISES } from '@/data/routine'
import {
  computeKpis,
  distribucionPorTipo,
  historialMatriz,
  progresionEjercicio,
  volumenPorSemana,
} from '@/lib/stats'
import { useGym } from '@/store'
import { useIsDark } from '@/hooks/useIsDark'

function fmtNum(n: number) {
  return new Intl.NumberFormat('es-AR').format(Math.round(n))
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Trophy
  label: string
  value: string
  sub?: string
  tone: 'primary' | 'accent' | 'emerald' | 'sky'
}) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  } as const
  return (
    <Card className="p-4">
      <div
        className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-extrabold leading-none tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
      {sub && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{sub}</p>
      )}
    </Card>
  )
}

function ChartCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-base font-bold">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </Card>
  )
}

export function ProgresoView() {
  const { logs } = useGym()
  const isDark = useIsDark()
  const [ejercicioId, setEjercicioId] = useState(ALL_EXERCISES[0].id)

  const kpis = useMemo(() => computeKpis(logs), [logs])
  const volSemana = useMemo(() => volumenPorSemana(logs), [logs])
  const distrib = useMemo(() => distribucionPorTipo(logs), [logs])
  const progresion = useMemo(
    () => progresionEjercicio(logs, ejercicioId),
    [logs, ejercicioId]
  )
  const historial = useMemo(() => historialMatriz(logs), [logs])

  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const tooltipStyle = {
    background: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${gridColor}`,
    borderRadius: 12,
    fontSize: 12,
    color: isDark ? '#f1f5f9' : '#0f172a',
  }

  const totalDias = distrib_total(distrib)
  const ejActual = ALL_EXERCISES.find((e) => e.id === ejercicioId)!

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Progreso</h1>
        <p className="text-sm text-muted-foreground">
          Tu evolución semana a semana
        </p>
      </div>

      {logs.length === 0 && (
        <Card className="p-4">
          <p className="text-sm font-semibold">Todavía no hay registros</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cargá tus pesos en la pestaña Rutina y acá vas a ver tu progreso
            semanal y mensual. Si querés ver cómo se ve con datos, podés cargar
            el ejemplo desde Config.
          </p>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={CalendarCheck}
          tone="emerald"
          label="Días entrenados"
          value={fmtNum(kpis.diasEntrenados)}
        />
        <KpiCard
          icon={Trophy}
          tone="primary"
          label="Semanas completas"
          value={fmtNum(kpis.semanasCompletadas)}
        />
        <KpiCard
          icon={TrendingUp}
          tone="accent"
          label="Mayor progreso"
          value={
            kpis.mejorProgreso ? `+${fmtNum(kpis.mejorProgreso.delta)} kg` : '—'
          }
          sub={kpis.mejorProgreso?.nombre}
        />
        <KpiCard
          icon={Flame}
          tone="sky"
          label="Volumen total"
          value={`${fmtNum(kpis.volumenTotal)}`}
          sub="kg levantados"
        />
      </div>

      {/* Gráfico 1: evolución de peso por ejercicio */}
      <ChartCard
        title="Evolución de peso"
        desc="Carga (kg) por semana del ejercicio elegido"
      >
        <div className="mb-3 flex items-center gap-2">
          <Dumbbell className="h-4 w-4 shrink-0 text-muted-foreground" />
          <select
            value={ejercicioId}
            onChange={(e) => setEjercicioId(e.target.value)}
            className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ALL_EXERCISES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={progresion}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="semana"
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
              unit=""
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${v} kg`, ejActual.nombre]}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#4F46E5"
              strokeWidth={3}
              connectNulls
              dot={{ r: 4, fill: '#4F46E5' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gráfico 2: volumen semanal */}
      <ChartCard
        title="Volumen semanal"
        desc="Series × reps × kg sumado por semana"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={volSemana}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="semana"
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) => fmtNum(v)}
            />
            <Tooltip
              cursor={{ fill: isDark ? '#ffffff10' : '#0000000a' }}
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${fmtNum(v)} kg`, 'Volumen']}
            />
            <Bar dataKey="volumen" radius={[6, 6, 0, 0]} fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gráfico 3: distribución por tipo */}
      <ChartCard
        title="Fuerza vs Hipertrofia"
        desc="Distribución de días completados"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-[180px] w-[170px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distrib}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {distrib.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, n: string) => [`${v} días`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold tabular-nums leading-none">
                {totalDias}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                días
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {distrib.map((d) => {
              const p = totalDias ? Math.round((d.value / totalDias) * 100) : 0
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.name}
                    </span>
                    <span className="font-bold tabular-nums">{p}%</span>
                  </div>
                  <p className="ml-5 text-xs text-muted-foreground">
                    {d.value} días
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </ChartCard>

      {/* Tabla de historial */}
      <ChartCard
        title="Historial de pesos"
        desc="Kg registrados semana a semana"
      >
        <div className="-mx-1 overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="sticky left-0 z-10 bg-card px-2 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Ejercicio
                </th>
                {historial.semanas.map((s) => (
                  <th
                    key={s}
                    className="px-2 py-2 text-center text-xs font-bold text-muted-foreground"
                  >
                    S{s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historial.filas.map(({ day, ejercicios }) => (
                <FilasDia
                  key={day.id}
                  nombre={day.nombre}
                  tipoColor={day.tipo === 'FUERZA' ? '#4F46E5' : '#F97316'}
                  cols={historial.semanas.length}
                  ejercicios={ejercicios}
                />
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </motion.div>
  )
}

function FilasDia({
  nombre,
  tipoColor,
  cols,
  ejercicios,
}: {
  nombre: string
  tipoColor: string
  cols: number
  ejercicios: { ex: { id: string; nombre: string }; pesos: (number | null)[] }[]
}) {
  return (
    <>
      <tr>
        <td
          colSpan={cols + 1}
          className="px-2 pb-1 pt-3 text-xs font-bold"
          style={{ color: tipoColor }}
        >
          {nombre}
        </td>
      </tr>
      {ejercicios.map(({ ex, pesos }) => (
        <tr key={ex.id} className="border-t border-border">
          <td className="sticky left-0 z-10 max-w-[140px] truncate bg-card px-2 py-2 font-medium">
            {ex.nombre}
          </td>
          {pesos.map((p, i) => (
            <td
              key={i}
              className="px-2 py-2 text-center tabular-nums text-muted-foreground"
            >
              {p === null ? '·' : p}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function distrib_total(d: { value: number }[]) {
  return d.reduce((a, b) => a + b.value, 0)
}
