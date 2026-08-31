export function money(value: number | string | null | undefined) {
  const n = Number(value ?? 0)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0)
}

export function numberInput(value: number | string | null | undefined) {
  const n = Number(value ?? 0)
  return Number.isFinite(n) ? n : 0
}

export function initials(name: string | undefined) {
  if (!name) return 'FP'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function fieldError(errors: Record<string, string[]> | null | undefined, key: string): string | null {
  return errors?.[key]?.[0] ?? errors?.[`${key}.0`]?.[0] ?? null
}

export function friendlyMessage(message: string | null | undefined) {
  if (!message) return null
  if (/SQLSTATE|Connection refused|could not find driver|Access denied for user/i.test(message)) {
    return 'No se pudo conectar con la base de datos. Revisa MySQL/MariaDB e inicia el backend.'
  }
  return message
}

export function invoiceNumber(id?: number | null) {
  if (!id) return 'Borrador'
  return `0001-${String(id).padStart(8, '0')}`
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function lineTotal(cantidad: number, precio: number, descuento: number) {
  return Math.max(0, cantidad * precio - descuento)
}
