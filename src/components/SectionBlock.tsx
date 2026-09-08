import type { Product, Section } from '../types'
import ProductCard from './ProductCard'

const columnClass: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export default function SectionBlock({ section, products }: { section: Section; products: Product[] }) {
  const visible = products.filter((p) => p.visible !== false)

  return (
    <section id={`section-${section.id}`} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
      <header className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{section.title}</h2>
        {section.subtitle && <p className="mt-1 text-ink-400">{section.subtitle}</p>}
      </header>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-200 bg-sand-50/60 py-16 text-center text-sm text-ink-400">
          Nothing here yet — check back soon.
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-4 ${columnClass[section.columns] ?? columnClass[4]}`}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
