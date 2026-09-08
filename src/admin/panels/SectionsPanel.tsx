import { useState, type FormEvent } from 'react'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Plus } from 'lucide-react'
import { db } from '../../lib/firebase'
import { deleteMedia } from '../../lib/storage'
import { useProducts, useSections } from '../../hooks/useFirestore'
import type { Product, Section } from '../../types'
import SectionCard from '../SectionCard'
import { Button, Card, EmptyHint, Input, PanelHeader } from '../ui'
import { useToast } from '../Toast'

export default function SectionsPanel() {
  const { sections, loading } = useSections()
  const { bySection } = useProducts()
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  const addSection = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    try {
      await addDoc(collection(db, 'sections'), {
        title: title.trim(),
        subtitle: '',
        iconUrl: '',
        iconPath: '',
        columns: 4,
        visible: true,
        order: sections.length,
      })
      setTitle('')
      toast('Section created. Open it to add pictures.')
    } catch {
      toast('Could not create the section.', 'error')
    } finally {
      setAdding(false)
    }
  }

  const moveSection = async (index: number, dir: -1 | 1) => {
    const current = sections[index]
    const target = sections[index + dir]
    if (!target) return
    await Promise.all([
      updateDoc(doc(db, 'sections', current.id), { order: target.order }),
      updateDoc(doc(db, 'sections', target.id), { order: current.order }),
    ])
  }

  const deleteSection = async (section: Section, products: Product[]) => {
    const count = products.length
    const warning = count
      ? `Delete "${section.title}" and its ${count} item${count === 1 ? '' : 's'}? This cannot be undone.`
      : `Delete "${section.title}"?`
    if (!confirm(warning)) return

    try {
      await Promise.all(products.map((p) => deleteDoc(doc(db, 'products', p.id))))
      await deleteDoc(doc(db, 'sections', section.id))
      void Promise.all([
        ...products.flatMap((p) => (p.media ?? []).map((m) => deleteMedia(m.path))),
        deleteMedia(section.iconPath),
      ])
      toast('Section deleted.')
    } catch {
      toast('Could not delete the section.', 'error')
    }
  }

  return (
    <>
      <PanelHeader
        title="Sections"
        description="A section is one row of your page — call it whatever you like, then fill it with pictures and videos."
      />

      <Card title="New section" description="Name it after what goes inside, e.g. Shoes, Bags, In the shop.">
        <form onSubmit={addSection} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Section name"
            className="flex-1"
          />
          <Button type="submit" busy={adding} disabled={!title.trim()}>
            <Plus size={16} /> Create
          </Button>
        </form>
      </Card>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : sections.length === 0 ? (
          <EmptyHint>No sections yet. Create your first one above — nothing is set up for you.</EmptyHint>
        ) : (
          sections.map((s, i) => (
            <SectionCard
              key={s.id}
              section={s}
              products={bySection.get(s.id) ?? []}
              index={i}
              total={sections.length}
              onMove={moveSection}
              onDelete={deleteSection}
            />
          ))
        )}
      </div>
    </>
  )
}
