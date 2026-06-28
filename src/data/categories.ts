import type { Category } from '@/types'

export const CATEGORIES: Category[] = [
  {
    key: 'settings',
    labelKey: 'categories.settings',
    icon: '⚙️',
    items: [
      {
        id: 'settings-main',
        label: 'System Settings',
        action: { type: 'openApp', app: 'settings' },
      },
    ],
  },
  {
    key: 'work',
    labelKey: 'categories.work',
    icon: '💼',
    items: [], // populated dynamically from Sanity
  },
  {
    key: 'built',
    labelKey: 'categories.built',
    icon: '🔧',
    items: [
      {
        id: 'built-main',
        label: 'Side Projects',
        action: { type: 'openApp', app: 'built' },
      },
    ],
  },
  {
    key: 'browser',
    labelKey: 'categories.browser',
    icon: '🌐',
    items: [
      {
        id: 'browser-main',
        label: 'Wayback Browser',
        action: { type: 'openApp', app: 'browser' },
      },
    ],
  },
  {
    key: 'photos',
    labelKey: 'categories.photos',
    icon: '📷',
    items: [], // populated dynamically from Sanity
  },
  {
    key: 'music',
    labelKey: 'categories.music',
    icon: '🎵',
    items: [
      {
        id: 'music-player',
        label: 'Music Player',
        action: { type: 'openApp', app: 'music' },
      },
    ],
  },
  {
    key: 'files',
    labelKey: 'categories.files',
    icon: '📁',
    items: [], // populated dynamically from Sanity (talks/PDFs)
  },
  {
    key: 'contacts',
    labelKey: 'categories.contacts',
    icon: '👤',
    items: [
      {
        id: 'contacts-main',
        label: 'Contacts',
        action: { type: 'openApp', app: 'contacts' },
      },
    ],
  },
  {
    key: 'games',
    labelKey: 'categories.games',
    icon: '🎮',
    items: [
      {
        id: 'galaga',
        label: 'Galaga',
        action: { type: 'openApp', app: 'games' },
      },
    ],
  },
]
