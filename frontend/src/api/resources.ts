import { api, createResource } from './client'
import type {
  Account,
  AuthPayload,
  BalanceCuenta,
  Channel,
  Company,
  Currency,
  Customer,
  HistoryCurrency,
  HowPaid,
  Invoice,
  InvoicePayload,
  InvoiceProduct,
  InvoiceTax,
  MethodPayment,
  Product,
  Tax,
  TipoReferencia,
  User,
  Variant,
  VariantAttribute,
  VariantChannel,
} from './types'

export const authApi = {
  login(email: string, password: string) {
    return api.post<AuthPayload>('/auth/login', { email, password })
  },
  register(name: string, email: string, password: string, passwordConfirmation: string) {
    return api.post<AuthPayload>('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
  },
  me() {
    return api.get<User>('/auth/me')
  },
  logout() {
    return api.post<null>('/auth/logout')
  },
}

export const companiesApi = {
  ...createResource<Company, { name: string; address?: string }>('/companies'),
  current() {
    return api.get<Company | null>('/companies/current')
  },
  switch(id: number) {
    return api.post<Company>(`/companies/${id}/switch`)
  },
  attachUser(id: number, payload: { users_id?: number; email?: string }) {
    return api.post<User>(`/companies/${id}/users`, payload)
  },
  detachUser(companyId: number, userId: number) {
    return api.delete(`/companies/${companyId}/users/${userId}`)
  },
}

export const customersApi = createResource<
  Customer,
  { nombre: string; card_id?: string; direccion?: string; telefono?: string }
>('/customers')

export const productsApi = createResource<
  Product,
  { nombre: string; descripcion?: string; precio: number }
>('/products')

export const variantsApi = createResource<
  Variant,
  {
    products_id: number
    sku: string
    name: string
    description?: string
    stock?: number
    attributes?: { id?: number; name: string; value: string }[]
  }
>('/variants-products')

export const variantAttributesApi = createResource<
  VariantAttribute,
  { variants_products_id: number; name: string; value: string }
>('/variant-attributes')

export const channelsApi = createResource<Channel, { name: string; description?: string }>('/channels')

export const variantChannelsApi = createResource<
  VariantChannel,
  {
    variants_products_id: number
    channels_id: number
    price: number
    stock?: number
    is_available?: boolean
  }
>('/variant-channels')

export const taxesApi = createResource<
  Tax,
  { nombre: string; descripcion?: string; tasa: number }
>('/taxes')

export const methodsApi = createResource<MethodPayment, { nombre: string }>('/methods-payments')

export const accountsApi = createResource<
  Account,
  { nombre: string; codigo?: string; descripcion?: string; parent_id?: number | null }
>('/accounts')

export const currenciesApi = createResource<
  Currency,
  { codigo: string; nombre: string; tasa: number }
>('/currencies')

export const historyCurrenciesApi = createResource<
  HistoryCurrency,
  { monedas_id: number; tasa: number; fecha: string }
>('/history-currencies')

export const invoicesApi = createResource<Invoice, InvoicePayload>('/invoices')

export const invoiceProductsApi = createResource<
  InvoiceProduct,
  { facturas_id: number; variants_id: number; cantidad: number; precio: number; descuento?: number }
>('/invoice-products')

export const invoiceTaxesApi = createResource<
  InvoiceTax,
  { facturas_id: number; impuestos_id: number }
>('/invoice-taxes')

export const howPaidApi = createResource<
  HowPaid,
  {
    facturas_id: number
    metodos_pagos_id: number
    monedas_id: number
    amount: number
    discount?: number
    rate?: number
  }
>('/how-paid')

export const balancesApi = createResource<
  BalanceCuenta,
  {
    cuentas_id: number
    referencia?: string
    tipo_referencia: TipoReferencia
    debito?: number
    credito?: number
    fecha: string
  }
>('/balance-cuentas')

export const healthApi = {
  check() {
    return api.get<{ status?: string }>('/health')
  },
}
