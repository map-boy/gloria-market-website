import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from './AdminLogin'
import NotAllowed from './NotAllowed'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950 text-sm text-ink-400">
        Checking your account…
      </div>
    )
  }
  if (!user) return <AdminLogin />
  if (!isAdmin) return <NotAllowed />
  return <>{children}</>
}
