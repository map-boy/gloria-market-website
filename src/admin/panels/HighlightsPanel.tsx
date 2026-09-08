import { useState, type FormEvent } from 'react'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { db } from '../../lib/firebase'
import { useHighlights } from '../../hooks/useFirestore'
import { HIGHLIGHT_ICONS, highlightIcon } from '../../lib/icons'
import { Button, Card, EmptyHint, Field, IconButton, Input, PanelHeader } from '../ui'
import { useToast } from '../Toast'

export default function HighlightsPanel() {
  const { highlights, loading } = useHighlights()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [iconKey, setIconKey] = useState(HIGHLIGHT_ICONS[0].key)
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  const add = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    try {
      await addDoc(collection(db, 'highlights'), {
        title: title.trim(),
        subtitle: subtitle.trim(),
        iconKey,
        order: highlights.length,
      })
      setTitle('')
      setSubtitle('')
      toast('Highlight added.')
    } catch {
      toast('Could not add that highlight.', 'error')
    } finally {
      setAdding(false)
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const current = highlights[index]
    const target = highlights[index + dir]
    if (!target) return
    await Promise.all([
      updateDoc(doc(db, 'highlights', current.id), { order: target.order }),
      updateDoc(doc(db, 'highlights', target.id), { order: current.order }),
    ])
  }

  const remove = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return
    await deleteDoc(doc(db, 'highlights', id))
    toast('Highlight removed.')
  }

  return (
    <>
      <PanelHeader
        title="Highlights"
        description="Short promises shown in a strip, like delivery or opening hours. Leave it empty to hide the strip."
      />

      <Card title="Add a highlight">
        <form onSubmit={add} className="space-y-4">
          <Field label="Pick a picture">
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_ICONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIconKey(key)}
                  title={label}
                  aria-label={label}
                  aria-pressed={iconKey === key}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    iconKey === key
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-100 bg-white text-ink-400 hover:border-sand-400 hover:text-ink-900'
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Free delivery" />
            </Field>
            <Field label="Small text">
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. In town, over R500" />
            </Field>
          </div>
          <Button type="submit" busy={adding} disabled={!title.trim()}>
            <Plus size={16} /> Add highlight
          </Button>
        </form>
      </Card>

      <div className="mt-5 space-y-2">
        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : highlights.length === 0 ? (
          <EmptyHint>No highlights yet — the strip stays hidden until you add one.</EmptyHint>
        ) : (
          highlights.map((h, i) => {
            const Icon = highlightIcon(h.iconKey)
            return (
              <div key={h.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3">
                <div className="flex flex-col">
                  <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp size={12} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === highlights.length - 1}>
                    <ArrowDown size={12} />
                  </IconButton>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-600">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-800">{h.title}</p>
                  {h.subtitle && <p className="truncate text-sm text-ink-400">{h.subtitle}</p>}
                </div>
                <IconButton label="Remove" tone="danger" onClick={() => remove(h.id, h.title)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
