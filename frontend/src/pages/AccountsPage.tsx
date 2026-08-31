import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { accountsApi, balancesApi } from '../api/resources'
import type { Account, BalanceCuenta, TipoReferencia } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, Money, PageHeader, Pagination, Select, Table } from '../components/ui'
import { fieldError } from '../lib/format'

export function AccountsPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [balancePage, setBalancePage] = useState(1)
  const [editing, setEditing] = useState<Partial<Account> | null>(null)
  const [movement, setMovement] = useState(false)
  const [form, setForm] = useState({ nombre: '', codigo: '', descripcion: '', parent_id: '' })
  const [bal, setBal] = useState({ cuentas_id: '', referencia: '', tipo_referencia: 'invoice' as TipoReferencia, debito: '0', credito: '0', fecha: new Date().toISOString().slice(0, 10) })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const list = useQuery({ queryKey: ['accounts', company?.id, page], queryFn: () => accountsApi.list(page, 50) })
  const balances = useQuery({ queryKey: ['balances', company?.id, balancePage], queryFn: () => balancesApi.list(balancePage) })

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        nombre: form.nombre,
        codigo: form.codigo || undefined,
        descripcion: form.descripcion || undefined,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
      }
      return editing?.id ? accountsApi.update(editing.id, payload) : accountsApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const saveBal = useMutation({
    mutationFn: () =>
      balancesApi.create({
        cuentas_id: Number(bal.cuentas_id),
        referencia: bal.referencia || undefined,
        tipo_referencia: bal.tipo_referencia,
        debito: Number(bal.debito),
        credito: Number(bal.credito),
        fecha: bal.fecha,
      }),
    onSuccess: () => {
      setMovement(false)
      void queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => accountsApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })

  function open(account?: Account) {
    setEditing(account ?? {})
    setForm(account ? { nombre: account.nombre, codigo: account.codigo ?? '', descripcion: account.descripcion ?? '', parent_id: account.parent_id ? String(account.parent_id) : '' } : { nombre: '', codigo: '', descripcion: '', parent_id: '' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader
        title="Cuentas"
        subtitle="Plan de cuentas y movimientos de balance."
        actions={
          <>
            <Button variant="ghost" onClick={() => { setMovement(true); setErrors(null) }}>Nuevo movimiento</Button>
            <Button onClick={() => open()}>Nueva cuenta</Button>
          </>
        }
      />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : balances.error instanceof ApiError ? balances.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay cuentas" action={<Button onClick={() => open()}>Nueva cuenta</Button>} />
      ) : (
        <Table headers={['Código', 'Nombre', 'Padre', 'Descripción', '']}>
          {(list.data?.data ?? []).map((account) => (
            <tr key={account.id}>
              <td className="px-4 py-3 text-lime">{account.codigo || '—'}</td>
              <td className="px-4 py-3 font-medium">{account.nombre}</td>
              <td className="px-4 py-3 text-muted">{account.parent_id ?? '—'}</td>
              <td className="px-4 py-3 text-muted">{account.descripcion || '—'}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(account)}>Editar</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar cuenta?')) remove.mutate(account.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Movimientos</h2>
      <Table headers={['Fecha', 'Cuenta', 'Referencia', 'Tipo', 'Débito', 'Crédito']}>
        {(balances.data?.data ?? []).map((item: BalanceCuenta) => (
          <tr key={item.id}>
            <td className="px-4 py-3">{String(item.fecha).slice(0, 10)}</td>
            <td className="px-4 py-3">{item.account?.nombre ?? item.cuentas_id}</td>
            <td className="px-4 py-3 text-muted">{item.referencia || '—'}</td>
            <td className="px-4 py-3">{item.tipo_referencia}</td>
            <td className="px-4 py-3"><Money value={item.debito} /></td>
            <td className="px-4 py-3"><Money value={item.credito} /></td>
          </tr>
        ))}
      </Table>
      <Pagination meta={balances.data?.meta} onPage={setBalancePage} />

      {editing ? (
        <Modal title={editing.id ? 'Editar cuenta' : 'Nueva cuenta'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'nombre')}><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></Field>
            <Field label="Código" error={fieldError(errors, 'codigo')}><Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} /></Field>
            <Field label="Cuenta padre" error={fieldError(errors, 'parent_id')}>
              <Select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                <option value="">Ninguna</option>
                {(list.data?.data ?? []).filter((a) => a.id !== editing.id).map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </Select>
            </Field>
            <Field label="Descripción"><Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}

      {movement ? (
        <Modal title="Nuevo movimiento" onClose={() => setMovement(false)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); saveBal.mutate() }} className="space-y-3">
            <Field label="Cuenta" error={fieldError(errors, 'cuentas_id')}>
              <Select value={bal.cuentas_id} onChange={(e) => setBal({ ...bal, cuentas_id: e.target.value })} required>
                <option value="">Selecciona</option>
                {(list.data?.data ?? []).map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Tipo" error={fieldError(errors, 'tipo_referencia')}>
              <Select value={bal.tipo_referencia} onChange={(e) => setBal({ ...bal, tipo_referencia: e.target.value as TipoReferencia })}>
                <option value="invoice">Factura</option>
                <option value="payment">Pago</option>
                <option value="adjustment">Ajuste</option>
              </Select>
            </Field>
            <Field label="Referencia"><Input value={bal.referencia} onChange={(e) => setBal({ ...bal, referencia: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Débito"><Input type="number" step="0.01" value={bal.debito} onChange={(e) => setBal({ ...bal, debito: e.target.value })} /></Field>
              <Field label="Crédito"><Input type="number" step="0.01" value={bal.credito} onChange={(e) => setBal({ ...bal, credito: e.target.value })} /></Field>
            </div>
            <Field label="Fecha"><Input type="date" value={bal.fecha} onChange={(e) => setBal({ ...bal, fecha: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setMovement(false)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
