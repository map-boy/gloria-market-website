import { ArrowRight, Check, Film, Image as ImageIcon, Layers, Package } from 'lucide-react'
import type { Product, Section, SiteSettings } from '../../types'
import type { PanelId } from '../nav'
import { setupProgress, setupSteps } from '../setup'
import { Card, PanelHeader } from '../ui'

interface Props {
  settings: SiteSettings
  sections: Section[]
  products: Product[]
  onNavigate: (id: PanelId) => void
}

export default function OverviewPanel({ settings, sections, products, onNavigate }: Props) {
  const media = products.flatMap((p) => p.media ?? [])
  const steps = setupSteps(settings, sections, products)
  const progress = setupProgress(steps)
  const nextStep = steps.find((s) => !s.done)

  const stats = [
    { label: 'Sections', value: sections.length, Icon: Layers },
    { label: 'Items', value: products.length, Icon: Package },
    { label: 'Pictures', value: media.filter((m) => m.kind === 'image').length, Icon: ImageIcon },
    { label: 'Videos', value: media.filter((m) => m.kind === 'video').length, Icon: Film },
  ]

  return (
    <>
      <PanelHeader
        title={settings.siteName ? `${settings.siteName} — overview` : 'Overview'}
        description="Everything on your home page is edited from the menu on the left."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-ink-100 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-sand-600">
              <Icon size={17} />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</p>
            <p className="text-sm text-ink-400">{label}</p>
          </div>
        ))}
      </div>

      {nextStep && (
        <button
          onClick={() => onNavigate(nextStep.panel)}
          className="mb-5 flex w-full items-center justify-between gap-4 rounded-2xl bg-ink-950 p-5 text-left text-white transition hover:bg-ink-900"
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.18em] text-sand-400">Next step</span>
            <span className="mt-1 block font-semibold">{nextStep.label}</span>
          </span>
          <ArrowRight size={20} className="shrink-0 text-sand-400" />
        </button>
      )}

      <Card
        title="Setting up your page"
        description={progress === 100 ? 'All done — your page is complete.' : `${progress}% complete`}
      >
        <ul className="space-y-1">
          {steps.map((s) => (
            <li key={s.label}>
              <button
                onClick={() => onNavigate(s.panel)}
                className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-ink-50"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    s.done ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-transparent'
                  }`}
                >
                  <Check size={13} />
                </span>
                <span className={`flex-1 text-sm ${s.done ? 'text-ink-400 line-through' : 'text-ink-800'}`}>
                  {s.label}
                </span>
                <ArrowRight size={15} className="text-ink-200 transition group-hover:text-ink-600" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
