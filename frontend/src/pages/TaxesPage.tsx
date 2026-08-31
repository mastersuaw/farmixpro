import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { taxesApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Table } from '../components/ui'
import { fieldError } from '../lib/format'
import type { Tax } from '../api/types'

export function TaxesPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Tax> | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', tasa: '0' })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const list = useQuery({ queryKey: ['taxes', company?.id, page], queryFn: () => taxesApi.list(page) })
  const save = useMutation({
    mutationFn: () => {
      const payload = { nombre: form.nombre, descripcion: form.descripcion || undefined, tasa: Number(form.tasa) }
      return editing?.id ? taxesApi.update(editing.id, payload) : taxesApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['taxes'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })
  const remove = useMutation({
    mutationFn: (id: number) => taxesApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['taxes'] }),
    onError: (err: unknown) => setBanner(err instanceof ApiError ? err.message : 'No se pudo eliminar.'),
  })

  function open(tax?: Tax) {
    setErrors(null)
    setBanner(null)
    setEditing(tax ?? {})
    setForm(tax ? { nombre: tax.nombre, descripcion: tax.descripcion ?? '', tasa: String(tax.tasa) } : { nombre: '', descripcion: '', tasa: '0' })
  }

  return (
    <div>
      <PageHeader title="Impuestos" subtitle="Tasas que puedes aplicar a las facturas." actions={<Button onClick={() => open()}>Nuevo impuesto</Button>} />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay impuestos" action={<Button onClick={() => open()}>Nuevo impuesto</Button>} />
      ) : (
        <Table headers={['Nombre', 'Descripción', 'Tasa', '']}>
          {(list.data?.data ?? []).map((tax) => (
            <tr key={tax.id}>
              <td className="px-4 py-3 font-medium">{tax.nombre}</td>
              <td className="px-4 py-3 text-muted">{tax.descripcion || '—'}</td>
              <td className="px-4 py-3 text-lime">{Number(tax.tasa).toFixed(2)}%</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(tax)}>Editar</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar impuesto?')) remove.mutate(tax.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar impuesto' : 'Nuevo impuesto'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'nombre')}><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></Field>
            <Field label="Descripción" error={fieldError(errors, 'descripcion')}><Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Field>
            <Field label="Tasa %" error={fieldError(errors, 'tasa')}><Input type="number" step="0.01" value={form.tasa} onChange={(e) => setForm({ ...form, tasa: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
