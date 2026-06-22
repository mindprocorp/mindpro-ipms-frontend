import { Outlet } from 'react-router-dom'
import { ProtectedRoute } from '../_components/ProtectedRoute'

export function PrivateLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
