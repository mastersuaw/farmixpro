import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { initials } from '../lib/format'
import { Button, LeafIcon, cx } from './ui'

const NAV = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/invoices', label: 'Facturas', icon: InvoiceIcon },
  { to: '/customers', label: 'Clientes', icon: UsersIcon },
  { to: '/products', label: 'Productos', icon: BoxIcon },
  { to: '/taxes', label: 'Impuestos', icon: PercentIcon },
  { to: '/methods-payments', label: 'Pagos', icon: CardIcon },
  { to: '/accounts', label: 'Cuentas', icon: LedgerIcon },
  { to: '/channels', label: 'Canales', icon: ChannelIcon },
  { to: '/catalog/currencies', label: 'Catálogos', icon: GlobeIcon },
  { to: '/companies', label: 'Empresas', icon: BuildingIcon },
]

export function AppShell() {
  const { user, company, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="circuit-bg min-h-screen bg-app text-white">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-line bg-[#0c1211]/95 px-4 py-5">
          <button type="button" onClick={() => navigate('/')} className="mb-8 flex items-center gap-3 px-1 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/15 text-lime glow-lime">
              <LeafIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">FarmixPro</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                Facturación inteligente
              </span>
            </span>
          </button>

          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                    isActive
                      ? 'bg-lime/10 text-lime shadow-[inset_3px_0_0_#a3e635]'
                      : 'text-muted hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-line bg-panel p-3">
              <p className="truncate text-sm font-medium text-white">{company?.name ?? 'Sin empresa'}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
                {company ? 'Empresa actual' : 'Selecciona una empresa'}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-lime" />
              </div>
              {company?.address ? (
                <p className="mt-2 truncate text-[11px] text-muted">{company.address}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-1">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-lime/15 text-xs font-semibold text-lime">
                {initials(user?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name ?? 'Usuario'}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <Button variant="soft" className="!px-2 !py-1.5 text-xs" onClick={() => void logout()}>
                Salir
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-8 py-6">
          <Outlet />
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted">
            <span>🛡</span> Tus datos están protegidos con encriptación de nivel bancario
          </p>
        </main>
      </div>
    </div>
  )
}

function HomeIcon() {
  return <Icon d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
}
function InvoiceIcon() {
  return <Icon d="M7 3h10v18l-2.2-1.4L12 21l-2.8-1.4L7 21zM9 8h6M9 12h6M9 16h3" />
}
function UsersIcon() {
  return <Icon d="M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 1a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 17 12ZM4 19a5 5 0 0 1 10 0Zm9.5-1a4 4 0 0 1 6.5 1" />
}
function BoxIcon() {
  return <Icon d="M4 8 12 4l8 4-8 4zm0 0v8l8 4 8-4V8M12 12v8" />
}
function PercentIcon() {
  return <Icon d="M6 18 18 6M8 8.5A1.5 1.5 0 1 0 6.5 7 1.5 1.5 0 0 0 8 8.5Zm8 8A1.5 1.5 0 1 0 14.5 15 1.5 1.5 0 0 0 16 16.5Z" />
}
function CardIcon() {
  return <Icon d="M4 7h16v10H4zm0 3h16M7 15h4" />
}
function LedgerIcon() {
  return <Icon d="M5 5h14v14H5zm3 4h8M8 12h8M8 15h5" />
}
function ChannelIcon() {
  return <Icon d="M4 12h4l2-6 4 12 2-6h4" />
}
function GlobeIcon() {
  return <Icon d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-8 8h16M12 4c2 2.5 3 5.3 3 8s-1 5.5-3 8c-2-2.5-3-5.3-3-8s1-5.5 3-8Z" />
}
function BuildingIcon() {
  return <Icon d="M5 20V6l7-3 7 3v14H5Zm4-4h2m4 0h2M9 12h2m4 0h2" />
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={d} />
    </svg>
  )
}
