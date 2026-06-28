# Portfolio App - Context Documentation

## Project Overview
A modern, responsive portfolio website built with Next.js 14, showcasing projects in a tile-based grid layout. The app features a clean design with custom typography, project showcase tiles, and integrated Spotify widget functionality.

**Owner**: Inga
**Location**: Texas
**Tagline**: 🇵🇪 HECHO EN PERU

## Tech Stack

### Core Framework
- **Next.js**: 14.0.0 (App Router)
- **React**: 18.2.0
- **TypeScript**: 5.0.0
- **Node.js**: Running on port 3001

### Styling
- **Tailwind CSS**: 3.4.0
- **PostCSS**: 8.4.0
- **Autoprefixer**: 10.4.0
- **Custom CSS Variables**: Defined in globals.css

### Fonts
- **Monofett**: Logo text
- **Fira Code**: Code/technical text
- **Fira Mono**: Monospace text
- **Montserrat**: Body text (400, 700 weights)

### Backend & Services
- **Supabase**: 2.39.0 (PostgreSQL database)
- **Sanity CMS**: 6.0.0 (Content management, not fully implemented)
- **Anthropic AI SDK**: 0.20.0 (AI integration capabilities)
- **GSAP**: 3.12.0 (Animation library)

### Infrastructure
- **Docker Compose**: Local development setup
- **PostgreSQL**: 15.1.0.117 (via Supabase)
- **Redis**: Alpine (optional caching layer)
- **Supabase Studio**: Port 3000

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx          # Top navigation with name, title, location
│   │   │   │   ├── Footer.tsx          # Bottom section with copyright info
│   │   │   │   └── Spacer.tsx          # Spacing utility component
│   │   │   ├── portfolio/
│   │   │   │   ├── ProjectGrid.tsx     # Main grid container (3 columns)
│   │   │   │   ├── ProjectColumn.tsx   # Single column wrapper
│   │   │   │   └── ProjectTile.tsx     # Individual project card
│   │   │   └── widgets/
│   │   │       ├── SpotifyWidget.tsx   # Spotify now playing widget
│   │   │       ├── MusicPlayer.tsx     # Music player controls
│   │   │       └── TrackList.tsx       # Track listing component
│   │   ├── data/
│   │   │   ├── constants.ts            # Design tokens & configuration
│   │   │   ├── projects.ts             # Project data (3 columns)
│   │   │   └── music.ts                # Spotify/music data
│   │   ├── lib/
│   │   │   └── icons.ts                # Icon definitions
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript type definitions
│   │   ├── layout.tsx                  # Root layout with metadata
│   │   └── page.tsx                    # Homepage component
│   └── styles/
│       ├── globals.css                 # Global styles & CSS variables
│       └── fonts.css                   # Google Fonts imports
├── public/
│   └── images/                         # Project images (11 images)
├── supabase/
│   ├── config.toml                     # Supabase configuration
│   └── .temp/                          # Temporary files
├── api/                                # Empty API directory
├── docker-compose.yml                  # Local infrastructure setup
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Dependencies & scripts
```

## Design System

### Colors
```typescript
background: '#f2f2f2'      // Light gray background
tileBg: '#e8e8e8'          // Tile background
text: '#3d3d3d'            // Primary text
textMuted: '#adacb1'       // Muted/secondary text
white: '#ffffff'           // White
spotifyGreen: '#3FC56E'    // Spotify brand color
black: '#000000'           // Black
```

### Spacing
```typescript
containerPadding: 8px      // Main container padding
tilePaddingX: 40px         // Horizontal tile padding
tilePaddingY: 24px         // Vertical tile padding
tileGap: 8px               // Gap between tiles
tileRadius: 12px           // Tile border radius
spacerHeight: 19px         // Standard spacer height
headerHeight: 36px         // Header height
footerHeight: 60px         // Footer height
pillRadius: 20px           // Pill/badge border radius
pillPaddingX: 8px          // Pill horizontal padding
pillPaddingY: 10px         // Pill vertical padding
```

### Typography
```typescript
fonts: {
  logo: 'Monofett'         // Display font for branding
  code: 'Fira Code'        // Technical/code font
  mono: 'Fira Mono'        // Monospace font
  body: 'Montserrat'       // Body text font
}

