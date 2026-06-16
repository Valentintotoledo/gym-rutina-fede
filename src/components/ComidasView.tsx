import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Beef,
  Sun,
  Dumbbell,
  Moon,
  Cookie,
  Camera,
  Images,
  Check,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useComidas } from '@/hooks/useComidas'
import { fileToCompressedDataURL } from '@/lib/comidas'

interface Comida {
  id: string
  titulo: string
  momento: string
  icon: typeof Beef
  tone: string
  items: string[]
  nota?: string
}

const COMIDAS: Comida[] = [
  {
    id: 'almuerzo',
    titulo: 'Almuerzo',
    momento: 'Mediodía · corte del ayuno, después de trabajar',
    icon: Sun,
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    items: [
      '300 g de carne o pollo',
      '½ plato de carbohidratos (fideos, papa, boniato o batata)',
      'Verdura verde (brócoli, espárragos o algún verde)',
      'Jugo de naranja',
    ],
  },
  {
    id: 'pre-entreno',
    titulo: 'Pre-entreno',
    momento: 'Antes de ir a entrenar',
    icon: Dumbbell,
    tone: 'bg-primary/10 text-primary',
    items: ['1 banana con un poco de miel'],
  },
  {
    id: 'post-entreno',
    titulo: 'Post-entreno',
    momento: 'Al volver de entrenar',
    icon: Beef,
    tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    items: ['5 huevos', '3 galletas de arroz', 'Un poco de palta'],
  },
  {
    id: 'cena',
    titulo: 'Cena',
    momento: 'Noche',
    icon: Moon,
    tone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    items: [
      '300 g de carne o pollo',
      'Menos carbohidratos',
      'Verdura verde (brócoli, espárragos o algún verde)',
    ],
    nota: 'Misma cantidad de carne/pollo que el almuerzo, pero con menos carbos y más verdura.',
  },
  {
    id: 'postre',
    titulo: 'Postre',
    momento: 'Post-cena · algo dulce',
    icon: Cookie,
    tone: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    items: [
      '2 galletas de arroz con banana y miel, o',
      'Una porción de ananá, o',
      'Yogurt griego con granola',
    ],
    nota: 'Elegí una de las tres opciones.',
  },
]

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** Fecha local en formato YYYY-MM-DD (sin saltos de zona horaria). */
function toDateStr(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDiaLargo(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export function ComidasView() {
  const { entries, addEntry, removeEntry } = useComidas()
  const hoy = toDateStr(new Date())
  const [sel, setSel] = useState(hoy)
  const [mesView, setMesView] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  // Cantidad de comidas por día (clave YYYY-MM-DD), para los puntos del calendario
  const conteoPorDia = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of entries) {
      const k = e.fecha.slice(0, 10)
      map.set(k, (map.get(k) ?? 0) + 1)
    }
    return map
  }, [entries])

  // Comidas del día seleccionado
  const delDia = useMemo(
    () =>
      entries
        .filter((e) => e.fecha.slice(0, 10) === sel)
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [entries, sel]
  )

  const registrar = (c: Comida, desc: string, foto?: string) => {
    // Hoy → con la hora actual; otro día → mediodía para mantener el orden
    const iso =
      sel === hoy
        ? new Date().toISOString()
        : new Date(`${sel}T12:00:00`).toISOString()
    addEntry(c.id, c.titulo, desc, foto, iso)
  }

  // Construcción de la grilla del mes
  const year = mesView.getFullYear()
  const month = mesView.getMonth()
  const primerDia = new Date(year, month, 1)
  const offset = (primerDia.getDay() + 6) % 7 // lunes = 0
  const diasEnMes = new Date(year, month + 1, 0).getDate()
  const celdas: (string | null)[] = []
  for (let i = 0; i < offset; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(toDateStr(new Date(year, month, d)))

  const irMes = (delta: number) =>
    setMesView(new Date(year, month + delta, 1))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Comidas</h1>
        <p className="text-sm text-muted-foreground">
          Elegí un día del calendario y registrá lo que comiste
        </p>
      </div>

      {/* Calendario */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => irMes(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-extrabold capitalize">
            {MESES[month]} {year}
          </p>
          <button
            onClick={() => irMes(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DOW.map((d, i) => (
            <div
              key={i}
              className="pb-1 text-center text-[11px] font-bold text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {celdas.map((dateStr, i) => {
            if (!dateStr) return <div key={i} />
            const n = conteoPorDia.get(dateStr) ?? 0
            const esHoy = dateStr === hoy
            const activo = dateStr === sel
            const futuro = dateStr > hoy
            return (
              <button
                key={i}
                disabled={futuro}
                onClick={() => setSel(dateStr)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  activo
                    ? 'bg-primary text-primary-foreground'
                    : futuro
                      ? 'text-muted-foreground/30'
                      : esHoy
                        ? 'bg-secondary text-foreground'
                        : 'text-foreground hover:bg-secondary'
                }`}
              >
                {Number(dateStr.slice(8, 10))}
                {n > 0 && (
                  <span
                    className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                      activo ? 'bg-primary-foreground' : 'bg-primary'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Día seleccionado */}
      <div>
        <p className="text-sm font-bold capitalize">
          {sel === hoy ? 'Hoy · ' : ''}
          {fmtDiaLargo(sel)}
        </p>
        <p className="text-xs text-muted-foreground">
          {delDia.length === 0
            ? 'Sin comidas registradas este día'
            : `${delDia.length} comida${delDia.length === 1 ? '' : 's'} registrada${delDia.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {/* Comidas registradas del día */}
      {delDia.length > 0 && (
        <div className="space-y-2">
          {delDia.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              {e.foto && (
                <img
                  src={e.foto}
                  alt={e.descripcion}
                  className="max-h-56 w-full object-cover"
                />
              )}
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {e.comidaLabel}
                  </p>
                  <p className="text-sm font-semibold">{e.descripcion}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {fmtHora(e.fecha)} hs
                  </p>
                </div>
                <button
                  onClick={() => removeEntry(e.id)}
                  aria-label="Borrar"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Registrar comidas para el día seleccionado */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold tracking-tight">
          Registrar comida
        </h2>
        {COMIDAS.map((c) => (
          <MealCard
            key={c.id}
            comida={c}
            onGuardar={(desc, foto) => registrar(c, desc, foto)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function MealCard({
  comida,
  onGuardar,
}: {
  comida: Comida
  onGuardar: (desc: string, foto?: string) => void
}) {
  const { titulo, momento, icon: Icon, tone, items, nota } = comida
  const [desc, setDesc] = useState('')
  const [foto, setFoto] = useState<string | undefined>(undefined)
  const [cargando, setCargando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const camaraRef = useRef<HTMLInputElement>(null)
  const galeriaRef = useRef<HTMLInputElement>(null)

  const onPickFile = async (file?: File) => {
    if (!file) return
    setCargando(true)
    try {
      setFoto(await fileToCompressedDataURL(file))
    } catch {
      /* noop */
    } finally {
      setCargando(false)
    }
  }

  const limpiarFoto = () => {
    setFoto(undefined)
    if (camaraRef.current) camaraRef.current.value = ''
    if (galeriaRef.current) galeriaRef.current.value = ''
  }

  const guardar = () => {
    if (!desc.trim() && !foto) return
    onGuardar(desc || titulo, foto)
    setDesc('')
    limpiarFoto()
    setGuardado(true)
    window.setTimeout(() => setGuardado(false), 1600)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold leading-tight">{titulo}</h2>
          <p className="text-xs text-muted-foreground">{momento}</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>

      {nota && (
        <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
          {nota}
        </p>
      )}

      {/* Registrar esta comida */}
      <div className="mt-3 space-y-2 border-t border-border pt-3">
        {/* Cámara (abre la cámara en el celular) */}
        <input
          ref={camaraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPickFile(e.target.files?.[0])}
        />
        {/* Galería (elegir foto existente) */}
        <input
          ref={galeriaRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPickFile(e.target.files?.[0])}
        />

        {foto && (
          <div className="relative">
            <img
              src={foto}
              alt="Comida"
              className="max-h-48 w-full rounded-xl object-cover"
            />
            <button
              onClick={limpiarFoto}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Quitar foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={`¿Qué comiste en ${titulo.toLowerCase()}?`}
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={cargando}
            onClick={() => camaraRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            {cargando ? '…' : 'Cámara'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={cargando}
            onClick={() => galeriaRef.current?.click()}
          >
            <Images className="h-4 w-4" />
            {cargando ? '…' : 'Galería'}
          </Button>
        </div>

        <Button
          size="sm"
          className="w-full"
          disabled={!desc.trim() && !foto}
          onClick={guardar}
        >
          {guardado ? (
            <>
              <Check className="h-4 w-4" /> Guardado
            </>
          ) : (
            'Registrar comida'
          )}
        </Button>
      </div>
    </Card>
  )
}
