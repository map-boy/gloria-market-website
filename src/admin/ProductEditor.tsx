import { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { parsePrice } from '../lib/format'
import type { MediaItem, Product } from '../types'
import MediaPicker from './MediaPicker'
import { Button, Field, Input, TextArea, Toggle } from './ui'
import { useToast } from './Toast'

interface Props {
  sectionId: string
  /** Position for a new item; ignored when editing. */
  nextOrder: number
  existing?: Product
  /** Shown beside the price boxes so the admin knows what they are typing. */
  currency: string
  onDone: () => void
}

/** Numbers are held as text while typing so the boxes can be cleared. */
function numberDraft(value: number | undefined): string {
  return value && value > 0 ? String(value) : ''
}

export default function ProductEditor({ sectionId, nextOrder, existing, currency, onDone }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [price, setPrice] = useState(numberDraft(existing?.price))
  const [oldPrice, setOldPrice] = useState(numberDraft(existing?.oldPrice))
  const [stock, setStock] = useState(numberDraft(existing?.stock))
  const [badge, setBadge] = useState(existing?.badge ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [media, setMedia] = useState<MediaItem[]>(existing?.media ?? [])
  const [visible, setVisible] = useState(existing?.visible !== false)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const save = async () => {
    if (!name.trim()) {
      toast('Give this item a name first.', 'error')
      return
    }
    setSaving(true)
    const data = {
      sectionId,
      name: name.trim(),
      price: parsePrice(price),
      oldPrice: parsePrice(oldPrice),
      stock: Math.max(0, Math.floor(parsePrice(stock))),
      badge: badge.trim(),
      description: description.trim(),
      media,
      visible,
    }
    try {
      if (existing) {
        await updateDoc(doc(db, 'products', existing.id), data)
      } else {
        await addDoc(collection(db, 'products'), { ...data, order: nextOrder })
      }
      toast(existing ? 'Item updated.' : 'Item added.')
      onDone()
    } catch {
      toast('Could not save this item.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-sand-400/40 bg-sand-50/60 p-4">
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="What is it?" autoFocus />
      </Field>

      <Field label="Pictures and videos" hint="The first one is the cover. Drop several at once.">
        <MediaPicker value={media} onChange={setMedia} folder={`products/${sectionId}`} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={`Price in ${currency || 'numbers'}`} hint="Numbers only, e.g. 65300.">
          <Input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Old price" hint="Shown crossed out.">
          <Input
            inputMode="numeric"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="How many in stock" hint="0 shows as out of stock.">
          <Input
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>

      <Field label="Corner label" hint="A short word on the picture, e.g. New.">
        <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. New" />
      </Field>

      <Field label="Description">
        <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <Toggle checked={visible} onChange={setVisible} label="Show on the site" />

      <div className="flex gap-2">
        <Button onClick={save} busy={saving}>{existing ? 'Save item' : 'Add item'}</Button>
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  )
}
