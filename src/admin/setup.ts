import type { Product, Section, SiteSettings } from '../types'
import type { PanelId } from './nav'

export interface SetupStep {
  label: string
  done: boolean
  panel: PanelId
}

/** Drives both the sidebar ring and the overview checklist. */
export function setupSteps(settings: SiteSettings, sections: Section[], products: Product[]): SetupStep[] {
  return [
    { label: 'Name your shop', done: Boolean(settings.siteName), panel: 'brand' },
    { label: 'Add a logo', done: Boolean(settings.logoUrl), panel: 'brand' },
    { label: 'Write a banner title', done: Boolean(settings.heroTitle), panel: 'hero' },
    { label: 'Add a banner picture', done: Boolean(settings.heroMedia), panel: 'hero' },
    { label: 'Create a section', done: sections.length > 0, panel: 'sections' },
    { label: 'Post a picture or video', done: products.some((p) => (p.media?.length ?? 0) > 0), panel: 'sections' },
    { label: 'Add a way to reach you', done: Boolean(settings.contactPhone || settings.contactEmail), panel: 'about' },
    { label: 'Tell people about the shop', done: Boolean(settings.aboutText), panel: 'about' },
  ]
}

export function setupProgress(steps: SetupStep[]): number {
  if (steps.length === 0) return 0
  return Math.round((steps.filter((s) => s.done).length / steps.length) * 100)
}
