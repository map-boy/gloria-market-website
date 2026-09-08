import { Link } from 'react-router-dom'
import { Compass, House, ShieldCheck } from 'lucide-react'

/** Shown for any address that is not a real page, so a mistyped or stale link
 *  lands somewhere useful instead of a bare browser error. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sand-600 shadow-sm">
          <Compass size={24} />
        </span>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-600">Page not found</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">
          This page does not exist
        </h1>
        <p className="mt-3 text-ink-600">
          The address may have been mistyped, or the page may have been removed.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            <House size={16} /> Go back home
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-400"
          >
            <ShieldCheck size={16} /> Admin sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
