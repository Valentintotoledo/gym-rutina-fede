import { useState } from 'react'
import { Dumbbell, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { login } from '@/lib/auth'

export function Login({ onLogin }: { onLogin: () => void }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(usuario, clave)) {
      setError(false)
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mi Rutina</h1>
          <p className="text-sm text-muted-foreground">Ingresá para continuar</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">
              Usuario o contraseña incorrectos.
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
