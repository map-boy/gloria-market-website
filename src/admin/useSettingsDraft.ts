import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useSiteSettings } from '../hooks/useFirestore'
import { emptySettings, type SiteSettings } from '../types'
import { useToast } from './Toast'

/** Local copy of the settings document with dirty tracking, so live updates
 *  never wipe what the admin is typing. */
export function useSettingsDraft() {
  const { settings, loading } = useSiteSettings()
  const [draft, setDraft] = useState<SiteSettings>(emptySettings)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [synced, setSynced] = useState<SiteSettings | null>(null)
  const toast = useToast()

  // Pull in a fresh snapshot during render, but never on top of unsaved edits.
  if (!dirty && settings !== synced) {
    setSynced(settings)
    setDraft(settings)
  }

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    setDirty(true)
  }

  function setSocial(key: keyof SiteSettings['socials'], value: string) {
    setDraft((d) => ({ ...d, socials: { ...d.socials, [key]: value } }))
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'site'), draft, { merge: true })
      setDirty(false)
      toast('Saved. Your site is updated.')
    } catch {
      toast('Could not save. Check your connection.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setDraft(settings)
    setDirty(false)
  }

  return { draft, set, setSocial, save, reset, dirty, saving, loading }
}
