import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSections, useSiteSettings } from '../hooks/useFirestore'
import { SITE_NAME } from '../lib/config'
import Navbar from './Navbar'
import ContactBar from './ContactBar'
import Footer from './Footer'

/** Header, contact bar and footer stay put while the page inside changes, so
 *  the shop name and search never flash or reload. */
export default function ShopLayout() {
  const { settings } = useSiteSettings()
  const { sections } = useSections()
  const visibleSections = sections.filter((s) => s.visible !== false)
  const name = settings.siteName || SITE_NAME

  useEffect(() => {
    document.title = settings.tagline ? `${name} — ${settings.tagline}` : name
  }, [name, settings.tagline])

  return (
    <div id="top" className="flex min-h-screen flex-col bg-white">
      {settings.announcementText && (
        <div className="bg-ink-950 px-4 py-2 text-center text-xs font-medium text-white md:text-sm">
          {settings.announcementText}
        </div>
      )}

      <Navbar settings={settings} sections={visibleSections} />
      <ContactBar settings={settings} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer settings={settings} />
    </div>
  )
}
