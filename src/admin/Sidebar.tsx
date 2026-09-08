import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Layers, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin', label: 'Site Settings', icon: LayoutDashboard, end: true },
  { to: '/admin/sections', label: 'Sections', icon: Layers, end: false },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-slate-950 text-slate-300">
      <div>
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-white">Admin Panel</p>
          <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
        </div>
        <nav className="mt-2 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-950 hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
