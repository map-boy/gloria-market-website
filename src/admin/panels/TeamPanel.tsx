import { useState, type FormEvent } from 'react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { PERMANENT_ADMINS, isPermanentAdmin, permanentRole } from '../../lib/config'
import { useAdmins } from '../../hooks/useFirestore'
import { Button, Card, EmptyHint, Field, IconButton, Input, PanelHeader } from '../ui'
import { useToast } from '../Toast'

export default function TeamPanel() {
  const { user } = useAuth()
  const { admins, loading } = useAdmins(true)
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  /** Only built-in admins hand out access, so nobody added here can quietly
   *  widen the circle. */
  const canManage = isPermanentAdmin(user?.email)

  const add = async (e: FormEvent) => {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast('That does not look like an email address.', 'error')
      return
    }
    if (isPermanentAdmin(clean)) {
      toast('That account already has permanent access.', 'error')
      return
    }
    if (admins.some((a) => a.id === clean)) {
      toast('That person is already on the list.', 'error')
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
      toast('Added. They can sign in with Google now.')
    } catch {
      toast('Could not add that person. Check the security rules are deployed.', 'error')
    } finally {
      setAdding(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm(`Remove ${id}? They lose access immediately.`)) return
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
        title="Who can edit this site"
        description="Everyone listed here signs in with Google at /admin. Nobody else can change anything."
      />

      {!canManage && (
        <p className="mb-5 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm text-ink-600">
          You can edit the site, but only the owner or developer can give access to someone new.
        </p>
      )}

      <Card
        title="Give someone access"
        description="Type their Google email and they can sign in straight away."
      >
        <form onSubmit={add} className="space-y-4">
          <Field label="Their Google email" hint="Must be the address on their Google account.">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              disabled={!canManage}
            />
          </Field>
          <Button type="submit" busy={adding} disabled={!canManage || !email.trim()}>
            <Plus size={16} /> Add person
          </Button>
        </form>
      </Card>

      <h2 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
        Always has access
      </h2>
      <div className="space-y-2">
        {PERMANENT_ADMINS.map((e) => (
          <div key={e} className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-400 text-ink-950">
              <ShieldCheck size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink-900">{e}</p>
              <p className="text-xs text-ink-400">
                {permanentRole(e)} · built in, cannot be removed here
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
        Added by you
      </h2>
      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : admins.length === 0 ? (
          <EmptyHint>Nobody added yet. Use the box above to let someone else post pictures.</EmptyHint>
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
              <IconButton label="Remove access" tone="danger" disabled={!canManage} onClick={() => remove(a.id)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </>
  )
}
