# Portfolio — Project Plan
*PSP XMB-inspired interactive portfolio. Designer transitioning to frontend developer.*
*Last updated: incorporated shader experiment, browser bookmarks, language MVP, music approach, and open source leverage audit.*

---

## Brief

A downloadable, installable personal portfolio built as a PSP XMB (Cross Media Bar) simulator. The experience launches as a web app and ships as a native desktop app via Tauri. Navigation is a horizontal category rail with vertical sub-items per category, accompanied by sound effects on traversal. Each category either opens curated content (case studies, photos, music, PDFs) or launches a fullscreen mini app (canvas experiments, a simulated browser, a Galaga demo).

The portfolio serves a dual audience signal: the *design* is the argument for taste and craft; the *build* is the argument for frontend capability. The experience itself is the case study.

---

## Design Direction

- **Aesthetic:** PSP XMB — dark backgrounds, full bleed, large typography, horizontal navigation rail, fluid transitions
- **Sound:** Navigation tick on horizontal move, selection sound on vertical move, launch sound on mini app open, ambient background hum (optional, toggleable)
- **Motion:** Items scale up on focus, neighbors scale down, rail shifts horizontally, mini apps mount with a slide/fade transition
- **Inspirations:** PSP XMB, Zune media player, modern Arch Linux rices
- **Theme switching:** Available in Settings (dark/light + accent color options)
- **Multilingual:** English + Spanish (MVP). Switcher in Settings, persisted to localStorage

---

## Navigation Rail

```
Settings → Work → Built → Browser → Photos → Music → Files → Contacts → Games
```

| Category | Type | Description |
|---|---|---|
| Settings | Hardcoded | Theme, language/region config |
| Work | Sanity CMS | UX case studies with rich media |
| Built | Placeholder | "Coming soon" — to be decided post-launch |
| Browser | bookmarks.json + Wayback iframe | Simulated browser of 2 curated archived pages |
| Photos | Sanity CMS | Personal photo gallery with metadata |
| Music | /public/music/ + tracklist.json | Curated mixtape, manually maintained |
| Files | Sanity CMS | PDFs of past public talks/presentations |
| Contacts | contacts.json in repo | Links to friends' websites / webring |
| Games | Hardcoded | Galaga attract-mode demo with keyboard input |

---

## Tech Stack

### Frontend
| Tool | Role |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Bundler |
| Tailwind CSS | Utility styling |
| shadcn/ui | Base component library |
| react-i18next + i18next | Internationalization (EN + ES) |
| react-pdf | PDF rendering in Files viewer |
| Howler.js | Navigation sounds + music player audio |
| WebGL (raw) | XMB wave background + Built shader experiment |

### Open Source References (study only — rewrite from scratch in React)
| Project | Used For |
|---|---|
| `menonparik/xmb-on-web` | Visual & mechanical reference only — rewrite nav state machine in React from scratch |
| `fchavonet/web-xmb_wave_background` | Visual reference only — rewrite WebGL wave as React component from scratch |
| `gregfrazier/gakaga` (MIT) | Fork directly — strip game-over logic, React-ify, add attract mode |

### CMS & Storage
| Tool | Role |
|---|---|
| Sanity | CMS for Work, Photos, Files |
| Sanity Assets CDN | All media: images, PDFs, video embeds |

### Static Content (in repo)
| File | Role |
|---|---|
| `/public/music/*.mp3` | Audio files, manually added |
| `/public/music/tracklist.json` | Track metadata (title, artist, cover, year) |
| `/src/data/bookmarks.json` | Browser category bookmarks (2 Wayback URLs) |
| `/src/data/contacts.json` | Webring / friends links |
| `/src/locales/en.json` | English translation strings |
| `/src/locales/es.json` | Spanish translation strings |

### Infrastructure
| Tool | Role |
|---|---|
| GitHub | Primary remote, Vercel deploy trigger |
| Gitea (home server) | Personal mirror (secondary remote) |
| Vercel | Hosting + CDN |
| Tauri | Desktop app wrapper (Phase 4) |

