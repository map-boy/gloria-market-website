import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import { isPermanentAdmin } from '../lib/config'

interface AuthContextValue {
  user: User | null
  /** null while we are still checking the allow list. */
  isAdmin: boolean | null
  loading: boolean
  error: string
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setIsAdmin(null)
        setLoading(false)
        return
      }
      const email = (u.email || '').toLowerCase()
      if (isPermanentAdmin(email)) {
        setIsAdmin(true)
      } else if (!email) {
        setIsAdmin(false)
      } else {
        try {
          const snap = await getDoc(doc(db, 'admins', email))
          setIsAdmin(snap.exists())
        } catch {
          setIsAdmin(false)
        }
      }
      setLoading(false)
    })
  }, [])

  const loginWithGoogle = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      const code = (e as { code?: string }).code || ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      setError(
        code === 'auth/unauthorized-domain'
          ? 'This domain is not allowed in Firebase Auth settings.'
          : 'Could not sign in with Google. Please try again.',
      )
    }
  }

  const logout = async () => {
    await signOut(auth)
    setIsAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
