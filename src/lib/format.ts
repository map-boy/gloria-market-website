/** Prices are stored as plain numbers and shown with the currency from
 *  settings, so the cart can add them up. */
export function formatPrice(amount: number, currency: string): string {
  if (!amount || amount <= 0) return ''
  const number = new Intl.NumberFormat('en-US').format(amount)
  return currency ? `${currency} ${number}` : number
}

/** Accepts anything the admin types, including an old text price like
 *  "RWF 65,300", and returns a number. */
export function parsePrice(value: string | number | undefined | null): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const digits = String(value ?? '').replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Strips everything but digits so a number can go into a wa.me link. */
export function whatsappDigits(value: string): string {
  return value.replace(/[^0-9]/g, '')
}
