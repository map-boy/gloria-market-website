import type { MediaItem } from '../../types'
import { SITE_NAME } from '../../lib/config'
import MediaPicker from '../MediaPicker'
import { Card, Field, Input, PanelHeader, SaveBar } from '../ui'
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
        title="Brand & notice bar"
        description="The name, logo and the thin message bar at the very top of your page."
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
