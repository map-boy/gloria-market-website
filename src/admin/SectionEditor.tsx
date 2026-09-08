import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react'
import { db } from '../lib/firebase'
import { useSections, useProducts } from '../hooks/useFirestore'
import ProductForm from './ProductForm'
import type { Product } from '../types'

export default function SectionEditor() {
  const { id } = useParams<{ id: string }>()
  const { sections } = useSections()
  const { products, loading } = useProducts(id)
  const [editing, setEditing] = useState<Product | null>(null)
  const [adding, setAdding] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)

  const section = sections.find((s) => s.id === id)

  const startEditTitle = () => {
    setTitleDraft(section?.title || '')
    setEditingTitle(true)
  }

  const saveTitle = async () => {
    if (id && titleDraft.trim()) {
      await updateDoc(doc(db, 'sections', id), { title: titleDraft.trim() })
    }
    setEditingTitle(false)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return
    await deleteDoc(doc(db, 'products', productId))
  }

  if (!section) return <p className="text-slate-400">Section not found.</p>

  return (
    <div className="max-w-3xl">
      <Link to="/admin/sections" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Back to sections
      </Link>

      <div className="mb-6 flex items-center gap-2">
        {editingTitle ? (
          <>
            <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-1 text-2xl font-bold" />
            <button onClick={saveTitle} className="text-sm font-medium text-indigo-600">Save</button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900">{section.title}</h1>
            <button onClick={startEditTitle} className="text-slate-400 hover:text-slate-700">
              <Pencil size={16} />
            </button>
          </>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="mb-4 space-y-2">
          {products.map((p) =>
            editing?.id === p.id ? (
              <ProductForm key={p.id} sectionId={section.id} order={p.order} existing={p} onDone={() => setEditing(null)} />
            ) : (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.price}</p>
                </div>
                <button onClick={() => setEditing(p)} className="text-slate-400 hover:text-slate-700">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDeleteProduct(p.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          )}
        </div>
      )}

      {adding ? (
        <ProductForm sectionId={section.id} order={products.length} onDone={() => setAdding(false)} />
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
          <Plus size={16} /> Add product
        </button>
      )}
    </div>
  )
}
