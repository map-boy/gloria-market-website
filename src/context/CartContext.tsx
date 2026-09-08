import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '../types'

const STORAGE_KEY = 'shop:cart'

interface CartContextValue {
  lines: CartLine[]
  /** Total number of items, for the badge on the cart button. */
  count: number
  add: (productId: string, quantity: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  quantityOf: (productId: string) => number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l): l is CartLine =>
        typeof l === 'object' && l !== null &&
        typeof (l as CartLine).productId === 'string' &&
        typeof (l as CartLine).quantity === 'number')
      .map((l) => ({ productId: l.productId, quantity: Math.max(1, Math.floor(l.quantity)) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* private mode — the basket just will not survive a reload */
    }
  }, [lines])

  const add = useCallback((productId: string, quantity: number) => {
    const qty = Math.max(1, Math.floor(quantity))
    setLines((current) => {
      const existing = current.find((l) => l.productId === productId)
      if (!existing) return [...current, { productId, quantity: qty }]
      return current.map((l) =>
        l.productId === productId ? { ...l, quantity: l.quantity + qty } : l)
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const qty = Math.floor(quantity)
    setLines((current) =>
      qty <= 0
        ? current.filter((l) => l.productId !== productId)
        : current.map((l) => (l.productId === productId ? { ...l, quantity: qty } : l)))
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const quantityOf = useCallback(
    (productId: string) => lines.find((l) => l.productId === productId)?.quantity ?? 0,
    [lines],
  )

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])

  const value = useMemo(
    () => ({ lines, count, add, setQuantity, remove, clear, quantityOf }),
    [lines, count, add, setQuantity, remove, clear, quantityOf],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
