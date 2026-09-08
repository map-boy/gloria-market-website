import { useState, type FormEvent } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import type { Product } from '../types'

interface Props {
  sectionId: string
  order: number
  existing?: Product
  onDone: () => void
}

export default function ProductForm({ sectionId, order, existing, onDone }: Props) {
  const [name, setName] = useState(existing?.name || '')
  const [price, setPrice] = useState(existing?.price || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl || '')
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const uploadFile = async (file: File, kind: 'image' | 'video') => {
    setUploading(true)
    const r = ref(storage, `products/${sectionId}/${kind}-${Date.now()}-${file.name}`)
    await uploadBytes(r, file)
    const url = await getDownloadURL(r)
    if (kind === 'image') setImageUrl(url)
    else setVideoUrl(url)
    setUploading(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = { sectionId, name, price, description, imageUrl, videoUrl, order }
    if (existing) {
      await updateDoc(doc(db, 'products', existing.id), data)
    } else {
      await addDoc(collection(db, 'products'), data)
    }
    setSaving(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price, e.g. $29.99" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Image</label>
          {imageUrl && <img src={imageUrl} alt="" className="mb-1 h-16 w-16 rounded object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'image')} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Video (optional)</label>
          {videoUrl && <video src={videoUrl} className="mb-1 h-16 w-16 rounded object-cover" muted />}
          <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'video')} />
        </div>
      </div>
      {uploading && <p className="text-xs text-slate-400">Uploading...</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving || uploading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
          {saving ? 'Saving...' : existing ? 'Update' : 'Add Product'}
        </button>
        <button type="button" onClick={onDone} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
