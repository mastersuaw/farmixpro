import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { customersApi, invoicesApi, productsApi } from '../api/resources'
import { useAuth } from '../auth/AuthContext'
import { ErrorBanner, Money, PageHeader, Panel, StatusBadge } from '../components/ui'
import { ApiError } from '../api/client'
import { invoiceNumber } from '../lib/format'

export function DashboardPage() {
  const { company } = useAuth()
  const invoices = useQuery({
    queryKey: ['invoices', 'dash', company?.id],
    queryFn: () => invoicesApi.list(1, 5),
  })
  const customers = useQuery({
    queryKey: ['customers', 'dash', company?.id],
    queryFn: () => customersApi.list(1, 1),
  })
  const products = useQuery({
    queryKey: ['products', 'dash', company?.id],
    queryFn: () => productsApi.list(1, 1),
  })

  const error =
    (invoices.error instanceof ApiError && invoices.error.message) ||
    (customers.error instanceof ApiError && customers.error.message) ||
    (products.error instanceof ApiError && products.error.message) ||
    null

  return (
    <div>
      <PageHeader
        title="Inicio"
        subtitle={`Resumen de ${company?.name ?? 'tu empresa'}.`}
        actions={
          <Link
            to="/invoices/new"
            className="inline-flex items-center rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-[#12200f] glow-lime"
          >
            Nueva factura
          </Link>
        }
      />
      <ErrorBanner message={error} />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Facturas" value={invoices.data?.meta?.total ?? '—'} to="/invoices" />
        <Stat title="Clientes" value={customers.data?.meta?.total ?? '—'} to="/customers" />
        <Stat title="Productos" value={products.data?.meta?.total ?? '—'} to="/products" />
      </div>
      <Panel className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium">Últimas facturas</h2>
          <Link to="/invoices" className="text-sm text-lime">
            Ver todas
          </Link>
        </div>
        <div className="space-y-3">
          {(invoices.data?.data ?? []).map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-input px-4 py-3 hover:border-lime/40"
            >
              <div>
                <p className="font-medium text-lime">{invoiceNumber(invoice.id)}</p>
                <p className="text-sm text-muted">{invoice.customer?.nombre ?? `Cliente #${invoice.clientes_id}`}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={invoice.status} active />
                <Money value={invoice.total} className="font-semibold" />
              </div>
            </Link>
          ))}
          {!invoices.isLoading && !invoices.data?.data.length ? (
            <p className="text-sm text-muted">Todavía no hay facturas.</p>
          ) : null}
        </div>
      </Panel>
    </div>
  )
}

function Stat({ title, value, to }: { title: string; value: number | string; to: string }) {
  return (
    <Link to={to} className="glass-panel rounded-2xl p-5 hover:border-lime/30">
      <p className="text-xs uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-lime glow-text">{value}</p>
    </Link>
  )
}
