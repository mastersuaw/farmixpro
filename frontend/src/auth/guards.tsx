import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { ErrorBanner } from '../components/ui'

export function GuestOnly() {
  const { token, loading, user } = useAuth()
  if (token && loading) return <BootScreen />
  if (token && user) return <Navigate to="/" replace />
  return <Outlet />
}

export function RequireAuth() {
  const { token, loading, error, user } = useAuth()
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (loading) return <BootScreen />
  if (error && !user) {
    return (
      <div className="circuit-bg grid min-h-screen place-items-center bg-app px-6">
        <div className="w-full max-w-lg">
          <ErrorBanner message={error} />
          <p className="text-center text-sm text-muted">
            Si el backend no está corriendo, inicia `php artisan serve` en `backend/`.
          </p>
        </div>
      </div>
    )
  }
  return <Outlet />
}

export function RequireCompany() {
  const { user, company, loading } = useAuth()
  const location = useLocation()

  if (loading) return <BootScreen />
  if (!user?.companies?.length || !company) {
    return <Navigate to="/select-company" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

function BootScreen() {
  return (
    <div className="circuit-bg grid min-h-screen place-items-center bg-app text-muted">
      Cargando FarmixPro…
    </div>
  )
}
