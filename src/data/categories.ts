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
        labelKey: 'items.settings_main',
        action: { type: 'openApp', app: 'settings' },
      },
      {
        id: 'settings-about',
        label: 'About',
        labelKey: 'items.settings_about',
        action: { type: 'openApp', app: 'settings' },
      },
    ],
  },
  {
    key: 'work',
    labelKey: 'categories.work',
    icon: '💼',
    items: [
      {
        id: 'work-persimmony',
        label: 'Persimmony — Design Engineer',
        action: { type: 'openUrl', url: 'https://persimmony.com' },
      },
      {
        id: 'work-7eleven',
        label: '7NEXT R&D — Experience Designer',
        action: { type: 'openUrl', url: 'https://www.7-eleven.com' },
      },
      {
        id: 'work-albertsons',
        label: 'Albertsons — Experience Architect',
        action: { type: 'openUrl', url: 'https://anthonyi.notion.site/DESIGNING-FOR-NEW-NORMS-259037de3129805b9822d688be9175ea' },
      },
      {
        id: 'work-rh',
        label: 'Robert Half — Experience Designer',
        action: { type: 'openUrl', url: 'https://anthonyi.notion.site/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd' },
      },
      {
        id: 'work-aviator',
        label: 'Aviator — Experience Designer',
        action: { type: 'openUrl', url: 'https://anthonyi.notion.site/Setting-New-Infrastructure-257037de31298000bd68fa954cb48ec1' },
      },
    ],
  },
  {
    key: 'built',
    labelKey: 'categories.built',
    icon: '🔧',
    items: [
      {
        id: 'built-ingaos',
        label: 'ingaOS',
        action: { type: 'openUrl', url: 'https://github.com/anthoinga/portfolio-main' },
      },
      {
        id: 'built-RSVPchat',
        label: 'RSVP AI Chat',
        action: { type: 'openUrl', url: 'https://github.com/anthoinga/rsvp-reader-app' },
      },
      {
        id: 'built-projects',
        label: 'Experiments (coming soon)',
        labelKey: 'items.experiments_coming_soon',
      },
    ],
  },
  {
    key: 'browser',
    labelKey: 'categories.browser',
    icon: '🌐',
    items: [
      {
        id: 'browser-bookmarks',
        label: 'Bookmarks (coming soon)',
        labelKey: 'items.bookmarks_coming_soon',
      },
    ],
  },
  {
    key: 'photos',
    labelKey: 'categories.photos',
    icon: '📷',
    items: [
      {
        id: 'photos-huarochiri-01',
        label: 'Huarochirí Landscape — Part I',
        action: { type: 'openUrl', url: '/photos/IMG_huarochiri01.jpeg' },
      },
      {
        id: 'photos-huarochiri-02',
        label: 'Huarochirí Landscape — Part II',
        action: { type: 'openUrl', url: '/photos/IMG_huarochiri02.jpeg' },
      },
      {
        id: 'photos-huarochiri-03',
        label: 'Huarochirí Landscape — Part III',
        action: { type: 'openUrl', url: '/photos/IMG_huarochiri03.jpeg' },
      },
      {
        id: 'photos-coming-soon',
        label: 'Gallery (coming soon)',
        labelKey: 'items.gallery_coming_soon',
      },
    ],
  },
  {
    key: 'music',
    labelKey: 'categories.music',
    icon: '🎵',
    items: [
      {
        id: 'music-gasolina',
        label: 'Gasolina',
        subtitle: 'Daddy Yankee',
        action: {
          type: 'playTrack',
          trackId: 'gasolina',
          title: 'Gasolina',
          artist: 'Daddy Yankee',
          src: '/music/Daddy Yankee - Gasolina.mp3',
          cover: '/images/album-cover.png',
        },
      },
      {
        id: 'music-freak-on-a-leash',
        label: 'Freak on a Leash',
        subtitle: 'Korn',
        action: {
          type: 'playTrack',
          trackId: 'freak-on-a-leash',
          title: 'Freak on a Leash',
          artist: 'Korn',
          src: '/music/Korn - Freak on a Leash.mp3',
          cover: '/images/album-cover.png',
        },
      },
      {
        id: 'music-el-rosario-de-mi-madre',
        label: 'El Rosario de Mi Madre',
        subtitle: 'Los Embajadores Criollos',
        action: {
          type: 'playTrack',
          trackId: 'el-rosario-de-mi-madre',
          title: 'El Rosario de Mi Madre',
          artist: 'Los Embajadores Criollos',
          src: '/music/Los Embajadores Criollos - El Rosario de Mi Madre.mp3',
          cover: '/images/album-cover.png',
        },
      },
    ],
  },
  {
    key: 'files',
    labelKey: 'categories.files',
    icon: '📁',
    items: [
      {
        id: 'files-resume',
        label: 'Resume / CV',
        labelKey: 'items.resume_cv',
        action: { type: 'openUrl', url: '/docs/INGA_CV.pdf' },
      },
      {
        id: 'files-coming-soon',
        label: 'Talks & PDFs (coming soon)',
        labelKey: 'items.talks_coming_soon',
      },
    ],
  },
  {
    key: 'contacts',
    labelKey: 'categories.contacts',
    icon: '👤',
    items: [
      {
        id: 'contacts-connect',
        label: 'Connect',
        labelKey: 'items.connect',
        action: { type: 'openApp', app: 'contacts' },
      },
      {
        id: 'contacts-friends',
        label: 'Friends (Coming soon)',
        labelKey: 'items.friends_coming_soon',
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
        label: 'Galaga (coming soon)',
        labelKey: 'items.galaga_coming_soon',
      },
      {
        id: 'games-more',
        label: 'More Games (coming soon)',
        labelKey: 'items.more_games_coming_soon',
      },
    ],
  },
]
