import type { SiteSettings } from '../types'

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null
  const hasContent = settings.siteName || settings.tagline || settings.heroImageUrl

  if (!hasContent) return null

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          {settings.heroBadgeText && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {settings.heroBadgeText}
            </p>
          )}
          {settings.siteName && (
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
              {settings.siteName}
            </h1>
          )}
          {settings.tagline && (
            <p className="mt-4 max-w-md text-slate-500">{settings.tagline}</p>
          )}
          {(settings.primaryCtaText || settings.secondaryCtaText) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {settings.primaryCtaText && (
                <a href="#products" className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  {settings.primaryCtaText}
                </a>
              )}
              {settings.secondaryCtaText && (
                <a href="#products" className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">
                  {settings.secondaryCtaText}
                </a>
              )}
            </div>
          )}
        </div>
        {settings.heroImageUrl && (
          <div className="overflow-hidden rounded-3xl bg-white">
            <img src={settings.heroImageUrl} alt={settings.siteName} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}