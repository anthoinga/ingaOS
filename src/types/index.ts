export type KnownCategoryKey =
  | 'settings' | 'work' | 'built' | 'browser'
  | 'photos' | 'music' | 'files' | 'contacts' | 'games'

// Open to extension: use KnownCategoryKey for exhaustive checks, CategoryKey everywhere else.
export type CategoryKey = KnownCategoryKey | (string & {})

export type SoundName =
  | 'tick_horizontal' | 'tick_vertical'
  | 'select_confirm' | 'select_back'
  | 'launch_whoosh' | 'close_swoosh'
  | 'boot_up'

export interface Category {
  key: CategoryKey
  labelKey: string
  icon: string
  items: MTBItem[]
}

export interface MTBItem {
  id: string
  label: string
  labelKey?: string
  subtitle?: string
  thumbnail?: string
  action?: MTBAction
}

// Minimum contract all app components must satisfy; item is available for apps that need it.
export interface AppProps {
  onClose: () => void
  item?: MTBItem
}

export type MTBAction =
  | { type: 'openApp'; app: CategoryKey }
  | { type: 'openUrl'; url: string }
  | { type: 'openPdf'; url: string }
  | { type: 'playTrack'; trackId: string; title: string; artist: string; src: string; cover?: string }

export interface MTBState {
  activeCategoryIndex: number
  activeItemIndex: number
  openApp: CategoryKey | null
  transitioning: boolean
}
