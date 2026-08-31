import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { channelsApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Table, Textarea } from '../components/ui'
import { fieldError } from '../lib/format'
import type { Channel } from '../api/types'

export function ChannelsPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Channel> | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const list = useQuery({ queryKey: ['channels', company?.id, page], queryFn: () => channelsApi.list(page) })
  const save = useMutation({
    mutationFn: () => {
      const payload = { name: form.name, description: form.description || undefined }
      return editing?.id ? channelsApi.update(editing.id, payload) : channelsApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['channels'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })
  const remove = useMutation({
    mutationFn: (id: number) => channelsApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['channels'] }),
  })

  function open(channel?: Channel) {
    setEditing(channel ?? {})
    setForm(channel ? { name: channel.name, description: channel.description ?? '' } : { name: '', description: '' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader title="Canales" subtitle="Puntos de venta y canales comerciales." actions={<Button onClick={() => open()}>Nuevo canal</Button>} />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay canales" action={<Button onClick={() => open()}>Nuevo canal</Button>} />
      ) : (
        <Table headers={['Nombre', 'Descripción', '']}>
          {(list.data?.data ?? []).map((channel) => (
            <tr key={channel.id}>
              <td className="px-4 py-3 font-medium">{channel.name}</td>
              <td className="px-4 py-3 text-muted">{channel.description || '—'}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(channel)}>Editar</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar canal?')) remove.mutate(channel.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar canal' : 'Nuevo canal'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'name')}><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Descripción" error={fieldError(errors, 'description')}><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
