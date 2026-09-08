/** Accounts that always have admin access, whatever is in the database, and
 *  the name the site falls back to before anything is filled in. */

/** The developer's account, so the site can always be maintained. */
export const DEVELOPER_EMAIL = 'techubwenge@gmail.com'

/** The business owner's account. */
export const OWNER_EMAIL = 'dprime2002@gmail.com'

/** Extra permanent admins from .env — one address, or several separated by
 *  commas. Anyone else is added from the Team screen instead. */
const envAdmins = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean)

export const PERMANENT_ADMINS: string[] = [
  ...new Set([DEVELOPER_EMAIL, OWNER_EMAIL, ...envAdmins]),
]

export function isPermanentAdmin(email: string | null | undefined): boolean {
  const clean = (email ?? '').trim().toLowerCase()
  return clean !== '' && PERMANENT_ADMINS.includes(clean)
}

/** Used only to label a row in the Team screen. */
export function permanentRole(email: string): string {
  if (email === DEVELOPER_EMAIL) return 'Developer'
  if (email === OWNER_EMAIL) return 'Owner'
  return 'Admin'
}

/** Shown until the admin sets a name of their own under Brand. Firestore
 *  always wins — this is only the starting point. */
export const SITE_NAME = (import.meta.env.VITE_SITE_NAME || 'D prime Rwanda LTD').trim()
