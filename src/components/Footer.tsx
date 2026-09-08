import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { SiteSettings } from '../types'
import { SOCIAL_KEYS } from '../lib/icons'
import { SITE_NAME } from '../lib/config'
import SocialIcon from './SocialIcon'

function socialHref(key: string, value: string) {
  if (key === 'whatsapp' && !/^https?:/i.test(value)) {
    return `https://wa.me/${value.replace(/[^0-9]/g, '')}`
  }
  return /^https?:/i.test(value) ? value : `https://${value}`
}

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = SOCIAL_KEYS.filter((k) => settings.socials?.[k])
  const contacts = [
    { Icon: Phone, value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
    { Icon: Mail, value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { Icon: MapPin, value: settings.address, href: '' },
    { Icon: Clock, value: settings.openingHours, href: '' },
  ].filter((c) => c.value)

  return (
    <footer id="contact" className="mt-8 scroll-mt-20 bg-ink-950 text-ink-200">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-display text-xl font-bold text-white">{settings.siteName || SITE_NAME}</p>
            {settings.tagline && <p className="mt-1 text-sm text-ink-400">{settings.tagline}</p>}
            {settings.footerNote && (
              <p className="mt-4 max-w-sm whitespace-pre-line text-sm text-ink-400">{settings.footerNote}</p>
            )}
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map((k) => (
                  <a
                    key={k}
                    href={socialHref(k, settings.socials[k])}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={k}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <SocialIcon name={k} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {contacts.length > 0 && (
            <div className="md:justify-self-end">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Get in touch</p>
              <ul className="space-y-3 text-sm">
                {contacts.map(({ Icon, value, href }) => (
                  <li key={value} className="flex items-start gap-3">
                    <Icon size={16} className="mt-0.5 shrink-0 text-sand-400" />
                    {href ? (
                      <a href={href} className="transition hover:text-white">{value}</a>
                    ) : (
                      <span className="whitespace-pre-line">{value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} {settings.siteName || SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
