import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { MediaItem } from '../types'
import MediaFrame from './MediaFrame'

interface Props {
  items: MediaItem[]
  startIndex: number
  title: string
  onClose: () => void
}

export default function Lightbox({ items, startIndex, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)

  const step = useCallback(
    (dir: -1 | 1) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, step])

  if (items.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
      >
        <X size={20} />
      </button>

      <div className="flex w-full max-w-4xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <MediaFrame
          media={items[index]}
          alt={title}
          controls
          className="max-h-[75vh] w-full rounded-2xl bg-ink-900 object-contain"
        />
        <p className="text-sm text-white/70">
          {title}
          {items.length > 1 && ` · ${index + 1} / ${items.length}`}
        </p>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1) }}
            aria-label="Previous"
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1) }}
            aria-label="Next"
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  )
}
