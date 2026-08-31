import { storage } from '../lib/storage'
import type { ApiEnvelope } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type UnauthorizedHandler = () => void
type NeedsCompanyHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null
let onNeedsCompany: NeedsCompanyHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler
}

export function setNeedsCompanyHandler(handler: NeedsCompanyHandler | null) {
  onNeedsCompany = handler
}

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]> | null
  needsCompany: boolean

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> | null = null,
    needsCompany = false,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.needsCompany = needsCompany
  }
}

function isCompanyRequired(status: number, message: string) {
  return (
    status === 422 &&
    /empresa/i.test(message) &&
    /selecciona|crea|continuar/i.test(message)
  )
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { query?: Record<string, string | number | undefined> } = {},
): Promise<ApiEnvelope<T>> {
  const { query, headers, ...init } = options
  const url = new URL(path.startsWith('http') ? path : `${API_URL}${path}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }

  const token = storage.getToken()
  const companyId = storage.getCompanyId()
  const requestHeaders = new Headers(headers)
  requestHeaders.set('Accept', 'application/json')

  if (!(init.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)
  if (companyId) requestHeaders.set('X-Company-Id', companyId)

  let response: Response
  try {
    response = await fetch(url, { ...init, headers: requestHeaders })
  } catch {
    throw new ApiError(
      'No se pudo conectar con la API. Verifica que el backend esté en http://localhost:8000.',
      0,
    )
  }

  let payload: ApiEnvelope<T> | null = null
  const text = await response.text()
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError('La API devolvió una respuesta inválida.', response.status)
    }
  }

  const rawMessage = payload?.message ?? `Error ${response.status}`
  const message = /SQLSTATE|Connection refused|could not find driver/i.test(rawMessage)
    ? 'No se pudo conectar con la base de datos. Revisa MySQL/MariaDB e inicia el backend.'
    : rawMessage
  const errors = payload?.errors ?? null

  if (response.status === 401) {
    storage.clear()
    onUnauthorized?.()
    throw new ApiError(message || 'Sesión expirada. Inicia sesión de nuevo.', 401, errors)
  }

  if (!response.ok || payload?.success === false) {
    const needsCompany = isCompanyRequired(response.status, message)
    if (needsCompany) onNeedsCompany?.()
    throw new ApiError(message, response.status, errors, needsCompany)
  }

  return payload ?? { success: true, message: 'OK', data: null as T, errors: null }
}

export const api = {
  get<T>(path: string, query?: Record<string, string | number | undefined>) {
    return apiRequest<T>(path, { method: 'GET', query })
  },
  post<T>(path: string, body?: unknown) {
    return apiRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
  },
  put<T>(path: string, body?: unknown) {
    return apiRequest<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })
  },
  delete<T>(path: string) {
    return apiRequest<T>(path, { method: 'DELETE' })
  },
}

export function createResource<T, TCreate, TUpdate = Partial<TCreate>>(basePath: string) {
  return {
    list(page = 1, perPage = 15) {
      return api.get<T[]>(basePath, { page, per_page: perPage })
    },
    get(id: number) {
      return api.get<T>(`${basePath}/${id}`)
    },
    create(payload: TCreate) {
      return api.post<T>(basePath, payload)
    },
    update(id: number, payload: TUpdate) {
      return api.put<T>(`${basePath}/${id}`, payload)
    },
    remove(id: number) {
      return api.delete(`${basePath}/${id}`)
    },
  }
}
