import type { Highlight } from '../types'
import { highlightIcon } from '../lib/icons'

export default function HighlightStrip({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => {
          const Icon = highlightIcon(h.iconKey)
          return (
            <div key={h.id} className="flex items-center gap-4 rounded-2xl bg-sand-100 px-5 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sand-600">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">{h.title}</p>
                {h.subtitle && <p className="truncate text-sm text-ink-400">{h.subtitle}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
