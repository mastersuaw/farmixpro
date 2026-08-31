import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ApiError } from '../api/client'
import { invoicesApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { Button, EmptyState, ErrorBanner, Money, PageHeader, Pagination, StatusBadge, Table } from '../components/ui'
import { invoiceNumber } from '../lib/format'

export function InvoicesListPage() {
  const { company } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const list = useQuery({ queryKey: ['invoices', company?.id, page], queryFn: () => invoicesApi.list(page) })
  const remove = useMutation({
    mutationFn: (id: number) => invoicesApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  })

  return (
    <div>
      <PageHeader
        title="Facturas"
        subtitle="Listado de facturas de la empresa actual."
        actions={<Button onClick={() => navigate('/invoices/new')}>Nueva factura</Button>}
      />
      <ErrorBanner message={list.error instanceof ApiError ? list.error.message : null} />
      {!list.data?.data.length && !list.isLoading ? (
        <EmptyState
          title="No hay facturas"
          hint="Crea la primera con cliente, líneas, impuestos y pago."
          action={<Button onClick={() => navigate('/invoices/new')}>Nueva factura</Button>}
        />
      ) : (
        <Table headers={['N°', 'Cliente', 'Fecha', 'Estado', 'Total', '']}>
          {(list.data?.data ?? []).map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-4 py-3">
                <Link to={`/invoices/${invoice.id}`} className="font-medium text-lime hover:underline">
                  {invoiceNumber(invoice.id)}
                </Link>
              </td>
              <td className="px-4 py-3">{invoice.customer?.nombre ?? `#${invoice.clientes_id}`}</td>
              <td className="px-4 py-3 text-muted">{invoice.fecha}</td>
              <td className="px-4 py-3"><StatusBadge status={invoice.status} active /></td>
              <td className="px-4 py-3 font-medium"><Money value={invoice.total} /></td>
              <td className="px-4 py-3 text-right">
                <Button variant="soft" className="mr-2 !py-1.5 text-xs" onClick={() => navigate(`/invoices/${invoice.id}`)}>Abrir</Button>
                <Button variant="danger" className="!py-1.5 text-xs" onClick={() => { if (confirm('¿Eliminar factura?')) remove.mutate(invoice.id) }}>Borrar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination meta={list.data?.meta} onPage={setPage} />
    </div>
  )
}
