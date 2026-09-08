import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5" />
      <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.3-10.2 7.3-17.5" />
      <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48" />
    </svg>
  )
}

export default function AdminLogin() {
  const { loginWithGoogle, error } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-white/10 bg-ink-900 p-8 shadow-2xl">
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-400/15 text-sand-400">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold text-white">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-400">
            Use the Google account that owns this shop. Only approved accounts can make changes.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
          )}

          <button
            onClick={loginWithGoogle}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-50"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-400 transition hover:text-white"
        >
          <ArrowLeft size={15} /> Back to the shop
        </Link>
      </div>
    </div>
  )
}
