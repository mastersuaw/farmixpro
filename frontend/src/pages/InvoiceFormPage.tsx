import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import {
  customersApi,
  historyCurrenciesApi,
  invoicesApi,
  methodsApi,
  taxesApi,
  variantsApi,
} from '../api/resources'
import type { InvoicePayload, InvoiceStatus } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { BackButton, Button, ErrorBanner, Field, Input, Money, PageHeader, Panel, Select, StatusBadge, Textarea, cx } from '../components/ui'
import { fieldError, invoiceNumber, lineTotal, money, numberInput, today } from '../lib/format'

type Line = { variants_id: number | ''; cantidad: number; precio: number; descuento: number }
type TaxRow = { impuestos_id: number | '' }
type PayRow = { metodos_pagos_id: number | ''; monedas_id: number | ''; amount: number; discount: number; rate: number }

export function InvoiceFormPage() {
  const { id } = useParams()
  const invoiceId = id && id !== 'new' ? Number(id) : null
  const navigate = useNavigate()
  const { company } = useAuth()
  const [status, setStatus] = useState<InvoiceStatus>('open')
  const [clientesId, setClientesId] = useState<number | ''>('')
  const [fecha, setFecha] = useState(today())
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState(false)
  const [lines, setLines] = useState<Line[]>([{ variants_id: '', cantidad: 1, precio: 0, descuento: 0 }])
  const [taxRows, setTaxRows] = useState<TaxRow[]>([])
  const [payRows, setPayRows] = useState<PayRow[]>([])
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const customers = useQuery({ queryKey: ['customers', 'all', company?.id], queryFn: () => customersApi.list(1, 100) })
  const variants = useQuery({ queryKey: ['variants', 'all', company?.id], queryFn: () => variantsApi.list(1, 100) })
  const taxes = useQuery({ queryKey: ['taxes', 'all', company?.id], queryFn: () => taxesApi.list(1, 100) })
  const methods = useQuery({ queryKey: ['methods', 'all', company?.id], queryFn: () => methodsApi.list(1, 100) })
  const histories = useQuery({ queryKey: ['history-currencies', 'all'], queryFn: () => historyCurrenciesApi.list(1, 100) })
  const existing = useQuery({
    queryKey: ['invoices', invoiceId],
    enabled: Boolean(invoiceId),
    queryFn: () => invoicesApi.get(invoiceId!),
  })

  useEffect(() => {
    const invoice = existing.data?.data
    if (!invoice) return
    setStatus(invoice.status)
    setClientesId(invoice.clientes_id)
    setFecha(invoice.fecha)
    setLines(
      invoice.products?.length
        ? invoice.products.map((p) => ({
            variants_id: p.variants_id,
            cantidad: numberInput(p.cantidad),
            precio: numberInput(p.precio),
            descuento: numberInput(p.descuento),
          }))
        : [{ variants_id: '', cantidad: 1, precio: 0, descuento: 0 }],
    )
    setTaxRows(invoice.taxes?.map((t) => ({ impuestos_id: t.impuestos_id })) ?? [])
    setPayRows(
      invoice.payments?.map((p) => ({
        metodos_pagos_id: p.metodos_pagos_id,
        monedas_id: p.monedas_id,
        amount: numberInput(p.amount),
        discount: numberInput(p.discount),
        rate: numberInput(p.rate),
      })) ?? [],
    )
  }, [existing.data])

  const customer = (customers.data?.data ?? []).find((c) => c.id === clientesId)
  const defaultHistory = histories.data?.data?.[0]

  const totals = useMemo(() => {
    const lineTotals = lines.map((line) => lineTotal(line.cantidad, line.precio, line.descuento))
    const subtotal = lineTotals.reduce((sum, value) => sum + value, 0)
    const discounts = lines.reduce((sum, line) => sum + numberInput(line.descuento), 0)
    const taxAmount = taxRows.reduce((sum, row) => {
      const tax = (taxes.data?.data ?? []).find((t) => t.id === row.impuestos_id)
      return sum + subtotal * (numberInput(tax?.tasa) / 100)
    }, 0)
    return { subtotal, discounts, taxAmount, total: subtotal + taxAmount, count: lines.filter((l) => l.variants_id).length }
  }, [lines, taxRows, taxes.data])

  useEffect(() => {
    if (payRows.length === 1) {
      setPayRows((current) => current.map((row, index) => (index === 0 ? { ...row, amount: Number(totals.total.toFixed(2)) } : row)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.total])

  function selectMethod(methodId: number) {
    const historyId = payRows[0]?.monedas_id || defaultHistory?.id || ''
    setPayRows([
      {
        metodos_pagos_id: methodId,
        monedas_id: historyId,
        amount: Number(totals.total.toFixed(2)),
        discount: payRows[0]?.discount ?? 0,
        rate: payRows[0]?.rate || numberInput(defaultHistory?.tasa) || 1,
      },
    ])
  }

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)))
  }

  function chooseVariant(index: number, variantId: number) {
    const variant = (variants.data?.data ?? []).find((item) => item.id === variantId)
    updateLine(index, {
      variants_id: variantId,
      precio: numberInput(variant?.product?.precio ?? variant?.channels?.[0]?.price ?? 0) || numberInput(variant?.product?.precio),
    })
  }

  const save = useMutation({
    mutationFn: () => {
      const payload: InvoicePayload = {
        clientes_id: Number(clientesId),
        fecha,
        status,
        subtotal: Number(totals.subtotal.toFixed(2)),
        total: Number(totals.total.toFixed(2)),
        products: lines
          .filter((line) => line.variants_id)
          .map((line) => ({
            variants_id: Number(line.variants_id),
            cantidad: line.cantidad,
            precio: line.precio,
            descuento: line.descuento,
          })),
        taxes: taxRows.filter((row) => row.impuestos_id).map((row) => ({ impuestos_id: Number(row.impuestos_id) })),
        payments: payRows
          .filter((row) => row.metodos_pagos_id && row.monedas_id)
          .map((row) => ({
            metodos_pagos_id: Number(row.metodos_pagos_id),
            monedas_id: Number(row.monedas_id),
            amount: row.amount,
            discount: row.discount,
            rate: row.rate,
          })),
      }
      return invoiceId ? invoicesApi.update(invoiceId, payload) : invoicesApi.create(payload)
    },
    onSuccess: (res) => navigate(`/invoices/${res.data.id}`),
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setBanner(err.message)
        setErrors(err.errors)
      }
    },
  })

  const selectedMethod = payRows[0]?.metodos_pagos_id
  const loadError =
    (customers.error instanceof ApiError && customers.error.message) ||
    (variants.error instanceof ApiError && variants.error.message) ||
    (existing.error instanceof ApiError && existing.error.message) ||
    null

  return (
    <div>
      <PageHeader
        back={<BackButton onClick={() => navigate('/invoices')} />}
        title={invoiceId ? 'Editar factura' : 'Nueva Factura'}
        subtitle="Crear una nueva factura para tu cliente."
        actions={
          <div className="flex flex-wrap gap-2">
            {(['open', 'closed', 'cancelled'] as InvoiceStatus[]).map((value) => (
              <StatusBadge key={value} status={value} active={status === value} onClick={() => setStatus(value)} />
            ))}
          </div>
        }
      />
      <ErrorBanner message={banner ?? loadError} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Panel>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Cliente" error={fieldError(errors, 'clientes_id')} className="md:col-span-1">
                <Select value={clientesId} onChange={(e) => setClientesId(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">Selecciona un cliente</option>
                  {(customers.data?.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </Select>
                {customer?.card_id ? <p className="mt-1 text-xs text-muted">ID / CUIT {customer.card_id}</p> : null}
              </Field>
              <Field label="Fecha de emisión" error={fieldError(errors, 'fecha')}>
                <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </Field>
              <Field label="Dirección">
                <Input value={customer?.direccion ?? ''} readOnly placeholder="Se completa al elegir el cliente" />
              </Field>
              <Field label="Condición de venta">
                <Input
                  readOnly
                  value={(methods.data?.data ?? []).find((m) => m.id === selectedMethod)?.nombre ?? 'Selecciona un método de pago'}
                />
              </Field>
            </div>
          </Panel>

          <Panel className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-panel-2 text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Precio unit.</th>
                    <th className="px-4 py-3">Descuento</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-2 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {lines.map((line, index) => {
                    const variant = (variants.data?.data ?? []).find((item) => item.id === line.variants_id)
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-lime/15 text-[10px] font-bold text-lime">
                              {(variant?.product?.nombre ?? variant?.name ?? 'PR').slice(0, 2).toUpperCase()}
                            </div>
                            <Select
                              value={line.variants_id}
                              onChange={(e) => chooseVariant(index, Number(e.target.value))}
                              className="min-w-[200px]"
                            >
                              <option value="">Elegir variante</option>
                              {(variants.data?.data ?? []).map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.product?.nombre ?? 'Producto'} — {item.name}
                                </option>
                              ))}
                            </Select>
                          </div>
                          {fieldError(errors, `products.${index}.variants_id`) ? (
                            <p className="mt-1 text-xs text-danger">{fieldError(errors, `products.${index}.variants_id`)}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-muted">{variant?.sku ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Input type="number" min="0" step="0.01" value={line.cantidad} onChange={(e) => updateLine(index, { cantidad: Number(e.target.value) })} className="w-20" />
                            <span className="text-xs text-muted">u</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" min="0" step="0.01" value={line.precio} onChange={(e) => updateLine(index, { precio: Number(e.target.value) })} className="w-28" />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" min="0" step="0.01" value={line.descuento} onChange={(e) => updateLine(index, { descuento: Number(e.target.value) })} className="w-24" />
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Money value={lineTotal(line.cantidad, line.precio, line.descuento)} />
                        </td>
                        <td className="px-2 py-3">
                          <button type="button" className="text-muted hover:text-danger" onClick={() => setLines((current) => {
                            const next = current.filter((_, i) => i !== index)
                            return next.length ? next : [{ variants_id: '', cantidad: 1, precio: 0, descuento: 0 }]
                          })}>
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="px-4 py-3 text-sm font-medium text-lime hover:underline"
              onClick={() => setLines((current) => [...current, { variants_id: '', cantidad: 1, precio: 0, descuento: 0 }])}
            >
              + Agregar producto
            </button>
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-4 font-medium">Impuestos</h3>
              <div className="space-y-3">
                {taxRows.map((row, index) => {
                  const tax = (taxes.data?.data ?? []).find((t) => t.id === row.impuestos_id)
                  const amount = totals.subtotal * (numberInput(tax?.tasa) / 100)
                  return (
                    <div key={index} className="grid grid-cols-[1fr_90px_1fr_auto] items-end gap-2">
                      <Field label="Impuesto">
                        <Select value={row.impuestos_id} onChange={(e) => setTaxRows((current) => current.map((item, i) => i === index ? { impuestos_id: Number(e.target.value) } : item))}>
                          <option value="">Selecciona</option>
                          {(taxes.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                        </Select>
                      </Field>
                      <Field label="Tasa">
                        <Input readOnly value={tax ? `${Number(tax.tasa).toFixed(2)}%` : '—'} />
                      </Field>
                      <Field label="Importe">
                        <Input readOnly value={money(amount)} />
                      </Field>
                      <button type="button" className="mb-1 text-muted hover:text-danger" onClick={() => setTaxRows((current) => current.filter((_, i) => i !== index))}>✕</button>
                    </div>
                  )
                })}
              </div>
              <button type="button" className="mt-3 text-sm font-medium text-lime" onClick={() => setTaxRows((current) => [...current, { impuestos_id: '' }])}>
                + Agregar impuesto
              </button>
            </Panel>

            <Panel>
              <h3 className="mb-4 font-medium">Método de pago</h3>
              <div className="space-y-2">
                {(methods.data?.data ?? []).map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => selectMethod(method.id)}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm',
                      selectedMethod === method.id ? 'border-lime bg-lime/10 text-white' : 'border-line bg-input text-soft',
                    )}
                  >
                    <span className={cx('grid h-4 w-4 place-items-center rounded-full border', selectedMethod === method.id ? 'border-lime' : 'border-muted')}>
                      {selectedMethod === method.id ? <span className="h-2 w-2 rounded-full bg-lime" /> : null}
                    </span>
                    {method.nombre}
                  </button>
                ))}
                {!methods.data?.data.length ? <p className="text-sm text-muted">Crea un método de pago para registrarlo en la factura.</p> : null}
              </div>
              {payRows[0] ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Field label="Tasa histórica (monedas_id)" error={fieldError(errors, 'payments.0.monedas_id')}>
                    <Select
                      value={payRows[0].monedas_id}
                      onChange={(e) => setPayRows((current) => current.map((row, i) => i === 0 ? { ...row, monedas_id: Number(e.target.value), rate: numberInput((histories.data?.data ?? []).find((h) => h.id === Number(e.target.value))?.tasa) } : row))}
                    >
                      <option value="">Selecciona history_currencies.id</option>
                      {(histories.data?.data ?? []).map((item) => (
                        <option key={item.id} value={item.id}>
                          #{item.id} · {item.currency?.codigo ?? `moneda ${item.monedas_id}`} · {item.tasa} · {item.fecha}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Tasa aplicada">
                    <Input type="number" step="0.0001" value={payRows[0].rate} onChange={(e) => setPayRows((current) => current.map((row, i) => i === 0 ? { ...row, rate: Number(e.target.value) } : row))} />
                  </Field>
                  <Field label="Importe">
                    <Input type="number" step="0.01" value={payRows[0].amount} onChange={(e) => setPayRows((current) => current.map((row, i) => i === 0 ? { ...row, amount: Number(e.target.value) } : row))} />
                  </Field>
                  <Field label="Descuento pago">
                    <Input type="number" step="0.01" value={payRows[0].discount} onChange={(e) => setPayRows((current) => current.map((row, i) => i === 0 ? { ...row, discount: Number(e.target.value) } : row))} />
                  </Field>
                </div>
              ) : null}
            </Panel>
          </div>
        </div>

        <aside className="xl:sticky xl:top-6">
          <Panel>
            <h2 className="text-lg font-semibold">Resumen de Factura</h2>
            <p className="mt-1 text-sm text-lime">{invoiceNumber(invoiceId)}</p>
            <div className="mt-5 space-y-3 text-sm">
              <Row label={`Subtotal (${totals.count} productos)`} value={money(totals.subtotal)} />
              <Row label="Descuentos" value={money(-totals.discounts)} danger />
              <Row label="Impuestos" value={money(totals.taxAmount)} />
            </div>
            <div className="my-5 border-t border-line" />
            <p className="text-xs uppercase tracking-wide text-muted">Total</p>
            <p className="glow-text mt-1 text-4xl font-extrabold text-lime">{money(totals.total)}</p>
            <Field label="Observaciones" className="mt-5">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas (solo en esta vista)" />
            </Field>
            <Button className="mt-4 w-full py-3" disabled={save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? 'Guardando…' : 'Guardar Factura'}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setPreview(true)}>
              Vista Previa
            </Button>
          </Panel>
        </aside>
      </div>

      {preview ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" onClick={() => setPreview(false)}>
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Vista previa</h3>
            <p className="text-sm text-lime">{invoiceNumber(invoiceId)}</p>
            <p className="mt-3 text-sm text-muted">{customer?.nombre ?? 'Sin cliente'} · {fecha}</p>
            <p className="mt-4 text-3xl font-bold text-lime">{money(totals.total)}</p>
            {notes ? <p className="mt-3 text-sm text-soft">{notes}</p> : null}
            <Button className="mt-6 w-full" onClick={() => setPreview(false)}>Cerrar</Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={danger ? 'text-danger' : 'text-white'}>{value}</span>
    </div>
  )
}
