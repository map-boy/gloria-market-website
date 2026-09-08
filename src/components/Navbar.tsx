import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import type { Section, SiteSettings } from '../types'

export default function Navbar({ settings, sections }: { settings: SiteSettings; sections: Section[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-white">
              <ShoppingBag size={18} />
            </span>
          )}
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-ink-900">
              {settings.siteName || 'Your shop name'}
            </span>
            {settings.tagline && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{settings.tagline}</span>
            )}
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-600 md:flex">
          {sections.map((s) => (
            <a key={s.id} href={`#section-${s.id}`} className="transition hover:text-ink-900">
              {s.title}
            </a>
          ))}
          <a href="#contact" className="transition hover:text-ink-900">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden rounded-lg border border-sand-200 px-3 py-1.5 text-xs font-medium text-ink-400 transition hover:border-sand-400 hover:text-ink-900 sm:block"
          >
            Admin
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-ink-600 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-sand-200 bg-white px-4 py-3 md:hidden">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-ink-600"
            >
              {s.title}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-ink-600">
            Contact
          </a>
          <Link to="/admin" className="block py-2 text-sm text-ink-400">Admin</Link>
        </nav>
      )}
    </header>
  )
}
