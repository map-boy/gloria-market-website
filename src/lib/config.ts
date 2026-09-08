/** The one account that is always an admin, so a brand new site has a way in.
 *  Everyone else has to be added to the `admins` collection from the panel. */
export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || '').trim().toLowerCase()
