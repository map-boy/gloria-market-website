import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Link2, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useProducts, useSections, useSiteSettings } from '../hooks/useFirestore'
import { useCart } from '../context/CartContext'
import { formatPrice, whatsappDigits } from '../lib/format'
import { SITE_NAME } from '../lib/config'
import MediaFrame from '../components/MediaFrame'
import Lightbox from '../components/Lightbox'
import SocialIcon from '../components/SocialIcon'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { products, loading } = useProducts()
  const { sections } = useSections()
  const { settings } = useSiteSettings()
  const { add, quantityOf } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [activeMedia, setActiveMedia] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === id)
  const section = sections.find((s) => s.id === product?.sectionId)
  const name = settings.siteName || SITE_NAME

  useEffect(() => {
    if (product) document.title = `${product.name} — ${name}`
  }, [product, name])

  if (loading) {
    return <p className="py-24 text-center text-sm text-ink-400">Loading…</p>
  }

  if (!product || product.visible === false) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">This product is not available</h1>
        <p className="mt-2 text-sm text-ink-400">It may have been removed or hidden.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          <ArrowLeft size={16} /> Back to the shop
        </Link>
      </div>
    )
  }

  const media = product.media ?? []
  const price = formatPrice(product.price, settings.currency)
  const oldPrice = formatPrice(product.oldPrice, settings.currency)
  const inStock = product.stock > 0
  const max = Math.max(1, product.stock)
  const inCart = quantityOf(product.id)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the address bar still has the link */
    }
  }

  const addToCart = () => {
    add(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const orderText = encodeURIComponent(
    `Hello ${name}, I would like to order:\n\n${product.name}\nQuantity: ${quantity}` +
    (price ? `\nPrice: ${price}` : '') +
    `\n\n${window.location.href}`,
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-ink-900"
      >
        <ArrowLeft size={15} /> Back to the shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <button
            type="button"
            onClick={() => media.length > 0 && setZoomed(true)}
            className="block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-ink-100 bg-white"
            aria-label="View larger"
          >
            <MediaFrame media={media[activeMedia] ?? null} alt={product.name} className="h-full w-full" />
          </button>

          {media.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {media.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMedia(i)}
                  aria-label={`Show item ${i + 1}`}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === activeMedia ? 'border-ink-900' : 'border-ink-100 hover:border-ink-400'
                  }`}
                >
                  <MediaFrame media={m} alt="" className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.badge && (
            <span className="mb-2 inline-block rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{product.name}</h1>
          {section && <p className="mt-1 text-sm text-ink-400">{section.title}</p>}

          {price && (
            <p className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-ink-900">{price}</span>
              {oldPrice && <span className="text-base text-ink-400 line-through">{oldPrice}</span>}
            </p>
          )}

          <p className={`mt-2 text-sm font-medium ${inStock ? 'text-emerald-600' : 'text-red-600'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">{product.description}</p>
          )}

          {inStock && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-ink-800">Quantity</span>
              <div className="flex items-center rounded-xl border border-ink-100">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Fewer"
                  className="p-2.5 text-ink-600 transition hover:bg-ink-50 disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-ink-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                  disabled={quantity >= max}
                  aria-label="More"
                  className="p-2.5 text-ink-600 transition hover:bg-ink-50 disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>
              {inCart > 0 && <span className="text-xs text-ink-400">{inCart} already in basket</span>}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addToCart}
              disabled={!inStock}
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? <Check size={17} /> : <ShoppingCart size={17} />}
              {added ? 'Added to basket' : 'Add to basket'}
            </button>

            {settings.whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappDigits(settings.whatsappNumber)}?text=${orderText}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <SocialIcon name="whatsapp" size={17} /> Order on WhatsApp
              </a>
            )}
          </div>

          <button
            onClick={copyLink}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-ink-100 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-400"
          >
            {copied ? <Check size={16} /> : <Link2 size={16} />}
            {copied ? 'Link copied' : 'Copy link to share'}
          </button>

          {(settings.momoCode || settings.momoName) && (
            <div className="mt-6 rounded-2xl bg-sand-50 p-4 text-sm">
              <p className="font-semibold text-ink-900">Pay with mobile money</p>
              {settings.momoName && <p className="mt-1 text-ink-600">{settings.momoName}</p>}
              {settings.momoCode && <p className="font-bold text-ink-900">{settings.momoCode}</p>}
            </div>
          )}
        </div>
      </div>

      {zoomed && (
        <Lightbox items={media} startIndex={activeMedia} title={product.name} onClose={() => setZoomed(false)} />
      )}
    </div>
  )
}
