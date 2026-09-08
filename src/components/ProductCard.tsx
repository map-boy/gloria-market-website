import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden bg-slate-100">
        {product.videoUrl ? (
          <video src={product.videoUrl} className="h-full w-full object-cover" controls muted loop />
        ) : product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">No media</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        {product.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>}
        {product.price && <p className="mt-2 font-bold text-slate-900">{product.price}</p>}
      </div>
    </div>
  )
}
