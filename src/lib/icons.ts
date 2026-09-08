import {
  BadgeCheck, Clock, CreditCard, Gift, Heart, Leaf, MapPin, Package, Percent,
  Phone, ShieldCheck, Sparkles, Star, Store, Truck, type LucideIcon,
} from 'lucide-react'

/** Icons the admin can pick for a highlight. The list is here only so the
 *  picker has something to show — the wording is always the admin's own. */
export const HIGHLIGHT_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'truck', label: 'Delivery', Icon: Truck },
  { key: 'gift', label: 'Gift', Icon: Gift },
  { key: 'percent', label: 'Discount', Icon: Percent },
  { key: 'shield', label: 'Guarantee', Icon: ShieldCheck },
  { key: 'star', label: 'Star', Icon: Star },
  { key: 'heart', label: 'Heart', Icon: Heart },
  { key: 'phone', label: 'Phone', Icon: Phone },
  { key: 'clock', label: 'Hours', Icon: Clock },
  { key: 'badge', label: 'Quality', Icon: BadgeCheck },
  { key: 'sparkles', label: 'New', Icon: Sparkles },
  { key: 'package', label: 'Package', Icon: Package },
  { key: 'leaf', label: 'Natural', Icon: Leaf },
  { key: 'card', label: 'Payment', Icon: CreditCard },
  { key: 'store', label: 'Store', Icon: Store },
  { key: 'pin', label: 'Location', Icon: MapPin },
]

export function highlightIcon(key: string): LucideIcon {
  return HIGHLIGHT_ICONS.find((i) => i.key === key)?.Icon ?? Sparkles
}

export type SocialKey = 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'whatsapp'

/** lucide dropped brand marks, so the few we need live here as paths. */
export const SOCIAL_PATHS: Record<SocialKey, string> = {
  facebook: 'M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 3.4A6.4 6.4 0 1 0 18.4 12 6.4 6.4 0 0 0 12 5.6m0 10.6A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2m6.6-10.9a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5',
  twitter: 'M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.9 22H3l7-8L2 2h6.2l4.3 5.7zm-1 18h1.6L7.9 3.7H6.2z',
  tiktok:
    'M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .7.1V9.5a5.9 5.9 0 0 0-.7 0 5.7 5.7 0 1 0 5.7 5.7V8.9A6.9 6.9 0 0 0 21 10.3V7.2a3.9 3.9 0 0 1-3-3.2z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8M10 15.2V8.8l5.2 3.2z',
  whatsapp:
    'M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2m0 2a8 8 0 0 1 0 16 8 8 0 0 1-4.2-1.2l-.3-.2-2.5.7.7-2.4-.2-.3A8 8 0 0 1 12 4m-3.2 4c-.2 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4 1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1l-.5-.3-1.4-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.3-.4v-.5l-.7-1.6c-.2-.4-.4-.4-.5-.4z',
}

export const SOCIAL_KEYS: SocialKey[] = ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'whatsapp']
