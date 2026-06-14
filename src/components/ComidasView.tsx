import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Beef,
  Sun,
  Dumbbell,
  Moon,
  Cookie,
  Camera,
  Plus,
  Trash2,
  X,
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

function fmtFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ComidasView() {
  const { entries, addEntry, removeEntry } = useComidas()
  const [desc, setDesc] = useState('')
  const [foto, setFoto] = useState<string | undefined>(undefined)
  const [cargando, setCargando] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const onPickFile = async (file?: File) => {
    if (!file) return
    setCargando(true)
    try {
      const dataUrl = await fileToCompressedDataURL(file)
      setFoto(dataUrl)
    } catch {
      /* noop */
    } finally {
      setCargando(false)
    }
  }

  const onGuardar = () => {
    if (!desc.trim() && !foto) return
    addEntry(desc || 'Comida sin descripción', foto)
    setDesc('')
    setFoto(undefined)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Comidas</h1>
        <p className="text-sm text-muted-foreground">
          Tu plan de alimentación del día
        </p>
      </div>

      <div className="space-y-3">
        {COMIDAS.map(({ id, titulo, momento, icon: Icon, tone, items, nota }) => (
          <Card key={id} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold leading-tight">
                  {titulo}
                </h2>
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
          </Card>
        ))}
      </div>

      {/* Registro de comidas con foto */}
      <div>
        <h2 className="mb-2 text-lg font-extrabold tracking-tight">
          Registro de comidas
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Subí una foto y describí lo que comiste para dejarlo registrado.
        </p>

        <Card className="space-y-3 p-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />

          {foto ? (
            <div className="relative">
              <img
                src={foto}
                alt="Comida"
                className="max-h-64 w-full rounded-xl object-cover"
              />
              <button
                onClick={() => {
                  setFoto(undefined)
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="Quitar foto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={cargando}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/50 py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Camera className="h-7 w-7" />
              <span className="text-sm font-semibold">
                {cargando ? 'Procesando…' : 'Agregar foto'}
              </span>
            </button>
          )}

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="¿Qué comiste? Ej: 300g pollo + boniato + brócoli"
            rows={2}
            className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <Button
            onClick={onGuardar}
            disabled={!desc.trim() && !foto}
            className="w-full"
          >
            <Plus className="h-5 w-5" /> Guardar comida
          </Button>
        </Card>

        {/* Lista de comidas registradas */}
        {entries.length > 0 && (
          <div className="mt-4 space-y-3">
            {entries.map((e) => (
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
                    <p className="text-sm font-semibold">{e.descripcion}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {fmtFecha(e.fecha)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeEntry(e.id)}
                    aria-label="Borrar comida"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold">Resumen del día</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>🥩 ~600 g de carne/pollo (almuerzo + cena)</li>
          <li>🍝 Carbohidratos sobre todo al mediodía</li>
          <li>🥚 5 huevos post-entreno</li>
          <li>🥦 Verdura verde: brócoli / espárragos</li>
          <li>🍫 Postre dulce post-cena (1 opción)</li>
        </ul>
      </Card>
    </motion.div>
  )
}
