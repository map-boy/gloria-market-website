import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
