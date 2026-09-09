import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBag, ShoppingCart, X } from 'lucide-react'
import type { Section, SiteSettings } from '../types'
import { SITE_NAME } from '../lib/config'
import { useCart } from '../context/CartContext'
import SearchBar from './SearchBar'
import HeaderContact from './HeaderContact'

export default function Navbar({ settings, sections }: { settings: SiteSettings; sections: Section[] }) {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="border-b border-ink-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="-ml-1 rounded-lg p-1.5 text-ink-600 transition hover:bg-ink-50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex min-w-0 flex-1 items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover sm:h-9 sm:w-9" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-white sm:h-9 sm:w-9">
                <ShoppingBag size={18} />
              </span>
            )}
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="line-clamp-2 font-display text-xs font-bold leading-tight text-ink-900 sm:text-lg">
                {settings.siteName || SITE_NAME}
              </span>
              {settings.tagline && (
                <span className="truncate text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  {settings.tagline}
                </span>
              )}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <HeaderContact settings={settings} />

            <Link
              to="/cart"
              className="relative shrink-0 rounded-lg p-2 text-ink-700 transition hover:bg-ink-50"
              aria-label={`Basket, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingCart size={22} />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-ink-100 bg-ink-50/60">
        <div className="mx-auto max-w-6xl px-4 py-2.5">
          <SearchBar />
        </div>
      </div>

      <nav className="hidden border-b border-ink-100 md:block">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-2.5 text-sm font-medium text-ink-600">
          <Link to="/" className="shrink-0 transition hover:text-ink-900">Home</Link>
          {sections.map((s) => (
            <a key={s.id} href={`#section-${s.id}`} className="shrink-0 transition hover:text-ink-900">
              {s.title}
            </a>
          ))}
          <a href="#contact" className="shrink-0 transition hover:text-ink-900">Contact</a>
        </div>
      </nav>

      {open && (
        <nav className="border-b border-ink-100 bg-white px-4 py-3 md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-ink-600">
            Home
          </Link>
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
