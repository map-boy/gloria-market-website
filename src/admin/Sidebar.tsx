import { Link } from 'react-router-dom'
import { ChevronLeft, ExternalLink, LifeBuoy, LogOut, ShoppingBag, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { NAV, NAV_GROUPS, type PanelId } from './nav'

interface Props {
  active: PanelId
  onSelect: (id: PanelId) => void
  counts: Partial<Record<PanelId, number>>
  /** 0-100, how much of the home page has been filled in. */
  progress: number
  collapsed: boolean
  onToggleCollapse: () => void
  /** Mobile drawer state — ignored on desktop. */
  mobileOpen: boolean
  onCloseMobile: () => void
  siteName: string
  logoUrl: string
}

function ProgressRing({ value }: { value: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
        <circle
          cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
          className="text-sand-400 transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
        {value}%
      </span>
    </div>
  )
}

export default function Sidebar({
  active, onSelect, counts, progress, collapsed, onToggleCollapse, mobileOpen, onCloseMobile,
  siteName, logoUrl,
}: Props) {
  const { user, logout } = useAuth()

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/60 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-ink-950 text-ink-200 transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Shop identity */}
        <div className="flex items-center gap-3 px-4 py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 text-white">
            {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-cover" /> : <ShoppingBag size={18} />}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{siteName || 'Your shop'}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-ink-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
              </p>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          <button
            onClick={onToggleCollapse}
            className={`hidden rounded-lg p-1.5 text-ink-400 transition hover:bg-white/10 hover:text-white lg:block ${
              collapsed ? 'rotate-180' : ''
            }`}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Setup progress + navigation share one scroll area */}
        <nav className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          {!collapsed && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <ProgressRing value={progress} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Setup progress</p>
                <p className="text-xs text-ink-400">
                  {progress === 100 ? 'Your page looks complete.' : 'Fill the blanks to finish your page.'}
                </p>
              </div>
            </div>
          )}
          {NAV_GROUPS.map((group) => (
            <div key={group} className="mb-5">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400/70">
                  {group}
                </p>
              )}
              <ul className="space-y-1">
                {NAV.filter((n) => n.group === group).map(({ id, label, hint, Icon }) => {
                  const isActive = active === id
                  const count = counts[id]
                  return (
                    <li key={id}>
                      <button
                        onClick={() => onSelect(id)}
                        title={collapsed ? label : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          isActive ? 'bg-white/10 text-white' : 'text-ink-400 hover:bg-white/5 hover:text-white'
                        } ${collapsed ? 'justify-center' : ''}`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sand-400" />
                        )}
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                            isActive ? 'bg-sand-400 text-ink-950' : 'bg-white/5 text-ink-200 group-hover:bg-white/10'
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        {!collapsed && (
                          <>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{label}</span>
                              <span className="block truncate text-[11px] text-ink-400">{hint}</span>
                            </span>
                            {count !== undefined && count > 0 && (
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-ink-200">
                                {count}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Support + account */}
        <div className="space-y-2 border-t border-white/5 px-3 pb-4 pt-3">
          {!collapsed && (
            <button
              onClick={() => onSelect('help')}
              className="flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r from-sand-400/20 to-transparent px-3 py-2.5 text-left ring-1 ring-white/10 transition hover:ring-sand-400/40"
            >
              <span className="text-sand-400"><LifeBuoy size={16} /></span>
              <span className="text-sm font-semibold text-white">Need a hand?</span>
            </button>
          )}

          <Link
            to="/"
            target="_blank"
            className={`flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:border-white/30 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title="View site"
          >
            <ExternalLink size={16} />
            {!collapsed && 'View site'}
          </Link>

          <div className={`flex items-center gap-3 rounded-xl bg-white/5 p-2 ${collapsed ? 'justify-center' : ''}`}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-400 text-xs font-bold text-ink-950">
                {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
              </span>
            )}
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {user?.displayName || 'Admin'}
                  </span>
                  <span className="block truncate text-[11px] text-ink-400">{user?.email}</span>
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-ink-400 transition hover:bg-red-500/15 hover:text-red-300"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
