import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { customersApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Table } from '../components/ui'
import { fieldError } from '../lib/format'
import type { Customer } from '../api/types'

const empty = { nombre: '', card_id: '', direccion: '', telefono: '' }

export function CustomersPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Customer> | null>(null)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const list = useQuery({
    queryKey: ['customers', company?.id, page],
    queryFn: () => customersApi.list(page),
  })

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        nombre: form.nombre,
        card_id: form.card_id || undefined,
        direccion: form.direccion || undefined,
        telefono: form.telefono || undefined,
      }
      return editing?.id ? customersApi.update(editing.id, payload) : customersApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => customersApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['customers'] }),
    onError: (err: unknown) => setBanner(err instanceof ApiError ? err.message : 'No se pudo eliminar.'),
  })

  function open(customer?: Customer) {
    setBanner(null)
    setErrors(null)
    setEditing(customer ?? {})
    setForm(customer ? { nombre: customer.nombre, card_id: customer.card_id ?? '', direccion: customer.direccion ?? '', telefono: customer.telefono ?? '' } : empty)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    save.mutate()
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gestiona los clientes de tu empresa."
        actions={<Button onClick={() => open()}>Nuevo cliente</Button>}
      />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay clientes" hint="Crea el primero para poder facturar." action={<Button onClick={() => open()}>Nuevo cliente</Button>} />
      ) : (
        <Table headers={['Nombre', 'Documento', 'Dirección', 'Teléfono', '']}>
          {(list.data?.data ?? []).map((customer) => (
            <tr key={customer.id} className="text-soft">
              <td className="px-4 py-3 font-medium text-white">{customer.nombre}</td>
              <td className="px-4 py-3">{customer.card_id || '—'}</td>
              <td className="px-4 py-3">{customer.direccion || '—'}</td>
              <td className="px-4 py-3">{customer.telefono || '—'}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(customer)}>
                  Editar
                </Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar cliente?')) remove.mutate(customer.id) }}>
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => setEditing(null)}>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'nombre')}>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </Field>
            <Field label="Documento / CUIT" error={fieldError(errors, 'card_id')}>
              <Input value={form.card_id} onChange={(e) => setForm({ ...form, card_id: e.target.value })} />
            </Field>
            <Field label="Dirección" error={fieldError(errors, 'direccion')}>
              <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </Field>
            <Field label="Teléfono" error={fieldError(errors, 'telefono')}>
              <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Guardando…' : 'Guardar'}</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
