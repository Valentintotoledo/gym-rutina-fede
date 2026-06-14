import type { DayId, WeeklyLog } from '@/types'
import { ROUTINE } from '@/data/routine'
import type { FoodEntry } from '@/lib/comidas'

const keyOf = (s: number, d: DayId, e: string) => `${s}|${d}|${e}`

function buildIndex(logs: WeeklyLog[]) {
  const m = new Map<string, WeeklyLog>()
  for (const l of logs) m.set(keyOf(l.semana, l.dia, l.ejercicio), l)
  return m
}

function topSet(pesos: number[] | undefined): number | null {
  if (!pesos || pesos.length === 0) return null
  const max = Math.max(...pesos)
  return Number.isFinite(max) ? max : null
}

export interface EjercicioReporte {
  nombre: string
  repsLabel: string
  pesos: number[]
  completado: boolean
  topSet: number | null
}

export interface DiaReporte {
  dia: DayId
  nombre: string
  titulo: string
  tipo: string
  entrenado: boolean
  ejerciciosCompletados: number
  totalEjercicios: number
  volumen: number
  ejercicios: EjercicioReporte[]
}

export interface ReporteSemana {
  semana: number
  diasEntrenados: number
  ejerciciosCompletados: number
  volumenTotal: number
  dias: DiaReporte[]
  fechaDesde: string | null
  fechaHasta: string | null
}

export function reporteSemana(logs: WeeklyLog[], semana: number): ReporteSemana {
  const index = buildIndex(logs)
  let diasEntrenados = 0
  let ejerciciosCompletados = 0
  let volumenTotal = 0
  const fechas: string[] = []

  const dias: DiaReporte[] = ROUTINE.map((day) => {
    let completadosDia = 0
    let volumenDia = 0
    const ejercicios: EjercicioReporte[] = day.ejercicios.map((ex) => {
      const found = index.get(keyOf(semana, day.id, ex.id))
      const pesos = found?.pesos ?? []
      const completado = !!found?.completado
      if (completado) {
        completadosDia++
        ejerciciosCompletados++
        if (found?.fecha) fechas.push(found.fecha)
      }
      const sumKg = pesos.reduce((a, b) => a + (b || 0), 0)
      const vol = completado ? ex.reps * sumKg : 0
      volumenDia += vol
      return {
        nombre: ex.nombre,
        repsLabel: ex.repsLabel,
        pesos,
        completado,
        topSet: topSet(pesos),
      }
    })
    const entrenado = day.ejercicios.length > 0 && completadosDia === day.ejercicios.length
    if (entrenado) diasEntrenados++
    volumenTotal += volumenDia
    return {
      dia: day.id,
      nombre: day.nombre,
      titulo: day.titulo,
      tipo: day.tipo,
      entrenado,
      ejerciciosCompletados: completadosDia,
      totalEjercicios: day.ejercicios.length,
      volumen: volumenDia,
      ejercicios,
    }
  })

  fechas.sort()
  return {
    semana,
    diasEntrenados,
    ejerciciosCompletados,
    volumenTotal,
    dias,
    fechaDesde: fechas[0] ?? null,
    fechaHasta: fechas[fechas.length - 1] ?? null,
  }
}

export interface ReporteMes {
  mes: number // 1..3
  semanas: number[] // ej [1,2,3,4]
  diasEntrenados: number
  ejerciciosCompletados: number
  volumenTotal: number
  detalleSemanas: ReporteSemana[]
}

