import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { channelsApi, productsApi, variantChannelsApi, variantsApi } from '../api/resources'
import type { Variant } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { BackButton, Button, ErrorBanner, Field, Input, Modal, Money, PageHeader, Select, Table } from '../components/ui'
import { fieldError } from '../lib/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Partial<Variant> | null>(null)
  const [channelOpen, setChannelOpen] = useState<number | null>(null)
  const [form, setForm] = useState({ sku: '', name: '', description: '', stock: '0', attrName: '', attrValue: '' })
  const [chForm, setChForm] = useState({ channels_id: '', price: '0', stock: '0', is_available: true })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const product = useQuery({
    queryKey: ['products', productId, company?.id],
    enabled: Number.isFinite(productId),
    queryFn: () => productsApi.get(productId),
  })
  const variants = useQuery({
    queryKey: ['variants', productId, company?.id],
    queryFn: async () => {
      const res = await variantsApi.list(1, 100)
      return { ...res, data: res.data.filter((v) => v.products_id === productId) }
    },
  })
  const channels = useQuery({ queryKey: ['channels', company?.id], queryFn: () => channelsApi.list(1, 100) })

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        products_id: productId,
        sku: form.sku,
        name: form.name,
        description: form.description || undefined,
        stock: Number(form.stock),
        attributes: form.attrName ? [{ name: form.attrName, value: form.attrValue }] : undefined,
      }
      return editing?.id ? variantsApi.update(editing.id, payload) : variantsApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['variants'] })
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const saveChannel = useMutation({
    mutationFn: () =>
      variantChannelsApi.create({
        variants_products_id: channelOpen!,
        channels_id: Number(chForm.channels_id),
        price: Number(chForm.price),
        stock: Number(chForm.stock),
        is_available: chForm.is_available,
      }),
    onSuccess: () => {
      setChannelOpen(null)
      void queryClient.invalidateQueries({ queryKey: ['variants'] })
    },
    onError: (err: unknown) => setBanner(err instanceof ApiError ? err.message : 'No se pudo guardar el canal.'),
  })

  const remove = useMutation({
    mutationFn: (variantId: number) => variantsApi.remove(variantId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['variants'] }),
  })

  function open(variant?: Variant) {
    setEditing(variant ?? {})
    const attr = variant?.attributes?.[0]
    setForm(variant
      ? { sku: variant.sku, name: variant.name, description: variant.description ?? '', stock: String(variant.stock), attrName: attr?.name ?? '', attrValue: attr?.value ?? '' }
      : { sku: '', name: '', description: '', stock: '0', attrName: '', attrValue: '' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader
        back={<BackButton onClick={() => navigate('/products')} />}
        title={product.data?.data.nombre ?? 'Producto'}
        subtitle={product.data?.data.descripcion ?? 'Variantes, atributos y precios por canal.'}
        actions={<Button onClick={() => open()}>Nueva variante</Button>}
      />
      <ErrorBanner message={banner ?? (product.error instanceof ApiError ? product.error.message : variants.error instanceof ApiError ? variants.error.message : null)} />
      <p className="mb-4 text-sm text-muted">Precio base: <Money value={product.data?.data.precio ?? 0} /></p>
      <Table headers={['Variante', 'SKU', 'Stock', 'Atributos', '']}>
        {(variants.data?.data ?? []).map((variant) => (
          <tr key={variant.id}>
            <td className="px-4 py-3 font-medium">{variant.name}</td>
            <td className="px-4 py-3 text-muted">{variant.sku}</td>
            <td className="px-4 py-3">{variant.stock}</td>
            <td className="px-4 py-3 text-muted">{variant.attributes?.map((a) => `${a.name}: ${a.value}`).join(', ') || '—'}</td>
            <td className="px-4 py-3 text-right">
              <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(variant)}>Editar</Button>
              <Button variant="ghost" className="mr-2 !py-1.5 text-xs" onClick={() => { setChannelOpen(variant.id); setChForm({ channels_id: '', price: String(product.data?.data.precio ?? 0), stock: '0', is_available: true }) }}>Canal</Button>
              <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar variante?')) remove.mutate(variant.id) }}>Borrar</Button>
            </td>
          </tr>
        ))}
      </Table>
      {editing ? (
        <Modal title={editing.id ? 'Editar variante' : 'Nueva variante'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'name')}><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="SKU" error={fieldError(errors, 'sku')}><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></Field>
            <Field label="Descripción"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Stock"><Input type="number" step="0.01" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Atributo"><Input value={form.attrName} onChange={(e) => setForm({ ...form, attrName: e.target.value })} placeholder="presentación" /></Field>
              <Field label="Valor"><Input value={form.attrValue} onChange={(e) => setForm({ ...form, attrValue: e.target.value })} placeholder="saco 70kg" /></Field>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
      {channelOpen ? (
        <Modal title="Precio por canal" onClose={() => setChannelOpen(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); saveChannel.mutate() }} className="space-y-3">
            <Field label="Canal">
              <Select value={chForm.channels_id} onChange={(e) => setChForm({ ...chForm, channels_id: e.target.value })} required>
                <option value="">Selecciona</option>
                {(channels.data?.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Precio"><Input type="number" step="0.01" value={chForm.price} onChange={(e) => setChForm({ ...chForm, price: e.target.value })} required /></Field>
            <Field label="Stock"><Input type="number" step="0.01" value={chForm.stock} onChange={(e) => setChForm({ ...chForm, stock: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm text-soft">
              <input type="checkbox" checked={chForm.is_available} onChange={(e) => setChForm({ ...chForm, is_available: e.target.checked })} />
              Disponible
            </label>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setChannelOpen(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
