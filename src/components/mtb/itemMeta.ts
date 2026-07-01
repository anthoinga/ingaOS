import {
  Settings,
  FileText,
  Globe,
  Music2,
  Gamepad2,
  Code2,
  User,
  Image,
  FileCode,
} from 'lucide-svelte'
import {
  CRIMSON,
  GREEN,
  PURPLE,
  CYAN,
  ORANGE,
  BLUE,
  YELLOW,
  type ShaderColors,
} from '@/effects/waveColors'
import type { MTBItem } from '@/types'
import type { ComponentType } from 'svelte'

// One source of truth for an item's visual identity: the wave palette behind it (system →
// effect contract), plus the icon/extension/color of its file-symbol chip. Both the shell's
// WaveBackground and the ItemEntry file symbol resolve through here so they never drift apart.
export interface ItemIdentity {
  palette: ShaderColors
  icon: ComponentType
  extension: string
  colorClass: string
}

const IDENTITY = {
  settings: { palette: CRIMSON, icon: Settings, extension: 'sys', colorClass: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/25' },
  files:    { palette: CRIMSON, icon: FileText, extension: 'pdf', colorClass: 'text-red-400 bg-red-500/10 border-red-500/25' },
  browser:  { palette: GREEN,   icon: Globe,    extension: 'url', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  music:    { palette: PURPLE,  icon: Music2,   extension: 'mp3', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/25' },
  games:    { palette: ORANGE,  icon: Gamepad2, extension: 'bin', colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/25' },
  code:     { palette: CYAN,    icon: Code2,    extension: 'src', colorClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25' },
  contacts: { palette: BLUE,    icon: User,     extension: 'vcf', colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  photos:   { palette: YELLOW,  icon: Image,    extension: 'png', colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
  generic:  { palette: CRIMSON, icon: FileCode, extension: 'doc', colorClass: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/25' },
} satisfies Record<string, ItemIdentity>

export function resolveItemMeta(item: MTBItem): ItemIdentity {
  const id = item.id.toLowerCase()
  const isUrl = item.action?.type === 'openUrl'

  if (id.startsWith('settings-')) return IDENTITY.settings
  if (id.startsWith('files-')) return IDENTITY.files
  if (id.startsWith('music-')) return IDENTITY.music
  if (id.startsWith('games-') || id === 'galaga') return IDENTITY.games
  if (id.startsWith('built-') || id.startsWith('work-')) return IDENTITY.code
  if (id.startsWith('contacts-')) return IDENTITY.contacts
  if (id.startsWith('photos-')) return IDENTITY.photos
  if (isUrl || id.startsWith('browser-')) return IDENTITY.browser
  return IDENTITY.generic
}