/** Mes = bloque de 4 semanas (Mes 1 → semanas 1-4, etc.) */
export function reporteMes(logs: WeeklyLog[], mes: number): ReporteMes {
  const inicio = (mes - 1) * 4 + 1
  const semanas = [inicio, inicio + 1, inicio + 2, inicio + 3]
  const detalleSemanas = semanas.map((s) => reporteSemana(logs, s))
  return {
    mes,
    semanas,
    diasEntrenados: detalleSemanas.reduce((a, r) => a + r.diasEntrenados, 0),
    ejerciciosCompletados: detalleSemanas.reduce(
      (a, r) => a + r.ejerciciosCompletados,
      0
    ),
    volumenTotal: detalleSemanas.reduce((a, r) => a + r.volumenTotal, 0),
    detalleSemanas,
  }
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR').format(Math.round(n))

function fmtRango(desde: string | null, hasta: string | null): string {
  if (!desde) return 'sin entrenamientos registrados'
  const d = new Date(desde).toLocaleDateString('es-AR')
  const h = hasta ? new Date(hasta).toLocaleDateString('es-AR') : d
  return d === h ? d : `${d} → ${h}`
}

function comidasEnRango(
  comidas: FoodEntry[],
  desde: string | null,
  hasta: string | null
): FoodEntry[] {
  if (!desde) return []
  const ini = new Date(desde).setHours(0, 0, 0, 0)
  const fin = new Date(hasta ?? desde).setHours(23, 59, 59, 999)
  return comidas.filter((c) => {
    const t = new Date(c.fecha).getTime()
    return t >= ini && t <= fin
  })
}

/** Texto plano de un reporte semanal, listo para descargar/copiar. */
export function textoReporteSemana(
  rep: ReporteSemana,
  comidas: FoodEntry[] = []
): string {
  const L: string[] = []
  L.push(`REPORTE SEMANAL — Semana ${rep.semana}`)
  L.push(`Período: ${fmtRango(rep.fechaDesde, rep.fechaHasta)}`)
  L.push('')
  L.push(`Días entrenados: ${rep.diasEntrenados}/5`)
  L.push(`Ejercicios completados: ${rep.ejerciciosCompletados}`)
  L.push(`Volumen total: ${fmt(rep.volumenTotal)} kg`)
  L.push('')
  for (const d of rep.dias) {
    L.push(
      `■ ${d.nombre} — ${d.titulo} (${d.tipo})  ${d.entrenado ? '✔ entrenado' : `${d.ejerciciosCompletados}/${d.totalEjercicios}`}`
    )
    for (const ex of d.ejercicios) {
      const marca = ex.completado ? '✓' : '·'
      const pesos = ex.pesos.length ? ex.pesos.map((p) => `${p}`).join('/') : '—'
      L.push(`   ${marca} ${ex.nombre} (${ex.repsLabel}): ${pesos} kg`)
    }
    L.push('')
  }
  const cs = comidasEnRango(comidas, rep.fechaDesde, rep.fechaHasta)
  L.push(`Comidas registradas: ${cs.length}`)
  for (const c of cs) {
    L.push(
      `   - ${new Date(c.fecha).toLocaleString('es-AR')}: ${c.descripcion}${c.foto ? ' (con foto)' : ''}`
    )
  }
  return L.join('\n')
}

/** Texto plano de un reporte mensual. */
export function textoReporteMes(
  rep: ReporteMes,
  comidas: FoodEntry[] = []
): string {
  const L: string[] = []
  L.push(`REPORTE MENSUAL — Mes ${rep.mes} (semanas ${rep.semanas.join(', ')})`)
  L.push('')
  L.push(`Días entrenados: ${rep.diasEntrenados}`)
  L.push(`Ejercicios completados: ${rep.ejerciciosCompletados}`)
  L.push(`Volumen total: ${fmt(rep.volumenTotal)} kg`)
  L.push('')
  for (const s of rep.detalleSemanas) {
    L.push(
      `Semana ${s.semana}: ${s.diasEntrenados}/5 días · ${fmt(s.volumenTotal)} kg`
    )
  }
  // Comidas registradas en todo el rango del mes
  const fechas = rep.detalleSemanas
    .flatMap((s) => [s.fechaDesde, s.fechaHasta])
    .filter((f): f is string => !!f)
    .sort()
  const cs = comidasEnRango(comidas, fechas[0] ?? null, fechas[fechas.length - 1] ?? null)
  L.push('')
  L.push(`Comidas registradas: ${cs.length}`)
  return L.join('\n')
}

/** Dispara la descarga de un archivo de texto en el navegador. */
export function descargarTexto(nombre: string, contenido: string) {
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
