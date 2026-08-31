import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { companiesApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, ErrorBanner, Field, Input, LeafIcon } from '../components/ui'
import { fieldError } from '../lib/format'
import { storage } from '../lib/storage'

export function SelectCompanyPage() {
  const { companies, company, switchCompany, refresh, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)
  const [pending, setPending] = useState(false)

  async function createCompany(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors(null)
    try {
      const res = await companiesApi.create({ name, address })
      storage.setCompanyId(res.data.id)
      await refresh()
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.errors)
      }
    } finally {
      setPending(false)
    }
  }

  async function choose(id: number) {
    setError(null)
    try {
      await switchCompany(id)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cambiar de empresa.')
    }
  }

  return (
    <div className="circuit-bg grid min-h-screen place-items-center bg-app px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime/15 text-lime">
            <LeafIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Selecciona o crea una empresa</h1>
            <p className="text-sm text-muted">Necesitas una empresa actual para usar facturación y catálogos.</p>
          </div>
        </div>
        <ErrorBanner message={error} />
        {companies.length ? (
          <div className="mb-6 space-y-2">
            {companies.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void choose(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                  company?.id === item.id ? 'border-lime bg-lime/10 text-lime' : 'border-line bg-panel text-white'
                }`}
              >
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-xs text-muted">{item.address || 'Sin dirección'}</span>
                </span>
                <span className="text-xs text-muted">Usar</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-4 text-sm text-muted">Aún no tienes empresas. Crea la primera para continuar.</p>
        )}
        <form onSubmit={(e) => void createCompany(e)} className="glass-panel space-y-4 rounded-2xl p-5">
          <h2 className="font-medium">Nueva empresa</h2>
          <Field label="Nombre" error={fieldError(fieldErrors, 'name')}>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Dirección" error={fieldError(fieldErrors, 'address')}>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? 'Creando…' : 'Crear y continuar'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => void logout()}>
              Cerrar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
