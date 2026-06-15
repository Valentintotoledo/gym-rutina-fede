import type { ReporteSemana, ReporteMes } from '@/lib/report'

const COLORS = {
  primary: '#4F46E5',
  accent: '#F97316',
  navy: '#0f172a',
  slate: '#64748b',
  light: '#f1f5f9',
  border: '#e2e8f0',
  emerald: '#10b981',
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR').format(Math.round(n))

function fmtFecha(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR')
}

/** Donut SVG a partir de segmentos {label, value, color}. */
function donut(
  segmentos: { label: string; value: number; color: string }[],
  titulo: string
): string {
  const total = segmentos.reduce((a, s) => a + s.value, 0)
  const r = 60
  const cx = 80
  const cy = 80
  const C = 2 * Math.PI * r
  let offset = 0
  const arcs = segmentos
    .map((s) => {
      const frac = total > 0 ? s.value / total : 0
      const len = frac * C
      const dash = `${len} ${C - len}`
      const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="26" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" />`
      offset += len
      return circle
    })
    .join('')
  const leyenda = segmentos
    .map((s) => {
      const pct = total > 0 ? Math.round((s.value / total) * 100) : 0
      return `<div class="leg"><span class="dot" style="background:${s.color}"></span>${s.label}: <b>${fmt(s.value)}</b> (${pct}%)</div>`
    })
    .join('')
  return `
    <div class="chart">
      <div class="chart-title">${titulo}</div>
      <svg viewBox="0 0 160 160" width="160" height="160">
        ${total === 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COLORS.border}" stroke-width="26" />` : arcs}
        <circle cx="${cx}" cy="${cy}" r="40" fill="white" />
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="800" fill="${COLORS.navy}">${fmt(total)}</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="${COLORS.slate}">total</text>
      </svg>
      <div class="leyenda">${leyenda}</div>
    </div>`
}

function styles(): string {
  return `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: ${COLORS.navy}; background: #fff; }
    .page { max-width: 820px; margin: 0 auto; padding: 32px; }
    .header { background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent}); color: #fff; border-radius: 18px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; }
    .header h1 { font-size: 24px; font-weight: 800; }
    .header p { opacity: .9; font-size: 13px; margin-top: 4px; }
    .brand { font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; opacity: .9; }
    .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 22px 0; }
    .kpi { border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 16px; text-align: center; }
    .kpi .v { font-size: 26px; font-weight: 800; }
    .kpi .l { font-size: 11px; color: ${COLORS.slate}; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: .03em; }
    .charts { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
    .chart { flex: 1; min-width: 240px; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .chart-title { font-size: 13px; font-weight: 700; margin-bottom: 8px; align-self: flex-start; }
    .leyenda { margin-top: 10px; width: 100%; }
    .leg { font-size: 12px; color: ${COLORS.navy}; margin: 3px 0; display: flex; align-items: center; }
    .dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; margin-right: 7px; }
    h2.sec { font-size: 15px; font-weight: 800; margin: 18px 0 10px; }
    .day { border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; }
    .day-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .day-head .t { font-weight: 800; font-size: 14px; }
    .day-head .s { font-size: 12px; color: ${COLORS.slate}; }
    .tag { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; color: #fff; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    td { padding: 5px 0; border-top: 1px solid ${COLORS.light}; }
    td.r { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
    td .meta { color: ${COLORS.slate}; font-size: 11px; }
    .bar { height: 8px; background: ${COLORS.light}; border-radius: 999px; overflow: hidden; margin-top: 4px; }
    .bar > div { height: 100%; background: ${COLORS.primary}; border-radius: 999px; }
    .wk { margin-bottom: 12px; }
    .wk .top { display: flex; justify-content: space-between; font-size: 13px; }
    .foot { margin-top: 24px; text-align: center; font-size: 11px; color: ${COLORS.slate}; }
    @media print { .page { padding: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>`
}

function abrirImpresion(html: string) {
  const w = window.open('', '_blank')
  if (!w) {
    alert('Permití las ventanas emergentes para descargar el reporte.')
    return
  }
  w.document.open()
  w.document.write(html)
  w.document.close()
  // Espera al render antes de imprimir
  w.onload = () => {
    w.focus()
    w.print()
  }
  setTimeout(() => {
    try {
      w.focus()
      w.print()
    } catch {
      /* noop */
    }
  }, 600)
}

export function exportarReporteSemanaPDF(
  rep: ReporteSemana,
  comidasCount: number
) {
  const volFuerza = rep.dias
    .filter((d) => d.tipo === 'FUERZA')
    .reduce((a, d) => a + d.volumen, 0)
  const volHiper = rep.dias
    .filter((d) => d.tipo === 'HIPERTROFIA')
    .reduce((a, d) => a + d.volumen, 0)

  const diasHtml = rep.dias
    .map((d) => {
      const color = d.tipo === 'FUERZA' ? COLORS.primary : COLORS.accent
      const filas = d.ejercicios
        .map((ex) => {
          const val = ex.pesos.length ? ex.pesos.join('/') : '—'
          return `<tr><td>${ex.completado ? '✓' : '·'} ${ex.nombre}<div class="meta">${ex.series} series · ${ex.repsLabel}</div></td><td class="r">${val} ${ex.unidad}</td></tr>`
        })
        .join('')
      return `
        <div class="day">
          <div class="day-head">
            <div><div class="t">${d.titulo}</div><div class="s">${d.nombre} · ${fmtFecha(d.fecha)}</div></div>
            <span class="tag" style="background:${color}">${d.entrenado ? '✔ entrenado' : `${d.ejerciciosCompletados}/${d.totalEjercicios}`}</span>
          </div>
          <table>${filas}</table>
        </div>`
    })
    .join('')

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
    <title>Reporte Semana ${rep.semana}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    ${styles()}</head>
    <body><div class="page">
      <div class="header">
        <div><h1>Reporte Semanal</h1><p>Semana ${rep.semana} · ${fmtFecha(rep.fechaDesde)}${rep.fechaHasta && rep.fechaHasta !== rep.fechaDesde ? ' → ' + fmtFecha(rep.fechaHasta) : ''}</p></div>
        <div class="brand">Mi Rutina · Juan</div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="v">${rep.diasEntrenados}/5</div><div class="l">Días entrenados</div></div>
        <div class="kpi"><div class="v">${fmt(rep.ejerciciosCompletados)}</div><div class="l">Ejercicios</div></div>
        <div class="kpi"><div class="v">${fmt(rep.volumenTotal)}</div><div class="l">Volumen (kg)</div></div>
      </div>
      <div class="charts">
        ${donut([{ label: 'Entrenados', value: rep.diasEntrenados, color: COLORS.emerald }, { label: 'Restantes', value: Math.max(0, 5 - rep.diasEntrenados), color: COLORS.border }], 'Cumplimiento de días')}
        ${donut([{ label: 'Fuerza', value: volFuerza, color: COLORS.primary }, { label: 'Hipertrofia', value: volHiper, color: COLORS.accent }], 'Volumen por tipo (kg)')}
      </div>
      <h2 class="sec">Detalle por día</h2>
      ${diasHtml}
      <h2 class="sec">Comidas registradas</h2>
      <div class="day"><b>${comidasCount}</b> comidas registradas en el período.</div>
      <div class="foot">Generado por Mi Rutina · ${new Date().toLocaleString('es-AR')}</div>
    </div></body></html>`

  abrirImpresion(html)
}

export function exportarReporteMesPDF(rep: ReporteMes, comidasCount: number) {
  const volFuerza = rep.detalleSemanas
    .flatMap((s) => s.dias)
    .filter((d) => d.tipo === 'FUERZA')
    .reduce((a, d) => a + d.volumen, 0)
  const volHiper = rep.detalleSemanas
    .flatMap((s) => s.dias)
    .filter((d) => d.tipo === 'HIPERTROFIA')
    .reduce((a, d) => a + d.volumen, 0)

  const semanasHtml = rep.detalleSemanas
    .map((s) => {
      const pct = Math.round((s.diasEntrenados / 5) * 100)
      return `<div class="wk"><div class="top"><span><b>Semana ${s.semana}</b></span><span>${s.diasEntrenados}/5 días · ${fmt(s.volumenTotal)} kg</span></div><div class="bar"><div style="width:${pct}%"></div></div></div>`
    })
    .join('')

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
    <title>Reporte Mes ${rep.mes}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    ${styles()}</head>
    <body><div class="page">
      <div class="header">
        <div><h1>Reporte Mensual</h1><p>Mes ${rep.mes} · semanas ${rep.semanas.join(', ')}</p></div>
        <div class="brand">Mi Rutina · Juan</div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="v">${fmt(rep.diasEntrenados)}</div><div class="l">Días entrenados</div></div>
        <div class="kpi"><div class="v">${fmt(rep.ejerciciosCompletados)}</div><div class="l">Ejercicios</div></div>
        <div class="kpi"><div class="v">${fmt(rep.volumenTotal)}</div><div class="l">Volumen (kg)</div></div>
      </div>
      <div class="charts">
        ${donut([{ label: 'Entrenados', value: rep.diasEntrenados, color: COLORS.emerald }, { label: 'Restantes', value: Math.max(0, 20 - rep.diasEntrenados), color: COLORS.border }], 'Cumplimiento (de 20 días)')}
        ${donut([{ label: 'Fuerza', value: volFuerza, color: COLORS.primary }, { label: 'Hipertrofia', value: volHiper, color: COLORS.accent }], 'Volumen por tipo (kg)')}
      </div>
      <h2 class="sec">Detalle por semana</h2>
      ${semanasHtml}
      <h2 class="sec">Comidas registradas</h2>
      <div class="day"><b>${comidasCount}</b> comidas registradas en el mes.</div>
      <div class="foot">Generado por Mi Rutina · ${new Date().toLocaleString('es-AR')}</div>
    </div></body></html>`

  abrirImpresion(html)
}
