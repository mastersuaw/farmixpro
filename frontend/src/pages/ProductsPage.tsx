import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { productsApi } from '../api/resources'
import type { Product } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Field, Input, Modal, Money, PageHeader, Pagination, Table, Textarea } from '../components/ui'
import { fieldError } from '../lib/format'

export function ProductsPage() {
  const { company } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '0' })
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const list = useQuery({ queryKey: ['products', company?.id, page], queryFn: () => productsApi.list(page) })

  const save = useMutation({
    mutationFn: () => {
      const payload = { nombre: form.nombre, descripcion: form.descripcion || undefined, precio: Number(form.precio) }
      return editing?.id ? productsApi.update(editing.id, payload) : productsApi.create(payload)
    },
    onSuccess: () => {
      setEditing(null)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  function open(product?: Product) {
    setEditing(product ?? {})
    setForm(product ? { nombre: product.nombre, descripcion: product.descripcion ?? '', precio: String(product.precio) } : { nombre: '', descripcion: '', precio: '0' })
    setErrors(null)
  }

  return (
    <div>
      <PageHeader title="Productos" subtitle="Catálogo y variantes de venta." actions={<Button onClick={() => open()}>Nuevo producto</Button>} />
      <ErrorBanner message={banner ?? (list.error instanceof ApiError ? list.error.message : null)} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState title="No hay productos" action={<Button onClick={() => open()}>Nuevo producto</Button>} />
      ) : (
        <Table headers={['Producto', 'Precio', 'Variantes', '']}>
          {(list.data?.data ?? []).map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <Link to={`/products/${product.id}`} className="font-medium text-white hover:text-lime">{product.nombre}</Link>
                <p className="text-xs text-muted">{product.descripcion || 'Sin descripción'}</p>
              </td>
              <td className="px-4 py-3"><Money value={product.precio} /></td>
              <td className="px-4 py-3 text-muted">{product.variants?.length ?? 0}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => open(product)}>Editar</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar producto?')) remove.mutate(product.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
      {editing ? (
        <Modal title={editing.id ? 'Editar producto' : 'Nuevo producto'} onClose={() => setEditing(null)}>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate() }} className="space-y-3">
            <Field label="Nombre" error={fieldError(errors, 'nombre')}><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></Field>
            <Field label="Descripción"><Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Field>
            <Field label="Precio" error={fieldError(errors, 'precio')}><Input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
