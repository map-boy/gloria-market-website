import {
  CircleHelp, Info, LayoutDashboard, Layers, Megaphone, PanelsTopLeft, Sparkles, Users,
  type LucideIcon,
} from 'lucide-react'

export type PanelId =
  | 'overview' | 'brand' | 'hero' | 'sections' | 'highlights' | 'about' | 'team' | 'help'

export interface NavItem {
  id: PanelId
  label: string
  /** Shown under the label so a new admin knows what the screen does. */
  hint: string
  Icon: LucideIcon
  group: string
}

export const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', hint: 'Start here', Icon: LayoutDashboard, group: 'Shop' },
  { id: 'brand', label: 'Brand & bar', hint: 'Name, logo, notice', Icon: Megaphone, group: 'Home page' },
  { id: 'hero', label: 'Top banner', hint: 'Big picture and buttons', Icon: PanelsTopLeft, group: 'Home page' },
  { id: 'sections', label: 'Sections', hint: 'Your pictures and videos', Icon: Layers, group: 'Home page' },
  { id: 'highlights', label: 'Highlights', hint: 'Short promises strip', Icon: Sparkles, group: 'Home page' },
  { id: 'about', label: 'About & contact', hint: 'Story, footer, socials', Icon: Info, group: 'Home page' },
  { id: 'team', label: 'Team', hint: 'Who can edit', Icon: Users, group: 'Account' },
  { id: 'help', label: 'Help', hint: 'Guides and support', Icon: CircleHelp, group: 'Account' },
]

export const NAV_GROUPS = ['Shop', 'Home page', 'Account']
