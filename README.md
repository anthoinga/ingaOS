# ingaOS

Interfaces dictate how we move through the digital world. Modern software has largely abandoned that responsibility in favor of administrative bloat.

This operating system is a functional study in structural minimalism, built as a direct homage to Yasuhiro Yamanaka's interface design philosophy. When Yamanaka engineered Sony's XrossMediaBar, he solved a complex information architecture problem through radical distillation. By intersecting two independent axes and anchoring the focal point to the center of the screen, he eliminated the cognitive friction of scanning a grid. Navigation became instinct. The interface disappeared.

ingaOS is a personal love letter to the legend who defined the interfaces of my childhood.

---

## Technical Highlights

* **Web Audio API DSP Engine**: All navigation interface sounds and ambient background loops are synthesized programmatically in real-time. The shell loads zero audio asset files.
* **Bayer-Dithered WebGL2 Shader**: The background animations are driven by a custom WebGL2 fragment shader for high-performance GPU rendering with low CPU overhead.
* **Clean State Machine**: Governed by a single, predictable `useReducer` action loop for layout translations, bypassing complex global state overhead.

---

## Directory Map

* [`./src/components/xmb/`](./src/components/xmb/) — The Core XMB Navigation Shell (Rails, Item lists, Item rows, and Sidebar mounts)
* [`./src/components/apps/`](./src/components/apps/) — Self-contained lightweight sub-views (Settings, Contacts, Browser, Music Player)
* [`./src/effects/`](./src/effects/) — Audio Synthesizer Engine (Web Audio API DSP) & Bayer-Dithered Canvas (WebGL)
* [`./src/styles/globals.css`](./src/styles/globals.css) — Global tokens, animations, and typography variables

---

## Getting Started

Requires Node.js 18+.

```bash
npm install
npm run dev      # Launch locally at http://localhost:5173
npm run build    # Compile production bundle
```

---

© 2026 Anthony Inga. All rights reserved.