### Tooling
| Tool | Role |
|---|---|
| Cursor | Primary editor |
| Claude Code | AI pair programming |

---

## Sanity Schema

### `caseStudy`
```
title          string
slug           slug
year           number
role           string
tags           array<string>
coverImage     image asset
body           Portable Text
  ↳ paragraph       block
  ↳ imageBlock      image asset + caption string
  ↳ videoBlock      video asset or embed URL
  ↳ pullQuote       string
  ↳ twoColumn       left image + right image + caption
```

### `photo`
```
image          image asset
caption        string
location       string
date           date
tags           array<string>
```

### `talk`
```
title          string
event          string
date           date
location       string
pdf            file asset
coverImage     image asset (optional)
```

---

## Static Data Shapes

### `tracklist.json`
```json
[
  {
    "id": "1",
    "title": "Track Title",
    "artist": "Artist Name",
    "src": "/music/track.mp3",
    "cover": "/music/covers/track.jpg",
    "year": 2019
  }
]
```

### `bookmarks.json`
```json
[
  {
    "label": "VLC Media Player",
    "url": "http://vlcmediaplayer.pl/vlc-media-player/",
    "year": "2011",
    "archive": "https://web.archive.org/web/20130124011543/http://vlcmediaplayer.pl/vlc-media-player/"
  },
  {
    "label": "W3Schools",
    "url": "https://www.w3schools.com/",
    "year": "2013",
    "archive": "https://web.archive.org/web/20131019005510/https://www.w3schools.com/"
  }
]
```

### `contacts.json`
```json
[
  {
    "name": "Friend Name",
    "url": "https://theirsite.com",
    "description": "Optional one-liner"
  }
]
```

---

## XMB Component Architecture

### Navigation State Machine
```
state {
  activeCategoryIndex   number     // horizontal position
  activeItemIndex       number     // vertical position within category
  openApp               string     // null | category key of launched mini app
  transitioning         boolean    // true during animation
}

events {
  MOVE_LEFT             activeCategoryIndex--
  MOVE_RIGHT            activeCategoryIndex++
  MOVE_UP               activeItemIndex--
  MOVE_DOWN             activeItemIndex++
  SELECT                launch item at [activeCategoryIndex][activeItemIndex]
  BACK                  close open app, return to rail
}
```

### Component Tree
```
<XMBShell>                        // root, handles keyboard input + state
  <WaveBackground />              // WebGL XMB wave (ported from fchavonet)
  <CategoryRail>                  // horizontal top rail
    <CategoryIcon />              // one per category, scales on focus
  </CategoryRail>
  <ItemList>                      // vertical sub-items for active category
    <ItemRow />                   // one per item in active category
  </ItemList>
  <AppMount>                      // fullscreen layer, mounts mini apps
    <SettingsPanel />             // theme + language controls
    <WorkViewer />                // Portable Text renderer
    <BuiltPlaceholder />          // "Coming soon" screen
    <BrowserApp />                // bookmarks list + Wayback sandboxed iframe
    <PhotoViewer />               // fullscreen photo + metadata overlay
    <MusicPlayer />               // audio player with tracklist + visualizer
    <FilesViewer />               // react-pdf PDF viewer
    <ContactsView />              // links list
    <GalagaDemo />                // canvas game (ported from gakaga, MIT)
  </AppMount>
  <SoundEngine />                 // Howler.js, plays nav sounds on state events
</XMBShell>
```

### Sound Events
```
onCategoryChange    → tick_horizontal.mp3
onItemChange        → tick_vertical.mp3
onSelect            → select_confirm.mp3
onBack              → select_back.mp3
onAppLaunch         → launch_whoosh.mp3
onAppClose          → close_swoosh.mp3
```

---

## Features List

### Core XMB Shell
- [ ] Horizontal category rail with focus scaling
- [ ] Vertical item list per category
- [ ] Keyboard navigation (arrow keys + Enter + Escape)
- [ ] Sound engine (Howler.js) hooked to nav events
- [ ] WebGL wave background (port fchavonet)
- [ ] App mount/unmount with transition animation
- [ ] Back navigation from any open app

