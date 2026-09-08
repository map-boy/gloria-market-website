import { TriangleAlert } from 'lucide-react'

const KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_OWNER_EMAIL',
]

/** Shown instead of a blank page when the Firebase keys are missing. */
export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900 p-8">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
          <TriangleAlert size={20} />
        </span>
        <h1 className="font-display text-2xl font-bold text-white">Connect Firebase to finish setup</h1>
        <p className="mt-2 text-sm text-ink-400">
          Copy <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">.env.example</code> to{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">.env</code>, fill in the values from your
          Firebase project, then restart the dev server.
        </p>
        <ul className="mt-5 space-y-1.5 rounded-2xl bg-ink-950 p-4 font-mono text-xs text-ink-200">
          {KEYS.map((k) => (
            <li key={k}>{k}=</li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-ink-400">
          Full steps are in the README, including turning on Google sign-in.
        </p>
      </div>
    </div>
  )
}
