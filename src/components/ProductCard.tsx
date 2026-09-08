import { useState } from 'react'
import { Images } from 'lucide-react'
import type { Product } from '../types'
import MediaFrame from './MediaFrame'
import Lightbox from './Lightbox'

export default function ProductCard({ product }: { product: Product }) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  const media = product.media ?? []
  const cover = media[0] ?? null

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-sand-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5">
        <button
          type="button"
          onClick={() => media.length > 0 && setOpenAt(0)}
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-sand-50"
          aria-label={`View media for ${product.name}`}
        >
          <MediaFrame media={cover} alt={product.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          {media.length > 1 && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-ink-600">
              <Images size={12} /> {media.length}
            </span>
          )}
        </button>

        <div className="p-4">
          <h3 className="font-semibold text-ink-900">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink-400">{product.description}</p>
          )}
          {(product.price || product.oldPrice) && (
            <p className="mt-3 flex items-baseline gap-2">
              {product.price && <span className="text-lg font-bold text-ink-900">{product.price}</span>}
              {product.oldPrice && <span className="text-sm text-ink-400 line-through">{product.oldPrice}</span>}
            </p>
          )}
        </div>
      </article>

      {openAt !== null && (
        <Lightbox items={media} startIndex={openAt} title={product.name} onClose={() => setOpenAt(null)} />
      )}
    </>
  )
}
