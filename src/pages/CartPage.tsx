import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useProducts, useSiteSettings } from '../hooks/useFirestore'
import { useCart } from '../context/CartContext'
import { formatPrice, whatsappLink } from '../lib/format'
import { SITE_NAME, shopWhatsapp } from '../lib/config'
import MediaFrame from '../components/MediaFrame'
import SocialIcon from '../components/SocialIcon'

export default function CartPage() {
  const { lines, setQuantity, remove, clear } = useCart()
  const { products, loading } = useProducts()
  const { settings } = useSiteSettings()

  // A product can be deleted while it sits in someone's basket.
  const rows = lines
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((r): r is { line: typeof r.line; product: NonNullable<typeof r.product> } => Boolean(r.product))

  const total = rows.reduce((sum, r) => sum + r.product.price * r.line.quantity, 0)
  const name = settings.siteName || SITE_NAME

  const orderMessage =
    `Hello ${name}, I would like to order:\n\n` +
    rows.map((r) => `• ${r.product.name} × ${r.line.quantity}` +
      (r.product.price ? ` — ${formatPrice(r.product.price * r.line.quantity, settings.currency)}` : ''))
      .join('\n') +
    (total > 0 ? `\n\nTotal: ${formatPrice(total, settings.currency)}` : '')

  if (loading) return <p className="py-24 text-center text-sm text-ink-400">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-ink-900">
        <ArrowLeft size={15} /> Keep shopping
      </Link>

      <h1 className="font-display text-2xl font-bold text-ink-900">Your basket</h1>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 py-16 text-center">
          <ShoppingCart size={28} className="mx-auto text-ink-200" />
          <p className="mt-3 font-medium text-ink-800">Your basket is empty</p>
          <p className="mt-1 text-sm text-ink-400">Add something from the shop to see it here.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {rows.map(({ line, product }) => {
              const max = Math.max(1, product.stock)
              return (
                <div key={product.id} className="flex gap-3 rounded-2xl border border-ink-100 bg-white p-3">
                  <Link to={`/product/${product.id}`} className="shrink-0">
                    <MediaFrame
                      media={product.media?.[0] ?? null}
                      alt={product.name}
                      className="h-20 w-20 overflow-hidden rounded-xl"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium text-ink-900 hover:underline">
                      {product.name}
                    </Link>
                    {product.price > 0 && (
                      <p className="mt-0.5 text-sm font-bold text-ink-900">
                        {formatPrice(product.price, settings.currency)}
                      </p>
                    )}
                    {line.quantity > product.stock && (
                      <p className="mt-0.5 text-xs font-medium text-red-600">
                        Only {product.stock} left
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-ink-100">
                        <button
                          onClick={() => setQuantity(product.id, line.quantity - 1)}
                          aria-label="Fewer"
                          className="p-1.5 text-ink-600 transition hover:bg-ink-50"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink-900">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(product.id, Math.min(max, line.quantity + 1))}
                          disabled={line.quantity >= max}
                          aria-label="More"
                          className="p-1.5 text-ink-600 transition hover:bg-ink-50 disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {product.price > 0 && (
                    <p className="shrink-0 text-sm font-bold text-ink-900">
                      {formatPrice(product.price * line.quantity, settings.currency)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {total > 0 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink-50 px-5 py-4">
              <span className="font-medium text-ink-800">Total</span>
              <span className="font-display text-xl font-bold text-ink-900">
                {formatPrice(total, settings.currency)}
              </span>
            </div>
          )}

          {(
            <a
              href={whatsappLink(shopWhatsapp(settings.whatsappNumber), orderMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <SocialIcon name="whatsapp" size={18} /> Send this order on WhatsApp
            </a>
          )}

          {(settings.momoCode || settings.momoName) && (
            <div className="mt-4 rounded-2xl bg-sand-50 p-4 text-sm">
              <p className="font-semibold text-ink-900">Pay with mobile money</p>
              {settings.momoName && <p className="mt-1 text-ink-600">{settings.momoName}</p>}
              {settings.momoCode && <p className="font-bold text-ink-900">{settings.momoCode}</p>}
            </div>
          )}

          <button
            onClick={() => confirm('Empty your basket?') && clear()}
            className="mt-4 w-full rounded-xl border border-ink-100 py-3 text-sm font-medium text-ink-400 transition hover:border-red-200 hover:text-red-600"
          >
            Empty basket
          </button>
        </>
      )}
    </div>
  )
}
