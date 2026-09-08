import type { MediaItem } from '../../types'
import MediaPicker from '../MediaPicker'
import { Card, Field, Input, PanelHeader, SaveBar, TextArea } from '../ui'
import { useSettingsDraft } from '../useSettingsDraft'

export default function HeroPanel() {
  const { draft, set, save, reset, dirty, saving } = useSettingsDraft()

  return (
    <>
      <PanelHeader
        title="Top banner"
        description="The first thing visitors see. Every field is optional — empty ones simply disappear."
      />

      <div className="space-y-5">
        <Card title="Words">
          <Field label="Small label above the title">
            <Input
              value={draft.heroBadgeText}
              onChange={(e) => set('heroBadgeText', e.target.value)}
              placeholder="e.g. Welcome"
            />
          </Field>
          <Field label="Title">
            <Input value={draft.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
          </Field>
          <Field label="Short text under the title">
            <TextArea rows={3} value={draft.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} />
          </Field>
        </Card>

        <Card title="Picture or video" description="One file. A video plays quietly on the page.">
          <MediaPicker
            value={draft.heroMedia ? [draft.heroMedia] : []}
            onChange={(next: MediaItem[]) => set('heroMedia', next[0] ?? null)}
            folder="site/hero"
            max={1}
          />
        </Card>

        <Card title="Buttons" description="A button is hidden while its text is empty.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Main button text">
              <Input
                value={draft.primaryCtaText}
                onChange={(e) => set('primaryCtaText', e.target.value)}
                placeholder="e.g. See what we have"
              />
            </Field>
            <Field label="Main button link" hint="Leave blank to jump to your sections.">
              <Input
                value={draft.primaryCtaLink}
                onChange={(e) => set('primaryCtaLink', e.target.value)}
                placeholder="#shop"
              />
            </Field>
            <Field label="Second button text">
              <Input value={draft.secondaryCtaText} onChange={(e) => set('secondaryCtaText', e.target.value)} />
            </Field>
            <Field label="Second button link">
              <Input
                value={draft.secondaryCtaLink}
                onChange={(e) => set('secondaryCtaLink', e.target.value)}
                placeholder="#contact"
              />
            </Field>
          </div>
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </>
  )
}
