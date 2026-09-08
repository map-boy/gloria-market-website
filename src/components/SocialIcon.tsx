import { SOCIAL_PATHS, type SocialKey } from '../lib/icons'

export default function SocialIcon({ name, size = 18 }: { name: SocialKey; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={SOCIAL_PATHS[name]} />
    </svg>
  )
}
