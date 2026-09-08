import { useEffect, useState } from 'react'
import {
  collection, doc, onSnapshot, orderBy, query, where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Product, Section, SiteSettings } from '../types'

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      setSettings(snap.exists() ? (snap.data() as SiteSettings) : null)
      setLoading(false)
    })
    return unsub
  }, [])

  return { settings, loading }
}

export function useSections() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'sections'), orderBy('order', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Section)))
      setLoading(false)
    })
    return unsub
  }, [])

  return { sections, loading }
}

export function useProducts(sectionId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sectionId) {
      setProducts([])
      setLoading(false)
      return
    }
    const q = query(
      collection(db, 'products'),
      where('sectionId', '==', sectionId),
      orderBy('order', 'asc'),
    )
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)))
      setLoading(false)
    })
    return unsub
  }, [sectionId])

  return { products, loading }
}