### Settings
- [ ] Theme switcher (dark/light + accent colors)
- [ ] Language switcher (EN / ES via react-i18next)
- [ ] Persist preferences to localStorage

### Work
- [ ] Sanity schema + Studio setup
- [ ] Case study list as XMB sub-items
- [ ] Portable Text renderer (paragraph, imageBlock, videoBlock, pullQuote, twoColumn)
- [ ] Fullscreen case study viewer with scroll
- [ ] Cover image in sub-item preview

### Built
- [ ] Placeholder "Coming soon" screen styled to match PSP aesthetic
- [ ] Content TBD — decided post-launch based on what makes sense

### Browser
- [ ] bookmarks.json with 2 Wayback entries (VLC 2011, W3Schools 2013)
- [ ] Bookmarks rendered as XMB sub-items
- [ ] PSP browser chrome (fake URL bar, year label)
- [ ] Sandboxed iframe loading Wayback archive URLs
- [ ] (Future) open-ended URL + year input for any site

### Photos
- [ ] Sanity schema + image uploads
- [ ] Thumbnail strip as XMB sub-items
- [ ] Fullscreen viewer with crossfade transition
- [ ] Metadata overlay (caption, location, date)
- [ ] Exit back to strip

### Music
- [ ] MP3s in /public/music/, covers in /public/music/covers/
- [ ] tracklist.json manually maintained
- [ ] Audio player (play, pause, next, prev, progress bar) via Howler.js
- [ ] Cover art display
- [ ] PSP-style visualizer bar
- [ ] Player persists while navigating XMB

### Files
- [ ] Sanity schema + PDF uploads
- [ ] Talk list as XMB sub-items (title, event, date)
- [ ] Fullscreen PDF viewer via react-pdf
- [ ] Exit back to list

### Contacts
- [ ] contacts.json (name, URL, description)
- [ ] Rendered as link list
- [ ] Opens external URL on select

### Games — Galaga
- [ ] Port gakaga (MIT) to React canvas component
- [ ] Strip lives/game-over, make infinite looping
- [ ] Attract mode (auto-plays without input)
- [ ] Keyboard input (arrows + space to shoot)
- [ ] Retro sound effects

### Desktop App — Tauri (Phase 4)
- [ ] Tauri wrapper around web build
- [ ] Borderless custom window
- [ ] Auto-updater
- [ ] GitHub Actions: macOS (.dmg), Windows (.exe), Linux (.AppImage)
- [ ] Code signing (Apple Developer + Windows)
- [ ] Download page with per-platform buttons

---

## Phased Implementation Plan

### Phase 1 — Foundation + Professional Core
*Goal: Something you can show a hiring manager or client. XMB shell works, Work and Files are live.*

1. Project scaffold — Vite + React + TS + Tailwind + shadcn/ui
2. GitHub repo + Vercel deploy + Gitea mirror configured
3. react-i18next setup — EN + ES locale JSON files, language detection
4. XMB shell — category rail, item list, keyboard nav, state machine, transitions
5. WaveBackground — port fchavonet WebGL wave to React component
6. SoundEngine — Howler.js, nav sounds wired to state events
7. Sanity project — schemas defined, Studio configured (caseStudy, photo, talk)
8. Work category — case studies in Sanity, Portable Text renderer, viewer
9. Files category — PDFs in Sanity, react-pdf viewer
10. Settings — theme switcher + language switcher, localStorage persist
11. Landing page — minimal (name, one-liner, "open" / "download" CTA)

**Exit criteria:** XMB navigates with sound, Work shows real case studies, Files shows real PDFs, Settings switches themes and language. Deployed to Vercel.

---

### Phase 2 — Media + Personality
*Goal: Personal identity comes through. Photos, music, contacts make it feel like you.*

