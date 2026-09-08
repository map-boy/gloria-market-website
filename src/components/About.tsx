import type { SiteSettings } from '../types'

export default function About({ settings }: { settings: SiteSettings }) {
  if (!settings.aboutTitle && !settings.aboutText) return null

  return (
    <section id="about" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-14 text-center">
      {settings.aboutTitle && (
        <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{settings.aboutTitle}</h2>
      )}
      {settings.aboutText && (
        <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">{settings.aboutText}</p>
      )}
    </section>
  )
}
