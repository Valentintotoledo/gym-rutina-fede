import { motion } from 'framer-motion'
import { Beef, Sun, Dumbbell, Moon } from 'lucide-react'
import { Card } from '@/components/ui/card'

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
      'Algo de verdura',
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
      'Más verduras en proporción',
    ],
    nota: 'Misma cantidad de carne/pollo que el almuerzo, pero con menos carbos y más verdura.',
  },
]

export function ComidasView() {
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

      <Card className="p-4">
        <p className="text-sm font-semibold">Resumen del día</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>🥩 ~600 g de carne/pollo (almuerzo + cena)</li>
          <li>🍝 Carbohidratos sobre todo al mediodía</li>
          <li>🥚 5 huevos post-entreno</li>
          <li>🥑 Grasas: palta · 🍌 fruta pre-entreno</li>
        </ul>
      </Card>
    </motion.div>
  )
}