sizes: {
  logo: 24px               // Logo text size
  heading: 16px            // Heading size
  subheading: 15px         // Subheading size
  body: 14px               // Body text size
  small: 10px              // Small text size
}
```

### Tile Sizes
```typescript
large: {
  height: 484px,
  minHeight: 480px
}
small: {
  height: 343px,
  minHeight: 340px
}
```

### Breakpoints
```typescript
mobile: 768px
tablet: 1024px
desktop: 1440px
```

## Component Architecture

### Layout Components

#### Header (`Header.tsx`)
- Displays name (Inga) in logo font
- Shows title/role in center (currently commented out)
- Location badge on right with 📍 emoji
- Uses pill-style badges with rounded corners

#### Footer (`Footer.tsx`)
- Left side: Name badge + copyright text
- Right side: Tagline badge
- Fixed height of 60px

#### Spacer (`Spacer.tsx`)
- Utility component for consistent vertical spacing
- Height: 19px

### Portfolio Components

#### ProjectGrid (`ProjectGrid.tsx`)
- Main container for 3-column layout
- Integrates SpotifyWidget in column 3
- Uses flexbox with wrap
- Gap: 8px between columns

#### ProjectColumn (`ProjectColumn.tsx`)
- Wraps individual project tiles
- Accepts children for additional widgets
- Vertical layout with gaps

#### ProjectTile (`ProjectTile.tsx`)
- Individual project showcase card
- Two sizes: large (484px) and small (343px)
- Optional header text at top
- Image centered with Next.js Image optimization
- Clickable with hover opacity transition
- Minimum width: 460px
- Rounded corners (12px)

### Widget Components

#### SpotifyWidget (`SpotifyWidget.tsx`)
- Displays "Now Playing" information
- Album art, artist, and track details
- Integration ready for Spotify API

#### MusicPlayer (`MusicPlayer.tsx`)
- Music playback controls UI
- Time display (current/remaining)
- Player interface

#### TrackList (`TrackList.tsx`)
- Displays list of tracks
- Track duration display

## Data Structure

### Projects (`projects.ts`)
The app showcases 8 projects organized in 3 columns:

**Column 1:**
1. Designing for Scale (large)
2. NY Philharmonic (small)
3. Robert Half iOS App (large)

**Column 2:**
1. 7-Eleven AI Experiences (small) - with header
2. Building New Infrastructure (large)
3. Bajaj Pulsar N160 (small)
4. Robert Half Android App (large)

**Column 3:**
1. Mobile Application (large)
2. Dashboard View (small)
3. Spotify Widget (integrated)

### Project Type Definition
```typescript
interface Project {
  id: string              // Unique identifier
  size: 'large' | 'small' // Tile size
  imageUrl: string        // Path to image in /public/images
  imageAlt: string        // Accessibility text
  url: string             // External link or #
  header?: string         // Optional header text
  category?: string       // Optional category (not currently used)
}
```

### Music/Track Types
```typescript
interface Track {
  id: number
  title: string
  duration: string
}

