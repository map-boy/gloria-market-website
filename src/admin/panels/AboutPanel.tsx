import { SOCIAL_KEYS } from '../../lib/icons'
import SocialIcon from '../../components/SocialIcon'
import { Card, Field, Input, PanelHeader, SaveBar, TextArea, Toggle } from '../ui'
import { useSettingsDraft } from '../useSettingsDraft'

const SOCIAL_PLACEHOLDERS: Record<string, string> = {
  facebook: 'facebook.com/yourshop',
  instagram: 'instagram.com/yourshop',
  twitter: 'x.com/yourshop',
  tiktok: 'tiktok.com/@yourshop',
  youtube: 'youtube.com/@yourshop',
  whatsapp: 'Phone number, e.g. 27821234567',
}

export default function AboutPanel() {
  const { draft, set, setSocial, save, reset, dirty, saving } = useSettingsDraft()

  return (
    <>
      <PanelHeader
        title="About & contact"
        description="Your story, how people reach you, and what shows in the footer."
      />

      <div className="space-y-5">
        <Card title="About" description="Hidden while both fields are empty.">
          <Field label="Heading">
            <Input value={draft.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} />
          </Field>
          <Field label="Text">
            <TextArea rows={5} value={draft.aboutText} onChange={(e) => set('aboutText', e.target.value)} />
          </Field>
        </Card>

        <Card title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <Input value={draft.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={draft.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
            </Field>
          </div>
          <Field label="Address">
            <TextArea rows={2} value={draft.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="Opening hours">
            <Input
              value={draft.openingHours}
              onChange={(e) => set('openingHours', e.target.value)}
              placeholder="e.g. Mon–Sat, 9am – 6pm"
            />
          </Field>
        </Card>

        <Card title="Social links" description="Only the ones you fill in appear in the footer.">
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIAL_KEYS.map((key) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-400">
                    <SocialIcon name={key} size={16} />
                  </span>
                  <Input
                    value={draft.socials?.[key] ?? ''}
                    onChange={(e) => setSocial(key, e.target.value)}
                    placeholder={SOCIAL_PLACEHOLDERS[key]}
                  />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Footer & layout">
          <Field label="Footer note">
            <TextArea
              rows={3}
              value={draft.footerNote}
              onChange={(e) => set('footerNote', e.target.value)}
              placeholder="A short line about the shop"
            />
          </Field>
          <Toggle
            checked={draft.showCategoryStrip !== false}
            onChange={(v) => set('showCategoryStrip', v)}
            label="Show the browse row"
            hint="The round shortcuts to each section, under the banner."
          />
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </>
  )
}