1. Photos — Sanity uploads, thumbnail strip, fullscreen viewer, metadata overlay
2. Music — MP3s in /public, tracklist.json, Howler.js player, cover art, visualizer bar, persistent playback
3. Contacts — contacts.json, link list, external nav
4. Background layer — category-aware atmosphere per section (subtle color/mood shift)
5. Ambient sound — optional hum, toggleable in Settings
6. Polish pass — transition timing, sound tuning, responsive layout

**Exit criteria:** Every rail category functional. Experience holds as a coherent personal thing.

---

### Phase 3 — Interactive & Experimental
*Goal: Built and Browser prove frontend range. Games add delight.*

1. Built — port Shadertoy NXlXD4 GLSL to WebGL canvas, fullscreen mount, detail overlay
2. Browser — bookmarks.json rendered, Wayback iframe with PSP chrome, sandboxed rendering
3. Games — port gakaga (MIT) to React, strip game-over, add attract mode, keyboard input
4. Polish — shader performance tuning, iframe sandbox edge cases, game feel

**Exit criteria:** Built, Browser, and Games are all functional and fun.

---

### Phase 4 — Desktop App
*Goal: Real installable binary. The full original vision.*

1. Tauri integration — wrap web build, test macOS + Windows + Linux
2. Custom window chrome — borderless, PSP-inspired frame
3. Auto-updater — checks for new version on launch
4. GitHub Actions — automated release builds for all platforms
5. Code signing — Apple Developer + Windows signing
6. Download page — per-platform buttons, update landing page

**Exit criteria:** Hand someone a download link, they install a real native app.

---

## Open Questions

