import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { useProducts, useSections, useSiteSettings } from '../hooks/useFirestore'
import Sidebar from './Sidebar'
import { NAV, type PanelId } from './nav'
import { setupProgress, setupSteps } from './setup'
import OverviewPanel from './panels/OverviewPanel'
import BrandPanel from './panels/BrandPanel'
import HeroPanel from './panels/HeroPanel'
import SectionsPanel from './panels/SectionsPanel'
import HighlightsPanel from './panels/HighlightsPanel'
import AboutPanel from './panels/AboutPanel'
import TeamPanel from './panels/TeamPanel'
import HelpPanel from './panels/HelpPanel'

const COLLAPSE_KEY = 'admin:sidebar-collapsed'

/** The whole panel is one screen — the sidebar swaps what is shown, so the
 *  admin never loses their place or waits for a page to load. */
export default function AdminApp() {
  const [panel, setPanel] = useState<PanelId>('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === '1',
  )

  const { settings } = useSiteSettings()
  const { sections } = useSections()
  const { products } = useProducts()

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const select = (id: PanelId) => {
    setPanel(id)
    setMobileOpen(false)
    window.scrollTo({ top: 0 })
  }

  const progress = setupProgress(setupSteps(settings, sections, products))
  const current = NAV.find((n) => n.id === panel)

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        active={panel}
        onSelect={select}
        counts={{ sections: sections.length }}
        progress={progress}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        siteName={settings.siteName}
        logoUrl={settings.logoUrl}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-50"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <p className="font-semibold text-ink-900">{current?.label ?? 'Admin'}</p>
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
          {panel === 'overview' && (
            <OverviewPanel settings={settings} sections={sections} products={products} onNavigate={select} />
          )}
          {panel === 'brand' && <BrandPanel />}
          {panel === 'hero' && <HeroPanel />}
          {panel === 'sections' && <SectionsPanel />}
          {panel === 'highlights' && <HighlightsPanel />}
          {panel === 'about' && <AboutPanel />}
          {panel === 'team' && <TeamPanel />}
          {panel === 'help' && <HelpPanel />}
        </main>
      </div>
    </div>
  )
}
