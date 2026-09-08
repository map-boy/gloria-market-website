import type { SiteSettings } from '../types'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 py-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-lg font-bold text-white">{settings?.siteName || 'My Shop'}</p>
        {settings?.tagline && <p className="mt-1 text-sm text-slate-400">{settings.tagline}</p>}
        <div className="mt-4 space-y-1 text-sm">
          {settings?.contactEmail && <p>{settings.contactEmail}</p>}
          {settings?.contactPhone && <p>{settings.contactPhone}</p>}
          {settings?.address && <p>{settings.address}</p>}
        </div>
        <p className="mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {settings?.siteName || 'My Shop'}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
