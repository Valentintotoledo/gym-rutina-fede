import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Beef,
  Sun,
  Dumbbell,
  Moon,
  Cookie,
  Camera,
  Check,
  Trash2,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useComidas } from '@/hooks/useComidas'
import { fileToCompressedDataURL, type FoodEntry } from '@/lib/comidas'

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

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDiaTitulo(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export function ComidasView() {
  const { entries, addEntry, removeEntry } = useComidas()

  // Agrupa el historial por día (clave YYYY-MM-DD)
  const porDia = useMemo(() => {
    const map = new Map<string, FoodEntry[]>()
    for (const e of entries) {
      const k = e.fecha.slice(0, 10)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(e)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [entries])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Comidas</h1>
        <p className="text-sm text-muted-foreground">
          Registrá cada comida del día con foto y descripción
        </p>
      </div>

      <div className="space-y-3">
        {COMIDAS.map((c) => (
          <MealCard
            key={c.id}
            comida={c}
            onGuardar={(desc, foto) =>
              addEntry(c.id, c.titulo, desc, foto)
            }
          />
        ))}
      </div>

      {/* Recopilación por fecha */}
      <div>
        <h2 className="mb-2 text-lg font-extrabold tracking-tight">
          Historial
        </h2>
        {porDia.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Todavía no registraste comidas. Cargá lo que comiste en cada
              comida de arriba y se va a ir juntando acá por fecha.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {porDia.map(([dia, items]) => (
              <div key={dia}>
                <p className="mb-2 text-sm font-bold capitalize text-muted-foreground">
                  {fmtDiaTitulo(items[0].fecha)}
                </p>
                <div className="space-y-2">
                  {items.map((e) => (
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
                          <p className="text-sm font-semibold">
                            {e.descripcion}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {fmtFecha(e.fecha)}
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
              </div>
            ))}
          </div>
        )}
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
  const fileRef = useRef<HTMLInputElement>(null)

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

  const guardar = () => {
    if (!desc.trim() && !foto) return
    onGuardar(desc || titulo, foto)
    setDesc('')
    setFoto(undefined)
    if (fileRef.current) fileRef.current.value = ''
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
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
              onClick={() => {
                setFoto(undefined)
                if (fileRef.current) fileRef.current.value = ''
              }}
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={cargando}
            onClick={() => fileRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            {cargando ? 'Procesando…' : 'Foto'}
          </Button>
          <Button
            size="sm"
            className="flex-1"
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
      </div>
    </Card>
  )
}
