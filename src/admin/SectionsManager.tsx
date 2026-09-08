import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Trash2, ArrowUp, ArrowDown, ChevronRight, ImagePlus } from 'lucide-react'
import { db, storage } from '../lib/firebase'
import { useSections } from '../hooks/useFirestore'

export default function SectionsManager() {
  const { sections, loading } = useSections()
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [uploadingIconFor, setUploadingIconFor] = useState<string | null>(null)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    await addDoc(collection(db, 'sections'), { title: title.trim(), order: sections.length, iconUrl: '' })
    setTitle('')
    setAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section and all its products?')) return
    await deleteDoc(doc(db, 'sections', id))
  }

  const handleIconUpload = async (sectionId: string, file: File) => {
    setUploadingIconFor(sectionId)
    const r = ref(storage, `sections/${sectionId}/icon-${Date.now()}-${file.name}`)
    await uploadBytes(r, file)
    const url = await getDownloadURL(r)
    await updateDoc(doc(db, 'sections', sectionId), { iconUrl: url })
    setUploadingIconFor(null)
  }

  const move = async (index: number, dir: -1 | 1) => {
    const target = sections[index + dir]
    const current = sections[index]
    if (!target) return
    await updateDoc(doc(db, 'sections', current.id), { order: target.order })
    await updateDoc(doc(db, 'sections', target.id), { order: current.order })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Sections</h1>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New section title, e.g. Shoes" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
        <button type="submit" disabled={adding} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : sections.length === 0 ? (
        <p className="text-slate-400">No sections yet. Add one above.</p>
      ) : (
        <ul className="space-y-2">
          {sections.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
                  <ArrowDown size={14} />
                </button>
              </div>

              <label className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200">
                {s.iconUrl ? (
                  <img src={s.iconUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={16} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleIconUpload(s.id, e.target.files[0])}
                />
              </label>
              {uploadingIconFor === s.id && <span className="text-xs text-slate-400">Uploading...</span>}

              <Link to={`/admin/sections/${s.id}`} className="flex flex-1 items-center justify-between font-medium text-slate-800 hover:text-indigo-600">
                {s.title}
                <ChevronRight size={16} />
              </Link>
              <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}