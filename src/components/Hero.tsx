import type { SiteSettings } from '../types'
import MediaFrame from './MediaFrame'

export default function Hero({ settings }: { settings: SiteSettings }) {
  const hasText = settings.heroTitle || settings.heroSubtitle || settings.heroBadgeText
  const hasCta = settings.primaryCtaText || settings.secondaryCtaText
  if (!hasText && !settings.heroMedia && !hasCta) return null

  return (
    <section className="bg-sand-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          {settings.heroBadgeText && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sand-600">
              {settings.heroBadgeText}
            </p>
          )}
          {settings.heroTitle && (
            <h1 className="font-display text-4xl font-bold leading-tight text-ink-900 md:text-5xl">
              {settings.heroTitle}
            </h1>
          )}
          {settings.heroSubtitle && (
            <p className="mt-4 max-w-md text-ink-600">{settings.heroSubtitle}</p>
          )}
          {hasCta && (
            <div className="mt-8 flex flex-wrap gap-3">
              {settings.primaryCtaText && (
                <a
                  href={settings.primaryCtaLink || '#shop'}
                  className="rounded-lg bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                >
                  {settings.primaryCtaText}
                </a>
              )}
              {settings.secondaryCtaText && (
                <a
                  href={settings.secondaryCtaLink || '#shop'}
                  className="rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-400"
                >
                  {settings.secondaryCtaText}
                </a>
              )}
            </div>
          )}
        </div>

        {settings.heroMedia && (
          <MediaFrame
            media={settings.heroMedia}
            alt={settings.heroTitle || settings.siteName}
            className="aspect-4/3 w-full overflow-hidden rounded-3xl"
          />
        )}
      </div>
    </section>
  )
}
