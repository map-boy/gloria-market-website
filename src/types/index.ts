/** Everything on the site is stored in Firestore. Nothing is hardcoded — a fresh
 *  install renders empty placeholders until the admin fills things in. */

export type MediaKind = 'image' | 'video'

export interface MediaItem {
  id: string
  kind: MediaKind
  url: string
  /** Storage path, kept so the file can be removed when the item is deleted. */
  path: string
}

export interface Socials {
  facebook: string
  instagram: string
  twitter: string
  tiktok: string
  youtube: string
  whatsapp: string
}

export interface SiteSettings {
  siteName: string
  tagline: string
  logoUrl: string
  logoPath: string

  announcementText: string

  heroBadgeText: string
  heroTitle: string
  heroSubtitle: string
  heroMedia: MediaItem | null
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string

  aboutTitle: string
  aboutText: string

  contactEmail: string
  contactPhone: string
  address: string
  openingHours: string
  socials: Socials

  /** The block beside the basket button: WhatsApp number and payment code. */
  whatsappNumber: string
  whatsappNote: string
  momoCode: string
  momoName: string
  showContactBar: boolean

  /** Prefixed to every price, e.g. RWF. */
  currency: string

  footerNote: string
  showCategoryStrip: boolean
}

export interface Section {
  id: string
  title: string
  subtitle: string
  iconUrl: string
  iconPath: string
  columns: 2 | 3 | 4
  visible: boolean
  order: number
}

export interface Product {
  id: string
  sectionId: string
  name: string
  /** Plain number so the cart can add things up; the currency comes from
   *  settings. 0 means no price is shown. */
  price: number
  oldPrice: number
  /** How many are left. 0 shows as out of stock and blocks adding to a cart. */
  stock: number
  badge: string
  description: string
  media: MediaItem[]
  visible: boolean
  order: number
}

/** One line in the shopper's basket. Kept in the browser, never in Firestore. */
export interface CartLine {
  productId: string
  quantity: number
}

/** The small promo strip under the products ("free delivery", "gift wrap", ...). */
export interface Highlight {
  id: string
  iconKey: string
  title: string
  subtitle: string
  order: number
}

/** A document id in `admins` is the allowed Google account's email. */
export interface AdminUser {
  id: string
  email: string
  name: string
  addedBy: string
}

export const emptySettings: SiteSettings = {
  siteName: '',
  tagline: '',
  logoUrl: '',
  logoPath: '',
  announcementText: '',
  heroBadgeText: '',
  heroTitle: '',
  heroSubtitle: '',
  heroMedia: null,
  primaryCtaText: '',
  primaryCtaLink: '',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  aboutTitle: '',
  aboutText: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  openingHours: '',
  socials: { facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', whatsapp: '' },
  whatsappNumber: '',
  whatsappNote: '',
  momoCode: '',
  momoName: '',
  showContactBar: true,
  currency: 'RWF',
  footerNote: '',
  showCategoryStrip: true,
}