interface NowPlaying {
  albumName: string
  artistName: string
  albumArt: string
  currentTime: string
  remainingTime: string
  tracks: Track[]
  gradientColor: string
}
```

## Configuration & Setup

### NPM Scripts
```bash
npm run dev              # Start Next.js dev server on port 3001
npm run build            # Build for production
npm run start            # Start production server
npm run supabase:start   # Start local Supabase
npm run supabase:stop    # Stop local Supabase
npm run sanity:dev       # Start Sanity Studio
npm run studio           # Alternative Sanity Studio command
```

### Docker Services
- **PostgreSQL**: Port 5432 (Supabase database)
- **Supabase Studio**: Port 3000 (Database management UI)
- **Redis**: Port 6379 (Optional caching)

### Environment Variables
The app uses `.env` file (not tracked in git) for:
- Supabase credentials
- API keys
- Other sensitive configuration

### TypeScript Configuration
- Target: ES5
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- JSX: preserve (Next.js handles transformation)

## Current State & Implementation

### ✅ Implemented
- Complete responsive layout structure
- Header with name, title, location
- Footer with branding and copyright
- 3-column project grid with 8 projects
- Project tiles (large and small variants)
- Image optimization with Next.js Image
- Spotify widget UI components
- Custom font integration (4 fonts)
- Design system with constants
- TypeScript type safety
- Tailwind CSS styling
- Docker-based local infrastructure

### 🚧 Partially Implemented
- **Spotify Integration**: UI exists, but API integration not complete
- **Sanity CMS**: Dependency installed, but not integrated
- **Supabase**: Infrastructure setup, but no active database queries
- **Anthropic AI**: SDK installed, purpose not yet defined
- **GSAP Animations**: Library installed, animations not implemented

### ❌ Not Implemented
- API routes (empty api directory)
- Dynamic content loading from Supabase
- CMS integration with Sanity
- Active Spotify API connection
- Animations and interactions (GSAP)
- Mobile responsive optimizations
- Project detail pages
- Contact/about pages
- SEO optimization beyond basic metadata
- Analytics integration
- Performance monitoring

## Known Issues & Considerations

1. **Static Data**: All project data is hardcoded in `projects.ts`
2. **No Dynamic Routes**: Single homepage only, no individual project pages
3. **Spotify Widget**: UI-only, no real-time data
4. **Image Assets**: 11 project images in /public/images
5. **Min Width**: Project tiles have min-width: 460px (may affect mobile)
6. **Commented Code**: Title field in Header is commented out on homepage
7. **Empty Directories**: api/ directory exists but unused
8. **Git Status**: Multiple untracked files (.env, .next/, .cursor/, etc.)

## Design Patterns & Conventions

### File Organization
- Components organized by function (layout/portfolio/widgets)
- Data separated from components
- Types centralized in single file
- Constants for all design tokens
- CSS modules approach with globals.css

### Naming Conventions
- PascalCase for components: `ProjectTile.tsx`
- camelCase for functions and variables: `nowPlaying`
- kebab-case for CSS classes: `project-tile`
- SCREAMING_SNAKE_CASE for constants: `TILE_SIZES`

### Component Style
- Functional components with TypeScript
- Props destructuring in parameters
- Inline styles for dynamic values from constants
- Tailwind classes for static styling
- No prop drilling (yet) - could benefit from context

### Type Safety
- Strict TypeScript configuration
- Explicit interface definitions
- Type imports from centralized types file
- No `any` types used

## Future Considerations

### Recommended Next Steps
1. Connect Supabase for dynamic project data
2. Implement Spotify API for real music playback
3. Add project detail pages with routing
4. Implement GSAP animations on scroll/hover
5. Mobile responsive optimizations
6. Add CMS integration with Sanity
7. Create admin panel for project management
8. Add analytics and monitoring
9. Performance optimization (lazy loading, etc.)
10. SEO enhancements and metadata

### Potential Integrations
- **Spotify API**: Real-time now playing data
- **Sanity CMS**: Dynamic content management
- **Anthropic AI**: AI-powered features (chatbot, recommendations)
- **Analytics**: Google Analytics or Vercel Analytics
- **Image CDN**: Cloudinary or Vercel Image Optimization

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3001
```

### With Supabase
```bash
# Start Supabase locally
npm run supabase:start

# Access Supabase Studio at http://localhost:3000
```

### Production Build
```bash
# Build application
npm run build

# Start production server
npm run start
```

## Dependencies Summary

### Production Dependencies (9)
- @anthropic-ai/sdk: AI capabilities
- @sanity/client: CMS client
- @supabase/supabase-js: Database client
- gsap: Animation library
- next: Framework
- next-sanity: Sanity integration
- react: UI library
- react-dom: React DOM rendering

### Dev Dependencies (6)
- @types/node: Node.js types
- @types/react: React types
- autoprefixer: CSS processing
- postcss: CSS transformation
- tailwindcss: Utility CSS
- typescript: Type checking

---

**Last Updated**: February 14, 2026
**Version**: 0.1.0
**Status**: Active Development
