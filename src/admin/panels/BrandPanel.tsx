import type { MediaItem } from '../../types'
import { SITE_NAME } from '../../lib/config'
import MediaPicker from '../MediaPicker'
import { Card, Field, Input, PanelHeader, SaveBar, Toggle } from '../ui'
import { useSettingsDraft } from '../useSettingsDraft'

export default function BrandPanel() {
  const { draft, set, save, reset, dirty, saving } = useSettingsDraft()

  const logo: MediaItem[] = draft.logoUrl
    ? [{ id: 'logo', kind: 'image', url: draft.logoUrl, path: draft.logoPath }]
    : []

  const onLogoChange = (next: MediaItem[]) => {
    set('logoUrl', next[0]?.url ?? '')
    set('logoPath', next[0]?.path ?? '')
  }

  return (
    <>
      <PanelHeader
        title="Brand, contact & notice bar"
        description="The name, logo, the WhatsApp and payment strip, and the thin message bar at the very top."
      />

      <div className="space-y-5">
        <Card title="Shop identity">
          <Field label="Shop name" hint={`Left blank, the site shows "${SITE_NAME}".`}>
            <Input
              value={draft.siteName}
              onChange={(e) => set('siteName', e.target.value)}
              placeholder={SITE_NAME}
            />
          </Field>
          <Field label="Tagline" hint="A few words under the name, e.g. what you sell.">
            <Input value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </Field>
          <Field label="Logo" hint="A square picture works best.">
            <MediaPicker
              value={logo}
              onChange={onLogoChange}
              folder="site/logo"
              accept="image"
              max={1}
              hint="Square picture, up to 50MB"
            />
          </Field>
        </Card>

        <Card
          title="WhatsApp & payment strip"
          description="Sits right under the search box, so shoppers can order or pay without scrolling."
        >
          <Field label="WhatsApp number" hint="With the country code, e.g. +250 726 168 023.">
            <Input
              value={draft.whatsappNumber}
              onChange={(e) => set('whatsappNumber', e.target.value)}
              placeholder="+250 700 000 000"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payment label" hint="The line above the code.">
              <Input
                value={draft.momoName}
                onChange={(e) => set('momoName', e.target.value)}
                placeholder="e.g. MTN MOMO PAY"
              />
            </Field>
            <Field label="Payment code">
              <Input
                value={draft.momoCode}
                onChange={(e) => set('momoCode', e.target.value)}
                placeholder="e.g. 002541 SAFE"
              />
            </Field>
          </div>
          <Toggle
            checked={draft.showContactBar !== false}
            onChange={(v) => set('showContactBar', v)}
            label="Show the strip"
            hint="Turn off to hide it without clearing what you typed."
          />
        </Card>

        <Card title="Prices" description="Used everywhere a price is shown.">
          <Field label="Currency" hint="Put in front of every price, e.g. RWF 65,300.">
            <Input
              value={draft.currency}
              onChange={(e) => set('currency', e.target.value)}
              placeholder="RWF"
            />
          </Field>
        </Card>

        <Card title="Notice bar" description="Hidden while this is empty.">
          <Field label="Message">
            <Input
              value={draft.announcementText}
              onChange={(e) => set('announcementText', e.target.value)}
              placeholder="e.g. Open today until 8pm"
            />
          </Field>
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </>
  )
}
