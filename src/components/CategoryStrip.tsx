import type { Section } from '../types'

export default function CategoryStrip({ sections }: { sections: Section[] }) {
  if (sections.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
        Browse
      </h2>
      <div className="no-scrollbar flex justify-start gap-3 overflow-x-auto pb-2 sm:justify-center sm:flex-wrap">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#section-${s.id}`}
            className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl border border-sand-200 bg-white px-2 py-3 text-center transition hover:border-sand-400 hover:shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sand-100">
              {s.iconUrl ? (
                <img src={s.iconUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-lg font-bold text-sand-600">
                  {s.title.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
            <span className="truncate text-xs font-medium text-ink-600">{s.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
