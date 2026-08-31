import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { methodsApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Table } from '../components/ui'
import { fieldError } from '../lib/format'
import type { MethodPayment } from '../api/types'

export function MethodsPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<MethodPayment> | null>(null)
  const [nombre, setNombre] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const list = useQuery({ queryKey: ['methods', company?.id, page], queryFn: () => methodsApi.list(page) })
  const save = useMutation({
    mutationFn: () => (editing?.id ? methodsApi.update(editing.id, { nombre }) : methodsApi.create({ nombre })),
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['methods'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })
  const remove = useMutation({
    mutationFn: (id: number) => methodsApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['methods'] }),
  })

  return (
    <div>
      <PageHeader title="Métodos de pago" subtitle="Cómo reciben tus clientes las facturas." actions={<Button onClick={() => { setEditing({}); setNombre(''); setErrors(null) }}>Nuevo método</Button>} />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay métodos de pago" action={<Button onClick={() => setEditing({})}>Nuevo método</Button>} />
      ) : (
        <Table headers={['Nombre', '']}>
          {(list.data?.data ?? []).map((method) => (
            <tr key={method.id}>
              <td className="px-4 py-3 font-medium">{method.nombre}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => { setEditing(method); setNombre(method.nombre) }}>Editar</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar método?')) remove.mutate(method.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar método' : 'Nuevo método'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'nombre')}><Input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