- Built — decide post-launch: placeholder, real built work, or fresh shader
- Music — tracklist content (you'll add manually, but any structure preferences)?
- Contacts — who goes in the webring at launch?
- Additional languages beyond EN + ES in future phases?

---

## Claude Code Handoff

*Everything Claude needs to start Phase 1 without re-litigating decisions.*

### What this project is
A PSP XMB-inspired interactive portfolio. The nav shell is a horizontal category rail (like a PSP) with vertical sub-items per category, keyboard navigation, and sound effects on every interaction. Each category either opens a content viewer (case studies, photos, music, PDFs) or launches a fullscreen mini app (WebGL shader, simulated browser, Galaga demo). Ships as a web app first, Tauri desktop app in Phase 4.

### Immediate goal (Phase 1)
Scaffold the project, get the XMB shell navigating with sound, connect Sanity, and render real Work case studies and Files PDFs. Everything else comes later.

### Key decisions already made — do not re-litigate
- React 18 + TypeScript + Vite + Tailwind + shadcn/ui. No other framework options.
- Sanity for CMS (Work case studies + Photos + Files/PDFs). Sanity Assets for all media.
- react-i18next for i18n. EN + ES only for now. JSON locale files in /src/locales/.
- Howler.js for all audio (nav sounds + music player).
- react-pdf for the Files PDF viewer.
- Music lives in /public/music/ as MP3s + tracklist.json. No CMS for music.
- Static JSON files for bookmarks, contacts, settings defaults.
- GitHub as primary remote. Gitea home server as secondary mirror.
- Vercel for deploy. Tauri for desktop (Phase 4 only, ignore for now).
- No Supabase. No Streamlit. No Notion API. No other backend.

### Reference repos to clone locally (for Claude to read as context)
These are visual/mechanical references only — do not copy code directly:
- https://github.com/menonparik/xmb-on-web (XMB nav mechanics, CSS transforms)
- https://github.com/fchavonet/creative_coding-xmb_wave_background (WebGL wave shader)

This one is MIT licensed — fork and build on directly:
- https://github.com/gregfrazier/gakaga (Galaga canvas clone)

### Project structure to scaffold
```
/
├── src/
│   ├── components/
│   │   ├── xmb/
│   │   │   ├── XMBShell.tsx         # root, keyboard input, state machine
│   │   │   ├── CategoryRail.tsx     # horizontal top rail
│   │   │   ├── CategoryIcon.tsx     # single category icon + label
│   │   │   ├── ItemList.tsx         # vertical sub-items
│   │   │   ├── ItemRow.tsx          # single sub-item row
│   │   │   ├── AppMount.tsx         # fullscreen app layer
│   │   │   └── WaveBackground.tsx   # WebGL wave (written from scratch)
│   │   ├── apps/
│   │   │   ├── WorkViewer.tsx       # Portable Text renderer
│   │   │   ├── PhotoViewer.tsx      # fullscreen photo + metadata
│   │   │   ├── MusicPlayer.tsx      # Howler.js audio player
│   │   │   ├── BrowserApp.tsx       # Wayback iframe + bookmarks
│   │   │   ├── FilesViewer.tsx      # react-pdf viewer
│   │   │   ├── ContactsView.tsx     # links list
│   │   │   ├── BuiltExperiment.tsx  # WebGL shader fullscreen
│   │   │   ├── GalagaDemo.tsx       # canvas game
│   │   │   └── SettingsPanel.tsx    # theme + language
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/
│   │   ├── useXMBNavigation.ts      # keyboard nav + state
│   │   └── useSoundEngine.ts        # Howler.js wrapper
│   ├── lib/
│   │   ├── sanity.ts                # Sanity client
│   │   └── i18n.ts                  # i18next config
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   ├── data/
│   │   ├── bookmarks.json
│   │   ├── contacts.json
│   │   └── categories.ts            # category definitions + metadata
│   ├── types/
│   │   └── index.ts                 # shared TypeScript types
│   └── styles/
│       └── globals.css
├── public/
│   ├── music/                       # MP3s + covers (added manually)
│   │   └── tracklist.json
│   └── sounds/                      # nav sound effects
│       ├── tick_horizontal.mp3
│       ├── tick_vertical.mp3
│       ├── select_confirm.mp3
│       ├── select_back.mp3
│       ├── launch_whoosh.mp3
│       └── close_swoosh.mp3
├── sanity/                          # Sanity Studio (separate workspace)
│   ├── schemas/
│   │   ├── caseStudy.ts
│   │   ├── photo.ts
│   │   └── talk.ts
│   └── sanity.config.ts
└── package.json
```

### XMB state shape
```typescript
interface XMBState {
  activeCategoryIndex: number;
  activeItemIndex: number;
  openApp: string | null;        // category key e.g. 'work', 'music', null
  transitioning: boolean;
}
```

### Category definitions
```typescript
const CATEGORIES = [
  { key: 'settings', label: 'Settings',  icon: '⚙️' },
  { key: 'work',     label: 'Work',      icon: '💼' },
  { key: 'built',    label: 'Built',     icon: '⚡' },
  { key: 'browser',  label: 'Browser',   icon: '🌐' },
  { key: 'photos',   label: 'Photos',    icon: '📷' },
  { key: 'music',    label: 'Music',     icon: '🎵' },
  { key: 'files',    label: 'Files',     icon: '📄' },
  { key: 'contacts', label: 'Contacts',  icon: '👥' },
  { key: 'games',    label: 'Games',     icon: '🎮' },
] as const;
```

### Sound events
```typescript
// useSoundEngine.ts should expose:
playSound('tick_horizontal' | 'tick_vertical' | 'select_confirm' | 'select_back' | 'launch_whoosh' | 'close_swoosh')
```

### Sanity schemas (shorthand)
```
caseStudy: title, slug, year, role, tags[], coverImage, body (Portable Text)
photo:     image, caption, location, date, tags[]
talk:      title, event, date, location, pdf, coverImage?
```

### Portable Text block types to support
paragraph, imageBlock (image + caption), videoBlock (asset or embed URL), pullQuote, twoColumn (left image + right image + caption)

### i18n setup
- Library: react-i18next + i18next-browser-languagedetector
- Locale files: /src/locales/en.json and es.json
- Switcher lives in SettingsPanel.tsx
- Persist selected language to localStorage

### Browser category bookmarks
```json
[
  {
    "label": "VLC Media Player",
    "url": "http://vlcmediaplayer.pl/vlc-media-player/",
    "year": "2011",
    "archive": "https://web.archive.org/web/20130124011543/http://vlcmediaplayer.pl/vlc-media-player/"
  },
  {
    "label": "W3Schools",
    "url": "https://www.w3schools.com/",
    "year": "2013",
    "archive": "https://web.archive.org/web/20131019005510/https://www.w3schools.com/"
  }
]
```

### Phase 1 build order for Claude
1. Scaffold Vite + React + TS + Tailwind + shadcn/ui
2. Install all deps: react-i18next, i18next, i18next-browser-languagedetector, howler, motion, react-pdf, @sanity/client, @portabletext/react
3. Set up i18n (lib/i18n.ts + locale JSON stubs)
4. Build XMBShell + useXMBNavigation hook (keyboard nav, state machine)
5. Build CategoryRail + CategoryIcon (horizontal rail, scaling on focus)
6. Build ItemList + ItemRow (vertical sub-items)
7. Build WaveBackground (WebGL wave — reference fchavonet visually, write from scratch)
8. Wire SoundEngine (useSoundEngine hook with Howler.js)
9. AppMount layer (fullscreen container, mounts/unmounts apps)
10. Sanity client setup + schemas
11. WorkViewer (fetch case studies, Portable Text renderer)
12. FilesViewer (fetch talks from Sanity, react-pdf)
13. SettingsPanel (theme toggle, language switcher)
14. Landing page (minimal, outside XMB shell)
15. Vercel deploy config

### Things Claude should NOT do without asking
- Add any backend, database, or auth layer not listed here
- Change the tech stack
- Use Electron (Tauri is Phase 4, ignore for now)
- Add more categories to the rail
- Use any CMS other than Sanity
- Build Phase 2+ features during Phase 1

### Open questions to resolve before starting
- Nav sound files needed in /public/sounds/ (source or generate before Phase 1 audio wiring)
- Sanity project ID and dataset name (create project at sanity.io first)

---

## Service & Tool Setup Status

*Check off as each is configured. Claude Code will need the marked values as env vars or config.*

### ✅ Ready
| Service | Notes |
|---|---|
| GitHub | Repo hosting + Vercel deploy trigger — already running |
| Vercel | Hosting + CDN — already running |
| Cursor | Primary editor — already running |

### 🔧 Needs Setup
| Service | What to do | Values needed by Claude Code |
|---|---|---|
| Sanity | Create/recover account at sanity.io, create new project | `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` |
| Gitea | Configure home server as secondary Git remote | Remote URL (e.g. `http://homeserver/user/portfolio.git`) |

### 📦 Installed by Claude Code (no pre-config needed)
These are npm packages — Claude Code installs them during scaffold, nothing to set up beforehand.

| Package | Purpose |
|---|---|
| `react-i18next` + `i18next` | Internationalization |
| `i18next-browser-languagedetector` | Auto language detection |
| `howler` | Nav sounds + music player |
| `motion` | Mount/unmount transitions, animation primitives |
| `react-pdf` | PDF viewer in Files category |
| `@sanity/client` | Sanity data fetching |
| `@portabletext/react` | Portable Text renderer for Work |
| `tailwindcss` | Utility styling |
| `shadcn/ui` | Base component library |

### 🔑 Environment Variables (.env.local)
Claude Code will need these before wiring up Sanity. All others are either hardcoded or in JSON files.

```
VITE_SANITY_PROJECT_ID=        # from sanity.io project settings
VITE_SANITY_DATASET=production # default unless you named it differently
```

### 🎵 Nav Sounds
Generated programmatically via Web Audio API — no files to source, no license concerns.
Claude Code will implement a `useSoundEngine` hook that synthesizes all 6 sounds in code:
- `tick_horizontal` — short sine blip
- `tick_vertical` — slightly different sine blip  
- `select_confirm` — ascending two-tone
- `select_back` — descending tone
- `launch_whoosh` — noise sweep up
- `close_swoosh` — noise sweep down

### 🎨 Built Experiment — DEFERRED
The Built category ships as a placeholder "Coming soon" screen in Phase 1. Final content (shader, real built work, or component embeds) is decided post-launch when there's a clearer sense of what fits.
