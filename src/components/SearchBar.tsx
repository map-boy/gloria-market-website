import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

/** Search lives in the address bar as ?q=, so a result list can be shared or
 *  reloaded and still show the same thing. */
export default function SearchBar() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') ?? ''
  const [draft, setDraft] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)

  // Follow the address bar — back, forward, or a shared link.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setDraft(query)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = draft.trim()
    navigate(clean ? `/?q=${encodeURIComponent(clean)}` : '/')
  }

  const clear = () => {
    setDraft('')
    navigate('/')
  }

  return (
    <form onSubmit={submit} className="flex w-full items-center">
      <div className="relative flex-1">
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search"
          aria-label="Search products"
          className="w-full rounded-l-lg border border-ink-100 bg-white py-2.5 pl-3.5 pr-9 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-sand-400"
        />
        {draft && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="rounded-r-lg bg-ink-900 px-4 py-2.5 text-white transition hover:bg-ink-800"
      >
        <Search size={18} />
      </button>
    </form>
  )
}
