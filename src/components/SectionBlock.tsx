import type { Section } from '../types'
import { useProducts } from '../hooks/useFirestore'
import ProductCard from './ProductCard'

export default function SectionBlock({ section }: { section: Section }) {
  const { products, loading } = useProducts(section.id)

  return (
    <section id={section.id} className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{section.title}</h2>
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
          Nothing here yet
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
