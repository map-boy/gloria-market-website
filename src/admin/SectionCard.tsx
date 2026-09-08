import { useState } from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import {
  ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, ImagePlus, Plus, SquarePen, Trash2,
} from 'lucide-react'
import { db } from '../lib/firebase'
import { formatPrice } from '../lib/format'
import { deleteMedia, uploadMedia } from '../lib/storage'
import type { Product, Section } from '../types'
import MediaFrame from '../components/MediaFrame'
import ProductEditor from './ProductEditor'
import { Button, EmptyHint, Field, IconButton, Input } from './ui'
import { useToast } from './Toast'

interface Props {
  section: Section
  products: Product[]
  /** Passed down so prices read the same here as on the site. */
  currency: string
  index: number
  total: number
  onMove: (index: number, dir: -1 | 1) => void
  onDelete: (section: Section, products: Product[]) => void
}

export default function SectionCard({ section, products, currency, index, total, onMove, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [editingSection, setEditingSection] = useState(false)
  const [title, setTitle] = useState(section.title)
  const [subtitle, setSubtitle] = useState(section.subtitle ?? '')
  const [savingSection, setSavingSection] = useState(false)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [synced, setSynced] = useState(section)
  const toast = useToast()

  // Follow edits made elsewhere, unless this card is mid-edit.
  if (!editingSection && section !== synced) {
    setSynced(section)
    setTitle(section.title)
    setSubtitle(section.subtitle ?? '')
  }

  const saveSection = async () => {
    if (!title.trim()) {
      toast('A section needs a title.', 'error')
      return
    }
    setSavingSection(true)
    try {
      await updateDoc(doc(db, 'sections', section.id), { title: title.trim(), subtitle: subtitle.trim() })
      setEditingSection(false)
      toast('Section updated.')
    } catch {
      toast('Could not update the section.', 'error')
    } finally {
      setSavingSection(false)
    }
  }

  const patch = async (data: Partial<Section>) => {
    try {
      await updateDoc(doc(db, 'sections', section.id), data)
    } catch {
      toast('Could not update the section.', 'error')
    }
  }

  const uploadIcon = async (file: File) => {
    setUploadingIcon(true)
    try {
      const item = await uploadMedia(file, `sections/${section.id}`)
      const old = section.iconPath
      await patch({ iconUrl: item.url, iconPath: item.path })
      void deleteMedia(old)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed.', 'error')
    } finally {
      setUploadingIcon(false)
    }
  }

  const deleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This also removes its pictures and videos.`)) return
    try {
      await deleteDoc(doc(db, 'products', product.id))
      await Promise.all((product.media ?? []).map((m) => deleteMedia(m.path)))
      toast('Item deleted.')
    } catch {
      toast('Could not delete that item.', 'error')
    }
  }

  const moveProduct = async (i: number, dir: -1 | 1) => {
    const current = products[i]
    const target = products[i + dir]
    if (!target) return
    await Promise.all([
      updateDoc(doc(db, 'products', current.id), { order: target.order }),
      updateDoc(doc(db, 'products', target.id), { order: current.order }),
    ])
  }

  const hidden = section.visible === false

  return (
    <div className={`rounded-2xl border bg-white shadow-sm shadow-ink-900/[0.03] ${hidden ? 'border-dashed border-ink-200' : 'border-ink-100'}`}>
      <div className="flex items-center gap-3 p-4">
        <div className="flex flex-col">
          <IconButton label="Move up" onClick={() => onMove(index, -1)} disabled={index === 0}>
            <ArrowUp size={14} />
          </IconButton>
          <IconButton label="Move down" onClick={() => onMove(index, 1)} disabled={index === total - 1}>
            <ArrowDown size={14} />
          </IconButton>
        </div>

        <label className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-sand-100 text-sand-600 transition hover:opacity-80" title="Section picture">
          {section.iconUrl ? (
            <img src={section.iconUrl} alt="" className="h-full w-full object-cover" />
          ) : uploadingIcon ? (
            <span className="text-[10px]">…</span>
          ) : (
            <ImagePlus size={16} />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadIcon(e.target.files[0])}
          />
        </label>

        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-ink-900">{section.title}</p>
          <p className="truncate text-sm text-ink-400">
            {products.length === 0 ? 'No items yet' : `${products.length} item${products.length === 1 ? '' : 's'}`}
            {hidden && ' · hidden'}
          </p>
        </button>

        <IconButton label="Rename" onClick={() => setEditingSection((v) => !v)}>
          <SquarePen size={16} />
        </IconButton>
        <IconButton
          label={hidden ? 'Show on site' : 'Hide from site'}
          onClick={() => patch({ visible: hidden })}
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
        <IconButton label="Delete section" tone="danger" onClick={() => onDelete(section, products)}>
          <Trash2 size={16} />
        </IconButton>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Collapse' : 'Expand'}
          className={`rounded-lg p-2 text-ink-400 transition hover:bg-ink-50 ${open ? 'rotate-180' : ''}`}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {editingSection && (
        <div className="space-y-4 border-t border-ink-100 bg-ink-50/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Subtitle" hint="Optional line under the title.">
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </Field>
          </div>
          <Field label="Items per row on a wide screen">
            <div className="flex gap-2">
              {([2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => patch({ columns: n })}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    (section.columns ?? 4) === n
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-100 bg-white text-ink-600 hover:border-ink-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex gap-2">
            <Button onClick={saveSection} busy={savingSection}>Save section</Button>
            <Button variant="ghost" onClick={() => setEditingSection(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {open && (
        <div className="space-y-3 border-t border-ink-100 p-4">
          {products.length === 0 && !addingProduct && (
            <EmptyHint>Nothing in this section yet. Add your first picture or video below.</EmptyHint>
          )}

          {products.map((p, i) =>
            editingProduct === p.id ? (
              <ProductEditor
                key={p.id}
                sectionId={section.id}
                nextOrder={p.order}
                existing={p}
                currency={currency}
                onDone={() => setEditingProduct(null)}
              />
            ) : (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-2.5">
                <div className="flex flex-col">
                  <IconButton label="Move up" onClick={() => moveProduct(i, -1)} disabled={i === 0}>
                    <ArrowUp size={12} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => moveProduct(i, 1)} disabled={i === products.length - 1}>
                    <ArrowDown size={12} />
                  </IconButton>
                </div>
                <MediaFrame
                  media={p.media?.[0] ?? null}
                  alt={p.name}
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-800">{p.name}</p>
                  <p className="truncate text-xs text-ink-400">
                    {[
                      formatPrice(p.price, currency),
                      p.stock > 0 ? `${p.stock} in stock` : 'out of stock',
                      `${p.media?.length ?? 0} file${(p.media?.length ?? 0) === 1 ? '' : 's'}`,
                      p.visible === false ? 'hidden' : null,
                    ].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <IconButton label="Edit item" onClick={() => setEditingProduct(p.id)}>
                  <SquarePen size={16} />
                </IconButton>
                <IconButton label="Delete item" tone="danger" onClick={() => deleteProduct(p)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ),
          )}

          {addingProduct ? (
            <ProductEditor
              sectionId={section.id}
              nextOrder={products.length}
              currency={currency}
              onDone={() => setAddingProduct(false)}
            />
          ) : (
            <button
              onClick={() => setAddingProduct(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 py-3 text-sm font-medium text-ink-400 transition hover:border-sand-400 hover:text-ink-900"
            >
              <Plus size={16} /> Add item to {section.title}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
