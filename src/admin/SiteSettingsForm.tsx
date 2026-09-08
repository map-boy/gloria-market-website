import { useEffect, useState, type FormEvent } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useSiteSettings } from '../hooks/useFirestore'
import type { SiteSettings } from '../types'

const empty: SiteSettings = {
  siteName: '',
  tagline: '',
  logoUrl: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  announcementText: '',
  heroBadgeText: '',
  heroImageUrl: '',
  primaryCtaText: '',
  secondaryCtaText: '',
}

export default function SiteSettingsForm() {
  const { settings, loading } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings>(empty)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)

  useEffect(() => {
    if (settings) setForm({ ...empty, ...settings })
  }, [settings])

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true)
    const r = ref(storage, `site/logo-${Date.now()}-${file.name}`)
    await uploadBytes(r, file)
    const url = await getDownloadURL(r)
    setForm((f) => ({ ...f, logoUrl: url }))
    setUploadingLogo(false)
  }

  const handleHeroImageUpload = async (file: File) => {
    setUploadingHero(true)
    const r = ref(storage, `site/hero-${Date.now()}-${file.name}`)
    await uploadBytes(r, file)
    const url = await getDownloadURL(r)
    setForm((f) => ({ ...f, heroImageUrl: url }))
    setUploadingHero(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await setDoc(doc(db, 'settings', 'site'), form, { merge: true })
    setSaving(false)
  }

  if (loading) return <p className="text-slate-400">Loading...</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Site Name</label>
        <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
        <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Logo</label>
        {form.logoUrl && <img src={form.logoUrl} alt="logo" className="mb-2 h-16 w-16 rounded-full object-cover" />}
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
        {uploadingLogo && <p className="text-xs text-slate-400">Uploading...</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contact Email</label>
        <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contact Phone</label>
        <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <hr className="border-slate-200" />
      <p className="text-sm font-semibold text-slate-500">Announcement Bar</p>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Announcement Text</label>
        <input value={form.announcementText} onChange={(e) => setForm({ ...form, announcementText: e.target.value })} placeholder="e.g. Free shipping this week!" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <hr className="border-slate-200" />
      <p className="text-sm font-semibold text-slate-500">Hero Section</p>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Hero Badge Text</label>
        <input value={form.heroBadgeText} onChange={(e) => setForm({ ...form, heroBadgeText: e.target.value })} placeholder="e.g. Welcome to the shop" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Hero Image</label>
        {form.heroImageUrl && <img src={form.heroImageUrl} alt="hero" className="mb-2 h-24 w-24 rounded-xl object-cover" />}
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0])} />
        {uploadingHero && <p className="text-xs text-slate-400">Uploading...</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Primary Button Text</label>
        <input value={form.primaryCtaText} onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })} placeholder="e.g. Shop Now" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Secondary Button Text</label>
        <input value={form.secondaryCtaText} onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })} placeholder="e.g. Browse Categories" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}