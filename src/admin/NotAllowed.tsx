import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function NotAllowed() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 text-center">
      <div className="max-w-sm">
        <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Lock size={22} />
        </span>
        <h1 className="font-display text-2xl font-bold text-white">This account can't edit the site</h1>
        <p className="mt-3 text-sm text-ink-400">
          You are signed in as <span className="text-white">{user?.email}</span>. Ask an existing admin to add
          this email under <span className="text-white">Team</span> in the panel, then sign in again.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={logout}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-ink-50"
          >
            Use another account
          </button>
          <Link
            to="/"
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
