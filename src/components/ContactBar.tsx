import type { SiteSettings } from '../types'
import { whatsappDigits } from '../lib/format'
import SocialIcon from './SocialIcon'

/** WhatsApp number and mobile money details, kept high on the page so a
 *  shopper can order or pay without hunting for them. */
export default function ContactBar({ settings }: { settings: SiteSettings }) {
  const hasWhatsapp = Boolean(settings.whatsappNumber)
  const hasMomo = Boolean(settings.momoCode || settings.momoName)
  if (settings.showContactBar === false || (!hasWhatsapp && !hasMomo)) return null

  return (
    <div className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 sm:justify-between">
        {hasWhatsapp && (
          <a
            href={`https://wa.me/${whatsappDigits(settings.whatsappNumber)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
          >
            <span className="text-emerald-500">
              <SocialIcon name="whatsapp" size={20} />
            </span>
            {settings.whatsappNumber}
          </a>
        )}

        {hasMomo && (
          <p className="text-center text-xs font-semibold uppercase leading-tight tracking-wide text-ink-600 sm:text-right">
            {settings.momoName && <span className="block">{settings.momoName}</span>}
            {settings.momoCode && <span className="block text-ink-900">{settings.momoCode}</span>}
          </p>
        )}
      </div>
    </div>
  )
}
