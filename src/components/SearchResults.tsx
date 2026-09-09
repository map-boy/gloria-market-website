import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import type { Product, Section } from '../types'
import ProductCard from './ProductCard'

interface Props {
  query: string
  products: Product[]
  sections: Section[]
  currency: string
}

export default function SearchResults({ query, products, sections, currency }: Props) {
  const titleOf = (sectionId: string) => sections.find((s) => s.id === sectionId)?.title

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-4">
        <h2 className="font-display text-xl font-bold text-ink-900 md:text-2xl">
          Results for “{query}”
        </h2>
        <p className="mt-0.5 text-sm text-ink-400">
          {products.length} product{products.length === 1 ? '' : 's'} found
        </p>
      </header>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 py-16 text-center">
          <SearchX size={28} className="mx-auto text-ink-200" />
          <p className="mt-3 font-medium text-ink-800">Nothing matched that search</p>
          <p className="mt-1 text-sm text-ink-400">Try a shorter word, or check the spelling.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Show everything
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} categoryName={titleOf(p.sectionId)} currency={currency} />
          ))}
        </div>
      )}
    </section>
  )
}
