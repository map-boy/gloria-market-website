import { useState, type FormEvent } from 'react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { Crown, Plus, Trash2 } from 'lucide-react'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { OWNER_EMAIL } from '../../lib/config'
import { useAdmins } from '../../hooks/useFirestore'
import { Button, Card, EmptyHint, Field, IconButton, Input, PanelHeader } from '../ui'
import { useToast } from '../Toast'

export default function TeamPanel() {
  const { user } = useAuth()
  const { admins, loading } = useAdmins(true)
  const isOwner = (user?.email ?? '').toLowerCase() === OWNER_EMAIL
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  const add = async (e: FormEvent) => {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast('That does not look like an email address.', 'error')
      return
    }
    if (clean === OWNER_EMAIL) {
      toast('That account is already the owner.', 'error')
      return
    }
    setAdding(true)
    try {
      await setDoc(doc(db, 'admins', clean), {
        email: clean,
        name: '',
        addedBy: user?.email ?? '',
      })
      setEmail('')
      toast('Added. They can now sign in with Google.')
    } catch {
      toast('Could not add that person.', 'error')
    } finally {
      setAdding(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm(`Remove ${id}? They will lose access immediately.`)) return
    try {
      await deleteDoc(doc(db, 'admins', id))
      toast('Access removed.')
    } catch {
      toast('Could not remove that person.', 'error')
    }
  }

  return (
    <>
      <PanelHeader
        title="Team"
        description="Anyone listed here can sign in with Google and edit the site. Nobody else can."
      />

      {!isOwner && (
        <p className="mb-5 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm text-ink-600">
          Only the shop owner can add or remove people. You can see the list below.
        </p>
      )}

      <Card title="Give someone access">
        <form onSubmit={add} className="space-y-4">
          <Field label="Their Google email" hint="It must be the address on their Google account.">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              disabled={!isOwner}
            />
          </Field>
          <Button type="submit" busy={adding} disabled={!isOwner || !email.trim()}>
            <Plus size={16} /> Add person
          </Button>
        </form>
      </Card>

      <div className="mt-5 space-y-2">
        {OWNER_EMAIL && (
          <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-400 text-ink-950">
              <Crown size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink-900">{OWNER_EMAIL}</p>
              <p className="text-xs text-ink-400">Owner · always has access</p>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : admins.length === 0 ? (
          <EmptyHint>No extra people yet. Only the owner can edit the site.</EmptyHint>
        ) : (
          admins.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-sm font-bold text-ink-600">
                {a.id.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">{a.id}</p>
                {a.addedBy && <p className="truncate text-xs text-ink-400">Added by {a.addedBy}</p>}
              </div>
              <IconButton label="Remove access" tone="danger" disabled={!isOwner} onClick={() => remove(a.id)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </>
  )
}
