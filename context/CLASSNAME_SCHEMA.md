# ClassName Naming Schema - Complete Inventory

> A comprehensive reference guide for all className conventions used in the portfolio app.

**Last Updated:** February 14, 2026
**Version:** 1.0

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Naming Patterns](#naming-patterns)
3. [Component Inventory](#component-inventory)
4. [Common Patterns Reference](#common-patterns-reference)
5. [Usage Guidelines](#usage-guidelines)
6. [Examples](#examples)

---

## Core Principles

### 1. Simplicity First
- Use short, clear names
- Avoid redundant prefixes
- Single words when possible, hyphenated when needed

### 2. Semantic Over Descriptive
```diff
❌ Bad:  className="bigRedButton"
✅ Good: className="primary-button"

❌ Bad:  className="projectTileImageArea"
✅ Good: className="image-container"
```

### 3. Component-Scoped
- ClassNames are scoped within their component
- No need to prefix with component name
- Parent context provides scope

```tsx
// ❌ Bad - Redundant prefix
<header className="headerRoot">
  <div className="headerNamePill">...</div>
</header>

// ✅ Good - Simple and scoped
<header>
  <div className="name-badge">...</div>
</header>
```

### 4. Consistency Across Components
- Reuse common names for similar elements
- `name-badge` in both Header and Footer
- `content` for main content areas
- `grid` for grid layouts

---

## Naming Patterns

### Pattern Categories

#### 1. Structural Elements
Elements that define layout and structure:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `wrapper` | Outer container | `<div className="wrapper">` |
| `container` | Content container | `<div className="container">` |
| `content` | Main content area | `<div className="content">` |
| `body` | Body section | `<div className="body">` |
| `section` | Distinct section | `<section className="section">` |

#### 2. Layout Components
Grid and layout-related elements:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `grid` | Grid container | `<div className="grid">` |
| `column` | Grid column | `<div className="column">` |
| `row` | Grid row | `<div className="row">` |
| `sidebar` | Side panel | `<aside className="sidebar">` |

#### 3. UI Elements
Visual interface components:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `badge` | Small label/badge | `<span className="badge">` |
| `pill` | Rounded badge | `<span className="pill">` |
| `card` | Card component | `<div className="card">` |
| `tile` | Tile/grid item | `<div className="tile">` |
| `panel` | Panel component | `<div className="panel">` |
| `button` | Button element | `<button className="button">` |
| `link` | Link element | `<a className="link">` |

#### 4. Content Areas
Specific content sections:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `header` | Header section | `<div className="header">` |
| `footer` | Footer section | `<div className="footer">` |
| `title` | Title element | `<div className="title">` |
| `subtitle` | Subtitle element | `<div className="subtitle">` |
| `text` | Text content | `<p className="text">` |
| `info` | Information group | `<div className="info">` |
| `meta` | Metadata | `<div className="meta">` |

#### 5. Media Elements
Image, video, and media containers:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `image-container` | Image wrapper | `<div className="image-container">` |
| `image-wrapper` | Image holder | `<div className="image-wrapper">` |
| `media` | Media element | `<div className="media">` |
| `thumbnail` | Thumbnail image | `<img className="thumbnail">` |
| `avatar` | User avatar | `<img className="avatar">` |

#### 6. Interactive Elements
User interaction components:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `button` | Generic button | `<button className="button">` |
| `link` | Generic link | `<a className="link">` |
| `input` | Form input | `<input className="input">` |
| `select` | Select dropdown | `<select className="select">` |
| `checkbox` | Checkbox input | `<input className="checkbox">` |
| `toggle` | Toggle switch | `<button className="toggle">` |

#### 7. State Modifiers
State-based class additions:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `active` | Active state | `className="tab active"` |
| `disabled` | Disabled state | `className="button disabled"` |
| `selected` | Selected state | `className="item selected"` |
| `hidden` | Hidden state | `className="panel hidden"` |
| `visible` | Visible state | `className="menu visible"` |
| `loading` | Loading state | `className="card loading"` |
| `error` | Error state | `className="input error"` |

#### 8. Positional Elements
Position-specific elements:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `left` | Left-aligned element | `<div className="left">` |
| `right` | Right-aligned element | `<div className="right">` |
| `top` | Top element | `<div className="top">` |
| `bottom` | Bottom element | `<div className="bottom">` |
| `center` | Centered element | `<div className="center">` |

---

## Component Inventory

### Layout Components

#### Header Component (`src/app/components/layout/Header.tsx`)

```tsx
<header>                    // Root element (no className)
  <div className="name-badge">
    <h1>...</h1>
  </div>
  <div className="title">
    <p>...</p>
  </div>
  <div className="location">
    <p>...</p>
  </div>
</header>
```

**ClassNames Used:**
- `name-badge` - Name display badge/pill
- `title` - Title/role text container
- `location` - Location badge with emoji

**Purpose:** Top navigation and branding

---

#### Footer Component (`src/app/components/layout/Footer.tsx`)

```tsx
<footer>                    // Root element (no className)
  <div className="info">
    <div className="name-badge">
      <span>...</span>
    </div>
    <p>...</p>
  </div>
  <div className="tagline">
    <p>...</p>
  </div>
</footer>
```

**ClassNames Used:**
- `info` - Information group (name + copyright)
- `name-badge` - Name display badge/pill
- `tagline` - Tagline badge

**Purpose:** Footer branding and copyright

---

#### Spacer Component (`src/app/components/layout/Spacer.tsx`)

```tsx
<div className="shrink-0 w-full" />
```

**ClassNames Used:**
- Utility classes only (no custom classes)

**Purpose:** Consistent vertical spacing

---

### Portfolio Components

#### ProjectGrid Component (`src/app/components/portfolio/ProjectGrid.tsx`)

```tsx
<div className="grid">
  <ProjectColumn />
  <ProjectColumn />
  <ProjectColumn />
</div>
```

**ClassNames Used:**
- `grid` - Main grid container

**Purpose:** Container for project columns (3-column layout)

---

#### ProjectColumn Component (`src/app/components/portfolio/ProjectColumn.tsx`)

```tsx
<div className="column">
  {projects.map(...)}
  {children}
</div>
```

**ClassNames Used:**
- `column` - Grid column container

**Purpose:** Single column in the grid

---

#### ProjectTile Component (`src/app/components/portfolio/ProjectTile.tsx`)

```tsx
<a className="tile">
  <div className="content">
    <div className="tile-header">
      <p>...</p>
    </div>
    <div className="image-container">
      <div className="image-wrapper">
        <Image />
      </div>
    </div>
  </div>
</a>
```

**ClassNames Used:**
- `tile` - Individual project tile (clickable)
- `content` - Tile content area
- `tile-header` - Optional header text
- `image-container` - Image display area (flex container)
- `image-wrapper` - Image wrapper (for Next.js Image)

**Purpose:** Display individual project with image and optional header

---

### Widget Components

#### SpotifyWidget Component (`src/app/components/widgets/SpotifyWidget.tsx`)

```tsx
// Uses utility classes only
<div className="relative w-full shrink-0">
  <div className="absolute ...">
    // Content
  </div>
</div>
```

**ClassNames Used:**
- Utility classes only (no custom semantic classes)

**Purpose:** Display Spotify "Now Playing" information

---

#### MusicPlayer Component (`src/app/components/widgets/MusicPlayer.tsx`)

```tsx
// Uses utility classes only
<div className="h-20 relative w-full shrink-0">
  <div className="absolute left-0 top-0 w-20 h-20">
    // Album art
  </div>
  <div className="absolute left-20 right-0 top-0 h-20">
    // Player controls
  </div>
</div>
```

**ClassNames Used:**
- Utility classes only (no custom semantic classes)

**Purpose:** Music player controls and display

---

#### TrackList Component (`src/app/components/widgets/TrackList.tsx`)

```tsx
// Uses utility classes only
<div className="flex flex-col gap-2 pt-2">
  {tracks.map(...)}
</div>
```

**ClassNames Used:**
- Utility classes only (no custom semantic classes)

**Purpose:** List of music tracks

---

### Page Components

#### Root Layout (`src/app/layout.tsx`)

```tsx
<html lang="en">
  <body>              // No className needed
    {children}
  </body>
</html>
```

**ClassNames Used:**
- None (removed `appRoot`)

**Purpose:** Root application wrapper

---

#### Home Page (`src/app/page.tsx`)

```tsx
<div>                 // No className needed
  <Header />
  <ProjectGrid />
  <Footer />
</div>
```

**ClassNames Used:**
- None (removed `pageLayout`)
- Uses inline styles for layout

**Purpose:** Main homepage

---

## Common Patterns Reference

### Badge/Pill Pattern
Used for small, rounded UI elements containing text or icons.

```tsx
// Header and Footer
<div className="name-badge">
  <span className="font-logo ...">Name</span>
</div>

<div className="location">
  <p className="font-code ...">📍 Location</p>
</div>
```

**When to use:**
- Small information display
- Rounded corners with padding
- Badges, tags, pills
- Status indicators

**Naming convention:**
- `[content]-badge` - For badge-like elements
- `[content]` - Simple descriptor if badge is implied

---

### Container Pattern
Used for wrapping content with structure.

```tsx
// Nested containers
<div className="tile">
  <div className="content">
    <div className="image-container">
      <div className="image-wrapper">
        <Image />
      </div>
    </div>
  </div>
</div>
```

**Hierarchy:**
1. `tile` - Outermost element (the clickable item)
2. `content` - Main content area
3. `image-container` - Specific content section (flex positioning)
4. `image-wrapper` - Direct image parent (sizing/positioning)

**When to use:**
- Multiple levels of nesting needed
- Different styling/layout at each level
- Separation of concerns (structure vs. content vs. presentation)

---

### Grid Pattern
Used for grid-based layouts.

```tsx
<div className="grid">
  <div className="column">
    <div className="tile">...</div>
    <div className="tile">...</div>
  </div>
  <div className="column">
    <div className="tile">...</div>
  </div>
</div>
```

**When to use:**
- Multi-column layouts
- Responsive grids
- Tile/card displays

**Naming convention:**
- `grid` - Container
- `column` - Column wrapper
- `row` - Row wrapper (if needed)
- `tile`/`card` - Individual items

---

### Information Group Pattern
Used for grouping related information.

```tsx
// Footer
<div className="info">
  <div className="name-badge">...</div>
  <p>Copyright text</p>
</div>
```

**When to use:**
- Multiple related pieces of information
- Need to group for layout purposes
- Semantic grouping of content

**Naming convention:**
- `info` - General information group
- `meta` - Metadata group
- `details` - Detailed information
- `stats` - Statistics group

---

## Usage Guidelines

### Do's ✅

1. **Use simple, single words when possible**
   ```tsx
   <div className="grid">
   <div className="column">
   <div className="content">
   ```

2. **Use hyphens for compound names**
   ```tsx
   <div className="name-badge">
   <div className="image-container">
   <div className="tile-header">
   ```

3. **Reuse common patterns across components**
   ```tsx
   // Both Header and Footer use "name-badge"
   <div className="name-badge">
   ```

4. **Keep names semantic and purpose-driven**
   ```tsx
   <div className="location">    // What it contains
   <div className="tagline">     // What it represents
   ```

5. **Remove unnecessary root classes**
   ```tsx
   // ✅ Good
   <header>
   <footer>
   <body>
   ```

### Don'ts ❌

1. **Don't prefix with component name**
   ```tsx
   ❌ <div className="headerNamePill">
   ✅ <div className="name-badge">

   ❌ <div className="projectTileImageArea">
   ✅ <div className="image-container">
   ```

2. **Don't use overly descriptive names**
   ```tsx
   ❌ <div className="roundedBadgeWithPadding">
   ✅ <div className="badge">

   ❌ <div className="largeProjectImageWrapper">
   ✅ <div className="image-wrapper">
   ```

3. **Don't duplicate context**
   ```tsx
   ❌ <header className="headerRoot">
   ✅ <header>

   ❌ <footer className="footerRoot">
   ✅ <footer>
   ```

4. **Don't use camelCase**
   ```tsx
   ❌ className="nameBadge"
   ✅ className="name-badge"
   ```

5. **Don't create one-off names for similar elements**
   ```tsx
   ❌ <div className="user-name-pill">    // In Header
   ❌ <div className="footer-name-badge"> // In Footer
   ✅ <div className="name-badge">        // In both
   ```

---

## Examples

### Adding a New Component

When creating a new component, follow these steps:

#### 1. Identify the component type
- Is it a layout component? (header, sidebar, panel)
- Is it a content component? (card, tile, article)
- Is it an interactive component? (button, link, form)

#### 2. Use existing patterns when possible

```tsx
// New BlogCard component
export function BlogCard({ title, excerpt, image }: BlogCardProps) {
  return (
    <article className="card">
      <div className="content">
        <div className="image-container">
          <img src={image} alt={title} />
        </div>
        <div className="text">
          <h3 className="title">{title}</h3>
          <p>{excerpt}</p>
        </div>
      </div>
    </article>
  );
}
```

**ClassNames chosen:**
- `card` - Similar to `tile`, but for blog content
- `content` - Consistent with other components
- `image-container` - Reused from ProjectTile
- `text` - Common pattern for text content
- `title` - Reused from Header pattern

#### 3. Add new patterns only when necessary

```tsx
// New UserProfile component with unique needs
export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="profile">
      <div className="avatar">
        <img src={user.image} alt={user.name} />
      </div>
      <div className="bio">
        <h2 className="name">{user.name}</h2>
        <p className="role">{user.role}</p>
        <div className="stats">
          <span>{user.followers} followers</span>
        </div>
      </div>
    </div>
  );
}
```

**New patterns introduced:**
- `profile` - New root element for user profiles
- `avatar` - Specific to user images (different from `image-container`)
- `bio` - Biographical information section
- `stats` - Statistics display (new pattern)

---

### Refactoring Existing Code

**Before:**
```tsx
<div className="userProfileContainer">
  <div className="userProfileImageWrapper">
    <img className="userProfileImage" />
  </div>
  <div className="userProfileInformation">
    <h2 className="userProfileName" />
    <p className="userProfileBio" />
  </div>
</div>
```

**After:**
```tsx
<div className="profile">
  <div className="avatar">
    <img />
  </div>
  <div className="info">
    <h2 className="name" />
    <p className="bio" />
  </div>
</div>
```

**Changes made:**
- Removed redundant `userProfile` prefix (40 characters → 31 characters, 23% reduction)
- Used semantic names: `profile`, `avatar`, `info`, `name`, `bio`
- More readable and maintainable

---

## Quick Reference Table

### Most Common ClassNames in This Project

| ClassName | Usage Count | Components | Purpose |
|-----------|-------------|------------|---------|
| `name-badge` | 2 | Header, Footer | Display name with logo font |
| `content` | 2 | ProjectTile, (future) | Main content area |
| `location` | 1 | Header | Location badge |
| `title` | 1 | Header | Title/role text |
| `tagline` | 1 | Footer | Footer tagline |
| `info` | 1 | Footer | Information group |
| `grid` | 1 | ProjectGrid | Grid container |
| `column` | 1 | ProjectColumn | Grid column |
| `tile` | 1 | ProjectTile | Project tile |
| `tile-header` | 1 | ProjectTile | Tile header text |
| `image-container` | 1 | ProjectTile | Image flex container |
| `image-wrapper` | 1 | ProjectTile | Image wrapper |

### Reserved for Future Use

Common patterns not yet implemented but reserved:

| ClassName | Reserved For | Example Use Case |
|-----------|--------------|------------------|
| `button` | Interactive buttons | Primary/secondary buttons |
| `link` | Styled links | Navigation links |
| `card` | Card components | Blog cards, content cards |
| `modal` | Modal dialogs | Popups, overlays |
| `nav` | Navigation | Navigation menus |
| `menu` | Menu components | Dropdown menus |
| `form` | Form elements | Contact forms |
| `input` | Form inputs | Text inputs |
| `alert` | Alert messages | Success/error messages |
| `badge` | Status badges | Notification badges |

---

## Version History

### v1.0 - February 14, 2026
- Initial naming schema documentation
- Refactored all existing components
- Established core principles and patterns
- Created comprehensive inventory

---

## Contributing

When adding new classNames:

1. Check this document first to reuse existing patterns
2. Follow the core principles
3. Update this document with new patterns
4. Keep names simple and semantic
5. Consider component scope and context

---

**Maintained by:** Development Team
**For questions:** Reference `CLASSNAME_REFACTOR.md` for the refactoring history
