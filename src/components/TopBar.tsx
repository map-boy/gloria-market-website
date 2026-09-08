import type { SiteSettings } from '../types'

export default function TopBar({ settings }: { settings: SiteSettings | null }) {
  if (!settings?.announcementText) return null
  return (
    <div className="bg-slate-900 py-2 text-center text-xs font-medium text-white md:text-sm">
      {settings.announcementText}
    </div>
  )
}