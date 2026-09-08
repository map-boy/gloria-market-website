import type { SiteSettings } from '../types'
import { shopWhatsapp } from '../lib/config'
import { whatsappLink } from '../lib/format'
import SocialIcon from './SocialIcon'

/** WhatsApp number and payment details, sitting beside the basket button.
 *  The whole block is one tap through to a WhatsApp chat. */
export default function HeaderContact({ settings }: { settings: SiteSettings }) {
  if (settings.showContactBar === false) return null

  const number = shopWhatsapp(settings.whatsappNumber)
  const shopName = settings.siteName || ''
  const message = shopName ? `Hello ${shopName}, I would like to ask about…` : 'Hello, I would like to ask about…'

  return (
    <a
      href={whatsappLink(number, message)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Message us on WhatsApp at ${number}`}
      className="flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1 transition hover:bg-emerald-50 sm:gap-2 sm:px-2"
    >
      <span className="shrink-0 text-emerald-500">
        <SocialIcon name="whatsapp" size={20} />
      </span>

      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[10px] font-bold text-red-600 sm:text-sm">{number}</span>

        {settings.whatsappNote && (
          <span className="hidden text-[10px] text-ink-400 sm:block">{settings.whatsappNote}</span>
        )}

        {settings.momoName && (
          <span className="block text-[9px] font-semibold uppercase tracking-wide text-ink-600 sm:text-[10px]">
            {settings.momoName}
          </span>
        )}
        {settings.momoCode && (
          <span className="block text-[9px] font-bold text-ink-900 sm:text-[10px]">{settings.momoCode}</span>
        )}
      </span>
    </a>
  )
}
