import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { currenciesApi, historyCurrenciesApi } from '../api/resources'
import type { Currency } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Select, Table } from '../components/ui'
import { fieldError, today } from '../lib/format'

export function CurrenciesPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [histPage, setHistPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Currency> | null>(null)
  const [rateOpen, setRateOpen] = useState(false)
  const [form, setForm] = useState({ codigo: '', nombre: '', tasa: '1' })
  const [rate, setRate] = useState({ monedas_id: '', tasa: '1', fecha: today() })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const list = useQuery({ queryKey: ['currencies', company?.id, page], queryFn: () => currenciesApi.list(page, 50) })
  const history = useQuery({ queryKey: ['history-currencies', histPage], queryFn: () => historyCurrenciesApi.list(histPage) })

  const save = useMutation({
    mutationFn: () => {
      const payload = { codigo: form.codigo, nombre: form.nombre, tasa: Number(form.tasa) }
      return editing?.id ? currenciesApi.update(editing.id, payload) : currenciesApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['currencies'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const saveRate = useMutation({
    mutationFn: () => historyCurrenciesApi.create({ monedas_id: Number(rate.monedas_id), tasa: Number(rate.tasa), fecha: rate.fecha }),
    onSuccess: () => {
      setRateOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['history-currencies'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  function open(item?: Currency) {
    setEditing(item ?? {})
    setForm(item ? { codigo: item.codigo, nombre: item.nombre, tasa: String(item.tasa) } : { codigo: '', nombre: '', tasa: '1' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader
        title="Catálogo de monedas"
        subtitle="Monedas globales e historial de tasas (history_currencies)."
        actions={
          <>
            <Button variant="ghost" onClick={() => { setRateOpen(true); setErrors(null) }}>Nueva tasa</Button>
            <Button onClick={() => open()}>Nueva moneda</Button>
          </>
        }
      />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : history.error instanceof ApiError ? history.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay monedas" action={<Button onClick={() => open()}>Nueva moneda</Button>} />
      ) : (
        <Table headers={['Código', 'Nombre', 'Tasa', '']}>
          {(list.data?.data ?? []).map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-lime">{item.codigo}</td>
              <td className="px-4 py-3">{item.nombre}</td>
              <td className="px-4 py-3">{item.tasa}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="!py-1.5 text-xs" onClick={() => open(item)}>Editar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Historial de tasas</h2>
      <Table headers={['ID', 'Moneda', 'Tasa', 'Fecha']}>
        {(history.data?.data ?? []).map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3 text-lime">{item.id}</td>
            <td className="px-4 py-3">{item.currency?.codigo ?? item.monedas_id}</td>
            <td className="px-4 py-3">{item.tasa}</td>
            <td className="px-4 py-3">{item.fecha}</td>
          </tr>
        ))}
      </Table>
      <Pagination meta={history.data?.meta} onPage={setHistPage} />

      {editing ? (
        <Modal title={editing.id ? 'Editar moneda' : 'Nueva moneda'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Código" error={fieldError(errors, 'codigo')}><Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required /></Field>
            <Field label="Nombre" error={fieldError(errors, 'nombre')}><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></Field>
            <Field label="Tasa" error={fieldError(errors, 'tasa')}><Input type="number" step="0.0001" value={form.tasa} onChange={(e) => setForm({ ...form, tasa: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}

      {rateOpen ? (
        <Modal title="Nueva tasa histórica" onClose={() => setRateOpen(false)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); saveRate.mutate() }} className="space-y-3">
            <Field label="Moneda" error={fieldError(errors, 'monedas_id')}>
              <Select value={rate.monedas_id} onChange={(e) => setRate({ ...rate, monedas_id: e.target.value })} required>
                <option value="">Selecciona</option>
                {(list.data?.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.codigo} — {c.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Tasa" error={fieldError(errors, 'tasa')}><Input type="number" step="0.0001" value={rate.tasa} onChange={(e) => setRate({ ...rate, tasa: e.target.value })} required /></Field>
            <Field label="Fecha" error={fieldError(errors, 'fecha')}><Input type="date" value={rate.fecha} onChange={(e) => setRate({ ...rate, fecha: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setRateOpen(false)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
