import { useSearchParams } from 'react-router-dom'
import { useHighlights, useProducts, useSections, useSiteSettings } from '../hooks/useFirestore'
import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import SectionBlock from '../components/SectionBlock'
import SearchResults from '../components/SearchResults'
import HighlightStrip from '../components/HighlightStrip'
import About from '../components/About'

export default function Home() {
  const { settings } = useSiteSettings()
  const { sections, loading: loadingSections } = useSections()
  const { bySection, products } = useProducts()
  const { highlights } = useHighlights()
  const [params] = useSearchParams()

  const query = (params.get('q') ?? '').trim()
  const visibleSections = sections.filter((s) => s.visible !== false)

  if (query) {
    const needle = query.toLowerCase()
    const sectionTitle = (id: string) => sections.find((s) => s.id === id)?.title ?? ''
    const matches = products.filter(
      (p) =>
        p.visible !== false &&
        (p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle) ||
          sectionTitle(p.sectionId).toLowerCase().includes(needle)),
    )
    return (
      <SearchResults query={query} products={matches} sections={sections} currency={settings.currency} />
    )
  }

  return (
    <>
      <Hero settings={settings} />

      <div id="shop">
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
            <SectionBlock
              key={s.id}
              section={s}
              products={bySection.get(s.id) ?? []}
              currency={settings.currency}
            />
          ))
        )}

        <HighlightStrip highlights={highlights} />
        <About settings={settings} />
      </div>
    </>
  )
}
