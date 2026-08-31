import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Button, ErrorBanner, Field, Input, LeafIcon } from '../components/ui'
import { fieldError } from '../lib/format'

export function LoginPage() {
  const { login, error } = useAuth()
  const [email, setEmail] = useState('admin@farmixpro.test')
  const [password, setPassword] = useState('password')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setFieldErrors(null)
    try {
      await login(email, password)
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.errors)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthScreen title="Iniciar sesión" subtitle="Entra a tu panel de facturación inteligente.">
      <ErrorBanner message={error} />
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <Field label="Correo" error={fieldError(fieldErrors, 'email')}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Contraseña" error={fieldError(fieldErrors, 'password')}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-lime hover:underline">
          Crear cuenta
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-muted">Prueba: admin@farmixpro.test / password</p>
    </AuthScreen>
  )
}

export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="circuit-bg grid min-h-screen place-items-center bg-app px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/15 text-lime glow-lime">
            <LeafIcon className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xl font-semibold">FarmixPro</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Facturación inteligente</p>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
