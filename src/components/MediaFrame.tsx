import { Image as ImageIcon, Play } from 'lucide-react'
import type { MediaItem } from '../types'

interface Props {
  media: MediaItem | null | undefined
  alt: string
  className?: string
  /** Videos autoplay muted in cards, but play with controls in the lightbox. */
  controls?: boolean
}

export default function MediaFrame({ media, alt, className = '', controls = false }: Props) {
  if (!media) {
    return (
      <div className={`flex items-center justify-center bg-sand-100 text-sand-400 ${className}`}>
        <ImageIcon size={28} strokeWidth={1.5} />
      </div>
    )
  }

  if (media.kind === 'video') {
    return (
      <div className={`relative bg-ink-900 ${className}`}>
        <video
          src={media.url}
          className="h-full w-full object-cover"
          controls={controls}
          muted={!controls}
          loop
          playsInline
          preload="metadata"
        />
        {!controls && (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-ink-950/70 p-1.5 text-white">
            <Play size={12} fill="currentColor" />
          </span>
        )}
      </div>
    )
  }

  return <img src={media.url} alt={alt} loading="lazy" className={`object-cover ${className}`} />
}
