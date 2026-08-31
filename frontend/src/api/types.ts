export type InvoiceStatus = 'open' | 'closed' | 'cancelled'
export type TipoReferencia = 'invoice' | 'payment' | 'adjustment'

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  errors: Record<string, string[]> | null
  meta?: PaginationMeta
}

export type User = {
  id: number
  name: string
  email: string
  companies?: Company[]
  current_company_id?: number | null
  created_at?: string
}

export type AuthPayload = {
  user: User
  token: string
  token_type: string
}

export type Company = {
  id: number
  name: string
  address: string | null
  created_at?: string
  updated_at?: string
}

export type Customer = {
  id: number
  companies_id: number
  nombre: string
  card_id: string | null
  direccion: string | null
  telefono: string | null
}

export type Product = {
  id: number
  companies_id: number
  nombre: string
  descripcion: string | null
  precio: number | string
  variants?: Variant[]
}

export type Variant = {
  id: number
  companies_id: number
  products_id: number
  sku: string
  name: string
  description: string | null
  stock: number | string
  product?: Product
  attributes?: VariantAttribute[]
  channels?: VariantChannel[]
}

export type VariantAttribute = {
  id: number
  companies_id: number
  variants_products_id: number
  name: string
  value: string
}

export type Channel = {
  id: number
  companies_id: number
  name: string
  description: string | null
}

export type VariantChannel = {
  id: number
  companies_id: number
  variants_products_id: number
  channels_id: number
  price: number | string
  stock: number | string
  is_avaliable: boolean
  is_available: boolean
  variant?: Variant
  channel?: Channel
}

export type Tax = {
  id: number
  companies_id: number
  nombre: string
  descripcion: string | null
  tasa: number | string
}

export type MethodPayment = {
  id: number
  companies_id: number
  nombre: string
}

export type Account = {
  id: number
  companies_id: number
  parent_id: number | null
  nombre: string
  codigo: string | null
  descripcion: string | null
  parent?: Account
}

export type Currency = {
  id: number
  codigo: string
  nombre: string
  tasa: number | string
  history?: HistoryCurrency[]
}

export type HistoryCurrency = {
  id: number
  monedas_id: number
  tasa: number | string
  fecha: string
  currency?: Currency
}

export type InvoiceProduct = {
  id: number
  companies_id: number
  users_id: number
  facturas_id: number
  variants_id: number
  cantidad: number | string
  precio: number | string
  descuento: number | string
  variant?: Variant
}

export type InvoiceTax = {
  id: number
  companies_id: number
  facturas_id: number
  impuestos_id: number
  tax?: Tax
}

export type HowPaid = {
  id: number
  companies_id: number
  metodos_pagos_id: number
  facturas_id: number
  monedas_id: number
  amount: number | string
  discount: number | string
  rate: number | string
  method_payment?: MethodPayment
  history_currency?: HistoryCurrency
}

export type Invoice = {
  id: number
  companies_id: number
  who_open: number
  who_close: number | null
  clientes_id: number
  fecha: string
  subtotal: number | string
  total: number | string
  status: InvoiceStatus
  customer?: Customer
  opener?: User
  closer?: User | null
  products?: InvoiceProduct[]
  taxes?: InvoiceTax[]
  payments?: HowPaid[]
}

export type BalanceCuenta = {
  id: number
  companies_id: number
  cuentas_id: number
  referencia: string | null
  tipo_referencia: TipoReferencia
  debito: number | string
  credito: number | string
  fecha: string
  account?: Account
}

export type InvoiceProductPayload = {
  variants_id: number
  cantidad: number
  precio: number
  descuento?: number
}

export type InvoiceTaxPayload = {
  impuestos_id: number
}

export type InvoicePaymentPayload = {
  metodos_pagos_id: number
  monedas_id: number
  amount: number
  discount?: number
  rate?: number
}

export type InvoicePayload = {
  clientes_id: number
  fecha: string
  status?: InvoiceStatus
  subtotal?: number
  total?: number
  products?: InvoiceProductPayload[]
  taxes?: InvoiceTaxPayload[]
  payments?: InvoicePaymentPayload[]
}
