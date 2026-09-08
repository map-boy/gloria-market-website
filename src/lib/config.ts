/** Accounts that always have admin access, whatever is in the database.
 *  Everyone else is added from the Team screen and can be removed again. */

/** The developer's account. Built in so the site can always be maintained,
 *  even before any environment variables are set. */
export const DEVELOPER_EMAIL = 'techubwenge@gmail.com'

/** The shop owner's Google account, from .env. One address, or several
 *  separated by commas. */
const ownerEmails = (import.meta.env.VITE_OWNER_EMAIL || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean)

/** Built-in admins: the developer plus whoever is named in .env. */
export const PERMANENT_ADMINS: string[] = [
  ...new Set([DEVELOPER_EMAIL, ...ownerEmails]),
]

export function isPermanentAdmin(email: string | null | undefined): boolean {
  const clean = (email ?? '').trim().toLowerCase()
  return clean !== '' && PERMANENT_ADMINS.includes(clean)
}

/** Used only to label a row in the Team screen. */
export function permanentRole(email: string): 'Developer' | 'Owner' {
  return email === DEVELOPER_EMAIL ? 'Developer' : 'Owner'
}
