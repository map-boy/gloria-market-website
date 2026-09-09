import type { Product, Section } from '../types'
import ProductCard from './ProductCard'

const columnClass: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-3 lg:grid-cols-4',
}

export default function SectionBlock({
  section, products, currency,
}: { section: Section; products: Product[]; currency: string }) {
  const visible = products.filter((p) => p.visible !== false)

  return (
    <section id={`section-${section.id}`} className="mx-auto max-w-6xl scroll-mt-32 px-4 py-8">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink-900 md:text-2xl">
            {section.title}
          </h2>
          {section.subtitle && <p className="mt-0.5 text-sm text-ink-400">{section.subtitle}</p>}
        </div>
        {visible.length > 0 && (
          <p className="text-sm font-semibold text-ink-600">
            {visible.length} product{visible.length === 1 ? '' : 's'}
          </p>
        )}
      </header>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 py-14 text-center text-sm text-ink-400">
          Nothing here yet — check back soon.
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-3 ${columnClass[section.columns] ?? columnClass[4]}`}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} categoryName={section.title} currency={currency} />
          ))}
        </div>
      )}
    </section>
  )
}
