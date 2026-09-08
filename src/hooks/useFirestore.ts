import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { emptySettings, type AdminUser, type Highlight, type Product, type Section, type SiteSettings } from '../types'

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onSnapshot(
      doc(db, 'settings', 'site'),
      (snap) => {
        setSettings(snap.exists() ? { ...emptySettings, ...(snap.data() as Partial<SiteSettings>) } : emptySettings)
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [])

  return { settings, loading }
}

function useOrderedCollection<T>(name: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, name), orderBy('order', 'asc'))
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T))
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [name])

  return { items, loading }
}

export function useSections() {
  const { items, loading } = useOrderedCollection<Section>('sections')
  return { sections: items, loading }
}

export function useHighlights() {
  const { items, loading } = useOrderedCollection<Highlight>('highlights')
  return { highlights: items, loading }
}

/** One listener for every product, grouped by section in memory. Keeps the
 *  admin on a single screen and avoids a composite index per section. */
export function useProducts() {
  const { items, loading } = useOrderedCollection<Product>('products')

  const bySection = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of items) {
      const list = map.get(p.sectionId)
      if (list) list.push(p)
      else map.set(p.sectionId, [p])
    }
    return map
  }, [items])

  return { products: items, bySection, loading }
}

export function useAdmins(enabled: boolean) {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled) return
    return onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminUser))
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [enabled])

  return { admins, loading }
}
