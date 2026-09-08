import type { Section } from '../types'

export default function CategoryRow({ sections }: { sections: Section[] }) {
  if (sections.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-center text-xl font-bold text-slate-900">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="flex w-24 flex-col items-center gap-2 text-center transition hover:opacity-75">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
              {s.iconUrl ? (
                <img src={s.iconUrl} alt={s.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-slate-400">{s.title.charAt(0)}</span>
              )}
            </div>
            <span className="text-xs font-medium text-slate-700">{s.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}