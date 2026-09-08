import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, House, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/** Signed in with Google, but this account is not on the admin list. Shows the
 *  exact address that needs adding, so it can be pasted into Team as is. */
export default function NotAllowed() {
  const { user, logout } = useAuth()
  const [copied, setCopied] = useState(false)
  const email = user?.email ?? ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the address is on screen to type instead */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Lock size={22} />
        </span>
        <h1 className="font-display text-2xl font-bold text-white">This account can't edit the site</h1>
        <p className="mt-3 text-sm text-ink-400">
          You are signed in, but this address is not on the admin list yet.
        </p>

        {email && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-400">Email to add</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate text-sm text-white">{email}</code>
              <button
                onClick={copy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              An admin adds it under <span className="text-white">Team → Give someone access</span>.
              Then sign in again here.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-ink-50"
          >
            <House size={15} /> Go back home
          </Link>
          <button
            onClick={logout}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Use another account
          </button>
        </div>
      </div>
    </div>
  )
}
