import { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { MediaItem, Product } from '../types'
import MediaPicker from './MediaPicker'
import { Button, Field, Input, TextArea, Toggle } from './ui'
import { useToast } from './Toast'

interface Props {
  sectionId: string
  /** Position for a new item; ignored when editing. */
  nextOrder: number
  existing?: Product
  onDone: () => void
}

export default function ProductEditor({ sectionId, nextOrder, existing, onDone }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [price, setPrice] = useState(existing?.price ?? '')
  const [oldPrice, setOldPrice] = useState(existing?.oldPrice ?? '')
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
      price: price.trim(),
      oldPrice: oldPrice.trim(),
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
        <Field label="Price">
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. R 250" />
        </Field>
        <Field label="Old price" hint="Shown crossed out.">
          <Input value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
        </Field>
        <Field label="Corner label">
          <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. New" />
        </Field>
      </div>

      <Field label="Description">
        <TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <Toggle checked={visible} onChange={setVisible} label="Show on the site" />

      <div className="flex gap-2">
        <Button onClick={save} busy={saving}>{existing ? 'Save item' : 'Add item'}</Button>
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  )
}
