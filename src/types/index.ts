export interface SiteSettings {
  siteName: string
  tagline: string
  logoUrl: string
  contactEmail: string
  contactPhone: string
  address: string
  announcementText: string
  heroBadgeText: string
  heroImageUrl: string
  primaryCtaText: string
  secondaryCtaText: string
}

export interface Section {
  id: string
  title: string
  order: number
  iconUrl: string
}

export interface Product {
  id: string
  sectionId: string
  name: string
  price: string
  description: string
  imageUrl: string
  videoUrl: string
  order: number
}