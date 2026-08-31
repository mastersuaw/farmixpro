import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Button, ErrorBanner, Field, Input } from '../components/ui'
import { fieldError } from '../lib/format'
import { AuthScreen } from './LoginPage'

export function RegisterPage() {
  const { register, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setFieldErrors(null)
    try {
      await register(name, email, password, confirmation)
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.errors)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthScreen title="Crear cuenta" subtitle="Regístrate para empezar a facturar.">
      <ErrorBanner message={error} />
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <Field label="Nombre" error={fieldError(fieldErrors, 'name')}>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Correo" error={fieldError(fieldErrors, 'email')}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Contraseña" error={fieldError(fieldErrors, 'password')}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </Field>
        <Field label="Confirmar contraseña" error={fieldError(fieldErrors, 'password_confirmation')}>
          <Input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Creando…' : 'Crear cuenta'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-lime hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthScreen>
  )
}
