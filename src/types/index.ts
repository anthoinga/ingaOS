export type CategoryKey =
  | 'settings' | 'work' | 'built' | 'browser'
  | 'photos' | 'music' | 'files' | 'contacts' | 'games'

export type SoundName =
  | 'tick_horizontal' | 'tick_vertical'
  | 'select_confirm' | 'select_back'
  | 'launch_whoosh' | 'close_swoosh'

export interface Category {
  key: CategoryKey
  labelKey: string
  icon: string
  items: XMBItem[]
}

export interface XMBItem {
  id: string
  label: string
  subtitle?: string
  thumbnail?: string
  action: XMBAction
}

export type XMBAction =
  | { type: 'openApp'; app: CategoryKey }
  | { type: 'openUrl'; url: string }
  | { type: 'openPdf'; url: string }
  | { type: 'playTrack'; trackId: string }

export interface XMBState {
  activeCategoryIndex: number
  activeItemIndex: number
  openApp: CategoryKey | null
  transitioning: boolean
}
