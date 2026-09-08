import { Link } from 'react-router-dom'
import type { SiteSettings, Section } from '../types'

export default function Navbar({ settings, sections }: { settings: SiteSettings | null; sections: Section[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {settings?.logoUrl && (
            <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-8 rounded-full object-cover" />
          )}
          <span className="text-lg font-bold text-slate-900">{settings?.siteName || 'My Shop'}</span>
        </div>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hover:text-slate-900">
              {s.title}
            </a>
          ))}
        </nav>
        <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600">
          Admin
        </Link>
      </div>
    </header>
  )
}
