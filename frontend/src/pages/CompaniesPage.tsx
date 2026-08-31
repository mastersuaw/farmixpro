import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { companiesApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Pagination, Table } from '../components/ui'
import { fieldError } from '../lib/format'
import type { Company } from '../api/types'

export function CompaniesPage() {
  const { company, switchCompany, refresh } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Company> | null>(null)
  const [form, setForm] = useState({ name: '', address: '' })
  const [invite, setInvite] = useState<{ id: number; email: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const list = useQuery({ queryKey: ['companies', page], queryFn: () => companiesApi.list(page) })

  const save = useMutation({
    mutationFn: () => {
      const payload = { name: form.name, address: form.address || undefined }
      return editing?.id ? companiesApi.update(editing.id, payload) : companiesApi.create(payload)
    },
    onSuccess: async () => {
      setEditing(null)
      await refresh()
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const attach = useMutation({
    mutationFn: () => companiesApi.attachUser(invite!.id, { email: invite!.email }),
    onSuccess: () => {
      setInvite(null)
      setBanner('Usuario vinculado.')
    },
    onError: (err: unknown) => setBanner(err instanceof ApiError ? err.message : 'No se pudo vincular.'),
  })

  function open(item?: Company) {
    setEditing(item ?? {})
    setForm(item ? { name: item.name, address: item.address ?? '' } : { name: '', address: '' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader title="Empresas" subtitle="Cambia, crea o edita las empresas a las que perteneces." actions={<Button onClick={() => open()}>Nueva empresa</Button>} />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay empresas" action={<Button onClick={() => open()}>Nueva empresa</Button>} />
      ) : (
        <Table headers={['Nombre', 'Dirección', 'Estado', '']}>
          {(list.data?.data ?? []).map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3 text-muted">{item.address || '—'}</td>
              <td className="px-4 py-3">{company?.id === item.id ? <span className="text-lime">Actual</span> : '—'}</td>
              <td className="px-4 py-3 text-right">
                {company?.id !== item.id ? (
                  <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => void switchCompany(item.id)}>Usar</Button>
                ) : null}
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(item)}>Editar</Button>
                <Button variant="ghost" className="!py-1.5 text-xs" onClick={() => setInvite({ id: item.id, email: '' })}>Vincular</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar empresa' : 'Nueva empresa'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'name')}><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Dirección" error={fieldError(errors, 'address')}><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
      {invite ? (
        <Modal title="Vincular usuario" onClose={() => setInvite(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); attach.mutate() }} className="space-y-3">
            <Field label="Correo del usuario">
              <Input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} required />
            </Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setInvite(null)}>Cancelar</Button><Button type="submit">Vincular</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
