import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-charcoal-100" />
        <div className="absolute inset-0 rounded-full border-4 border-charcoal-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-primary-600">Cargando...</p>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function CashierRoute() {
  const { isAuthenticated, isCashier, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !isCashier) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}