import { Link } from 'react-router-dom'
import { Images } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../lib/format'
import MediaFrame from './MediaFrame'

interface Props {
  product: Product
  /** Section title, shown under the price like a category label. */
  categoryName?: string
  currency: string
}

export default function ProductCard({ product, categoryName, currency }: Props) {
  const media = product.media ?? []
  const price = formatPrice(product.price, currency)
  const oldPrice = formatPrice(product.oldPrice, currency)
  const inStock = product.stock > 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-ink-100 bg-white transition hover:shadow-md">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-white"
      >
        <MediaFrame
          media={media[0] ?? null}
          alt={product.name}
          className="h-full w-full transition duration-500 hover:scale-105"
        />
        {product.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        {media.length > 1 && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-ink-600">
            <Images size={11} /> {media.length}
          </span>
        )}
        {!inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink-900/80 py-1 text-center text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-0.5 border-t border-ink-100 p-3 pt-3">
        <h3 className="line-clamp-2 text-sm text-ink-800">{product.name}</h3>

        {price && (
          <p className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-ink-900">{price}</span>
            {oldPrice && <span className="text-xs text-ink-400 line-through">{oldPrice}</span>}
          </p>
        )}

        {inStock && <p className="mt-0.5 text-xs text-ink-400">{product.stock} in stock</p>}
        {categoryName && <p className="mb-3 text-xs text-ink-400">{categoryName}</p>}

        <Link
          to={`/product/${product.id}`}
          className="mt-auto block rounded-lg bg-ink-50 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-ink-700 transition hover:bg-ink-100"
        >
          View product
        </Link>
      </div>
    </article>
  )
}
