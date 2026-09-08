import { useSections, useHighlights, useProducts, useSiteSettings } from '../hooks/useFirestore'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import SectionBlock from '../components/SectionBlock'
import HighlightStrip from '../components/HighlightStrip'
import About from '../components/About'
import Footer from '../components/Footer'

export default function Home() {
  const { settings } = useSiteSettings()
  const { sections, loading: loadingSections } = useSections()
  const { bySection } = useProducts()
  const { highlights } = useHighlights()

  const visibleSections = sections.filter((s) => s.visible !== false)

  return (
    <div id="top" className="min-h-screen bg-white">
      {settings.announcementText && (
        <div className="bg-ink-950 px-4 py-2 text-center text-xs font-medium text-white md:text-sm">
          {settings.announcementText}
        </div>
      )}

      <Navbar settings={settings} sections={visibleSections} />
      <Hero settings={settings} />

      <main id="shop">
        {settings.showCategoryStrip !== false && <CategoryStrip sections={visibleSections} />}

        {loadingSections ? (
          <p className="py-20 text-center text-sm text-ink-400">Loading…</p>
        ) : visibleSections.length === 0 ? (
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="font-display text-xl font-bold text-ink-900">This shop is being set up</p>
            <p className="mt-2 text-sm text-ink-400">
              Pictures and videos will appear here as soon as they are posted.
            </p>
          </div>
        ) : (
          visibleSections.map((s) => (
            <SectionBlock key={s.id} section={s} products={bySection.get(s.id) ?? []} />
          ))
        )}

        <HighlightStrip highlights={highlights} />
        <About settings={settings} />
      </main>

      <Footer settings={settings} />
    </div>
  )
}
