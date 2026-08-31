import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { friendlyMessage, money } from '../lib/format'
import type { InvoiceStatus, PaginationMeta } from '../api/types'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  back?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {back}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel text-soft hover:border-lime/40 hover:text-lime"
      aria-label="Volver"
    >
      <ArrowLeftIcon />
    </button>
  )
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft'
}) {
  const styles = {
    primary: 'bg-lime text-[#12200f] hover:bg-lime-dim glow-lime font-semibold',
    ghost: 'border border-white/20 bg-transparent text-white hover:border-lime/50 hover:text-lime',
    danger: 'border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20',
    soft: 'border border-line bg-panel-2 text-soft hover:text-white hover:border-lime/30',
  }[variant]

  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50',
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string | null
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  )
}

const controlClass =
  'w-full rounded-xl border border-line bg-input px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-muted/70 focus:border-lime/50 focus:shadow-[0_0_0_3px_rgba(163,230,53,0.12)]'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(controlClass, props.className)} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(controlClass, 'appearance-none', props.className)} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(controlClass, 'min-h-24 resize-y', props.className)} />
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('glass-panel rounded-2xl p-5', className)}>{children}</section>
}

export function ErrorBanner({ message }: { message?: string | null }) {
  const text = friendlyMessage(message)
  if (!text) return null
  return (
    <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
      {text}
    </div>
  )
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function Pagination({
  meta,
  onPage,
}: {
  meta?: PaginationMeta
  onPage: (page: number) => void
}) {
  if (!meta || meta.last_page <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted">
      <span>
        Página {meta.current_page} de {meta.last_page} · {meta.total} registros
      </span>
      <div className="flex gap-2">
        <Button variant="soft" disabled={meta.current_page <= 1} onClick={() => onPage(meta.current_page - 1)}>
          Anterior
        </Button>
        <Button
          variant="soft"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPage(meta.current_page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export function StatusBadge({
  status,
  active,
  onClick,
}: {
  status: InvoiceStatus
  active?: boolean
  onClick?: () => void
}) {
  const map = {
    open: { label: 'ABIERTA', icon: '●', on: 'bg-lime text-[#12200f] glow-lime', off: 'border border-lime/30 text-lime' },
    closed: { label: 'CERRADA', icon: '🔒', on: 'bg-cyan/20 text-cyan border border-cyan', off: 'border border-cyan/40 text-cyan' },
    cancelled: { label: 'CANCELADA', icon: '✕', on: 'bg-danger/20 text-danger border border-danger', off: 'border border-danger/40 text-danger' },
  }[status]

  const className = cx(
    'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide',
    active ? map.on : map.off,
    onClick && 'cursor-pointer',
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <span>{map.icon}</span>
        {map.label}
      </button>
    )
  }

  return (
    <span className={className}>
      <span>{map.icon}</span>
      {map.label}
    </span>
  )
}

export function Money({ value, className }: { value: number | string; className?: string }) {
  return <span className={className}>{money(value)}</span>
}

export function Modal({
  title,
  children,
  onClose,
  wide,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className={cx('glass-panel w-full rounded-2xl p-6 shadow-2xl', wide ? 'max-w-3xl' : 'max-w-lg')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-panel-2 text-[11px] uppercase tracking-wider text-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-panel/60">{children}</tbody>
      </table>
    </div>
  )
}

export function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18 9 12l6-6" />
    </svg>
  )
}

export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path
        d="M16 4c.5 6 4.2 10.6 10.5 11.6C20.2 16.8 16.5 21.4 16 28 15.5 21.4 11.8 16.8 5.5 15.6 11.8 14.6 15.5 10 16 4Z"
        fill="currentColor"
      />
    </svg>
  )
}
