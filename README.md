# ingaOS

Interfaces dictate how we move through the digital world. Modern software has largely abandoned that responsibility in favor of administrative bloat.

This interface is a functional study in structural minimalism, built as a direct homage to Yasuhiro Yamanaka's interface design philosophy. When Yamanaka engineered Sony's XrossMediaBar (XMB), he solved a complex information architecture problem through radical distillation. By intersecting two independent axes and anchoring the focal point to the center of the screen, he eliminated the cognitive friction of scanning a visual grid. Navigation became instinct. The interface disappeared.

ingaOS is a personal love letter to the legend who defined the interfaces of my childhood.

---

## Features

### Authentic XMB Experience
* **Dynamic Orthogonal Navigation**: Intersects a horizontal category rail with vertical item list columns.
* **Centered Focal Anchor**: Focus stays locked to the rest ratio of the screen while categories and items translate behind it.
* **Svelte 5 Reactive State**: Powered by class-based reactive state controllers (`$state` and `$derived`), ensuring lightweight navigation loop logic without virtual DOM overhead.
* **Mobile & Gesture Support**: Automatically registers touch swipe gestures for horizontal/vertical navigation, tailored for mobile screens.

### Graphics & Sound
* **Web Audio API Synth Engine**: Programmatically synthesizes all UI sounds (clicks, confirms, exits) in real-time. Zero audio asset files are loaded for UI interaction.
* **Bayer-Dithered WebGL2 Shader**: Custom GPU fragment shader background that dynamically interpolates gradients according to the active item theme.
* **Performance-Based Fallbacks**: Automatically falls back to a lightweight CSS gradient on devices with `prefers-reduced-motion` or coarse pointer profiles.

---

## Built-in Applications

* **Work**: Interactive professional portfolio detailing case studies, team highlights, and engineering experience.
* **Files**: Embedded PDF viewer and CV downloader powered by `pdfjs-dist`.
* **Settings**: Control panel to adjust language preferences (English/Spanish) and toggle appearance themes.
* **Experiments**: Showcase of interactive side-projects and frontend experiments.
* **Browser**: Collection of links to external web projects and custom web views.
* **Photos**: Photo gallery viewer showcasing curated travel and landscape photography.
* **Music**: Persistent background audio player powered by Howler.js that maintains playback state across app view changes.
* **Contacts**: Secure links and directories to connect across professional and social platforms.
* **Games**: Integration portal for retro-gaming applets (e.g., Galaga).

---

## Quick Start

### Controls
* **Keyboard**: 
  - `ArrowLeft` / `ArrowRight` — Navigate between categories.
  - `ArrowUp` / `ArrowDown` — Scroll through category items.
  - `Enter` — Select / launch active item.
  - `Escape` — Reset active item / Close active app panel.
* **Mouse / Trackpad**: Click to select active categories/items, or hover and swipe to scroll.
* **Mobile / Touch**: Swipe left/right/up/down to navigate, and tap to select.

---

## Project Structure

```
├── public/           # Static assets (fonts, wallpapers, PDF worker)
├── src/
│   ├── components/
│   │   ├── apps/     # Self-contained Svelte app panels (Work, Files, Settings, etc.)
│   │   ├── mtb/      # Core XMB/MTB layout components (MTBShell, CategoryColumn, ItemList, etc.)
│   │   └── ui/       # Primitives (shadcn-style atomic elements)
│   ├── contexts/     # Music player and persistence contexts
│   ├── data/         # Mock categories, work database, configuration contracts
│   ├── effects/      # Web Audio DSP synthesizer and WebGL shader backgrounds
│   ├── hooks/        # Reactive navigation models, music, and swipe controllers
│   ├── lib/          # Utilities, i18n initialization
│   ├── styles/       # CSS tokens and global utilities
│   ├── types/        # TypeScript type interfaces
│   ├── App.svelte    # Root app shell
│   └── main.ts       # Entry point
```

---

## Tech Stack

* **Frontend**: Svelte 5, TypeScript 5, Vite 5, Tailwind CSS v3, PostCSS, Autoprefixer
* **Audio**: Web Audio API (real-time SFX synth), Howler.js (persistent audio player context)
* **Graphics**: WebGL2 Canvas
* **PDF rendering**: `pdfjs-dist` (v4 with minified worker)
* **Icons**: `lucide-svelte`
* **Localization**: `i18next` with `i18next-browser-languagedetector`

---

## Scripts

```bash
npm run dev          # Start Vite dev server locally
npm run build        # Build production assets for deployment
npm run preview      # Preview the built production assets locally
npm run type-check   # Validate TypeScript types without outputting files
npm run lint         # Run ESLint rules and check architectural boundaries
```

---

© 2026 Anthony Inga. All rights reserved.
