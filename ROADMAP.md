# Portfolio App - Debugging & Feature Roadmap

> Last Updated: February 14, 2026

## Quick Reference

**Priority Levels:**
- 🔴 **Critical** - Blocks core functionality or user experience
- 🟡 **High** - Important for production readiness
- 🟢 **Medium** - Enhances experience but not blocking
- 🔵 **Low** - Nice to have, future consideration

**Status:**
- ⏳ Not Started
- 🚧 In Progress
- ✅ Complete
- ⏸️ Blocked/On Hold

---

## Phase 1: Foundation & Critical Fixes (Week 1-2)

### 🔴 Critical Issues

#### 1.1 Mobile Responsiveness - Min-width Issue
**Priority:** 🔴 Critical | **Status:** ⏳ Not Started | **Effort:** 2-4 hours

**Problem:**
- `ProjectTile` has `min-width: 460px` hardcoded
- Will break on mobile devices (< 768px)
- Grid layout not optimized for smaller screens

**Solution:**
```typescript
// Implement responsive breakpoints
- Remove fixed min-width from ProjectTile
- Add responsive grid columns (1 col mobile, 2 col tablet, 3 col desktop)
- Test on viewport sizes: 375px, 768px, 1024px, 1440px
- Adjust tile padding for mobile
```

**Files to Modify:**
- `src/app/components/portfolio/ProjectTile.tsx`
- `src/app/components/portfolio/ProjectGrid.tsx`
- `src/app/data/constants.ts` (add mobile breakpoint constants)

**Testing Required:**
- iPhone SE (375px)
- iPad (768px)
- Desktop (1440px)

---

#### 1.2 Git Repository Cleanup
**Priority:** 🔴 Critical | **Status:** ⏳ Not Started | **Effort:** 30 minutes

**Problem:**
- Multiple untracked files creating noise
- Sensitive `.env` file not properly gitignored
- `.cursor/` and `.next/` directories showing in status

**Solution:**
```bash
# Fix .gitignore
1. Verify .gitignore includes all necessary entries
2. Run: git rm --cached .env (if accidentally staged)
3. Add initial commit or clean up working tree
4. Document environment variables in .env.example
```

**Action Items:**
- [ ] Create `.env.example` with placeholder values
- [ ] Update `.gitignore` if needed
- [ ] Stage and commit all valid files
- [ ] Document setup process in README.md

---

#### 1.3 Missing README.md
**Priority:** 🔴 Critical | **Status:** ⏳ Not Started | **Effort:** 10 min

**Problem:**
- No README.md for project setup

**Solution:**
Create comprehensive README.md with:
- Project description

---

#### 1.4 Audit Component ClassNames 
**Priority:** 🟢 **Medium** | **Status:** ⏳ Not Started | **Effort:** 30 min

**Problem:**
- Audit ClassNames in all components. Recommend renaming using semantic naming scheme. simple and not overly contextual. Adjust code based on new naming scheme.

**Solution:**
Create comprehensive README.md with:
- Project description

---

## Phase 2: Core Features (Week 2-4)

### 🟡 High Priority Features

#### 2.1 Dynamic Project Data with Supabase
**Priority:** 🟡 High | **Status:** ⏳ Not Started | **Effort:** 1-2 days

**Current State:**
- Projects hardcoded in `projects.ts`
- No database queries active
- Supabase installed but unused

**Implementation Plan:**

1. **Database Schema Design:**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  size VARCHAR(10) CHECK (size IN ('large', 'small')),
  image_url TEXT NOT NULL,
  image_alt TEXT,
  external_url TEXT,
  header_text TEXT,
  category VARCHAR(100),
  column_number INTEGER CHECK (column_number BETWEEN 1 AND 3),
  order_position INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true
);

CREATE INDEX idx_projects_column ON projects(column_number, order_position);
CREATE INDEX idx_projects_published ON projects(is_published);
```

2. **API Layer:**
```typescript
// src/app/lib/supabase/client.ts
// Create Supabase client

// src/app/lib/supabase/queries.ts
// - fetchProjects()
// - fetchProjectsByColumn()
// - fetchProjectBySlug()
```

3. **Migration Path:**
```bash
# Step 1: Create migration in supabase/migrations/
# Step 2: Seed with existing project data
# Step 3: Update components to use dynamic data
# Step 4: Keep static data as fallback
```

**Files to Create:**
- `src/app/lib/supabase/client.ts`
- `src/app/lib/supabase/queries.ts`
- `src/app/lib/supabase/types.ts`
- `supabase/migrations/001_create_projects_table.sql`
- `supabase/migrations/002_seed_projects.sql`

**Files to Modify:**
- `src/app/components/portfolio/ProjectGrid.tsx` (async data fetching)
- `src/app/page.tsx` (add async/await)

**Dependencies:**
- Phase 1.2 complete (git cleanup)
- Supabase local instance running

---

#### 2.2 Project Detail Pages
**Priority:** 🟡 High | **Status:** ⏳ Not Started | **Effort:** 2-3 days

**Current State:**
- Only homepage exists
- All projects link to external URLs or #
- No internal routing

**Implementation Plan:**

1. **Route Structure:**
```
/                          → Homepage (grid)
/projects/[slug]          → Project detail page
/projects                 → Optional: All projects list
```

2. **Database Extension:**
```sql
ALTER TABLE projects ADD COLUMN description TEXT;
ALTER TABLE projects ADD COLUMN full_description TEXT;
ALTER TABLE projects ADD COLUMN tech_stack TEXT[];
ALTER TABLE projects ADD COLUMN project_date DATE;
ALTER TABLE projects ADD COLUMN role VARCHAR(100);
ALTER TABLE projects ADD COLUMN gallery_images TEXT[];
```

3. **Components to Build:**
```
src/app/projects/[slug]/page.tsx        → Project detail page
src/app/components/projects/
  ├── ProjectHero.tsx                   → Hero section with image
  ├── ProjectDetails.tsx                → Description and metadata
  ├── ProjectGallery.tsx                → Image gallery
  └── ProjectNavigation.tsx             → Prev/Next navigation
```

**Design Considerations:**
- Maintain design system consistency
- Add back button to homepage
- Image gallery with lightbox
- Related projects section
- Breadcrumb navigation

**Files to Create:**
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/loading.tsx`
- `src/app/projects/[slug]/not-found.tsx`
- Project detail components

---

#### 2.3 Spotify API Integration
**Priority:** 🟡 High | **Status:** ⏳ Not Started | **Effort:** 2-3 days

**Current State:**
- SpotifyWidget UI exists
- No real data connection
- Music data hardcoded in `music.ts`

**Implementation Plan:**

1. **Spotify Developer Setup:**
- [ ] Create Spotify Developer account
- [ ] Register application
- [ ] Get Client ID and Client Secret
- [ ] Set up OAuth redirect

2. **Backend API Routes:**
```typescript
// src/app/api/spotify/auth/route.ts
// Handle OAuth flow

// src/app/api/spotify/now-playing/route.ts
// Fetch currently playing track

// src/app/api/spotify/token/route.ts
// Refresh access token
```

3. **Environment Variables:**
```bash
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
SPOTIFY_REFRESH_TOKEN=xxx
```

4. **Frontend Integration:**
```typescript
// Update SpotifyWidget to fetch from API
// Add loading states
// Handle no track playing state
// Poll for updates (every 30 seconds)
```

**Alternative Approach:**
If personal "Now Playing" is the goal:
- Use Spotify's Web API with refresh token
- No user OAuth needed
- Simpler implementation
- Static user (your own account)

**Files to Create:**
- `src/app/api/spotify/now-playing/route.ts`
- `src/app/lib/spotify/client.ts`
- `src/app/lib/spotify/types.ts`

**Files to Modify:**
- `src/app/components/widgets/SpotifyWidget.tsx`
- `.env` (add Spotify credentials)

---

## Phase 3: Polish & Enhancement (Week 4-6)

### 🟢 Medium Priority

#### 3.1 GSAP Animations
**Priority:** 🟢 Medium | **Status:** ⏳ Not Started | **Effort:** 3-4 days

**Current State:**
- GSAP library installed but unused
- No animations on page

**Animation Opportunities:**

1. **Scroll Animations:**
```typescript
// Fade in project tiles on scroll
// Stagger animation for grid items
// Parallax effects on images
```

2. **Hover Effects:**
```typescript
// Project tile scale on hover
// Image zoom on hover
// Smooth color transitions
```

3. **Page Transitions:**
```typescript
// Fade in on page load
// Smooth navigation transitions
// Loading animations
```

**Implementation:**
```typescript
// src/app/lib/animations/
  ├── scrollAnimations.ts
  ├── hoverAnimations.ts
  └── pageTransitions.ts

// Use in components:
useGSAP(() => {
  gsap.from('.projectTile', {
    scrollTrigger: {
      trigger: '.projectGrid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
  });
});
```

**Performance Considerations:**
- Use `will-change` sparingly
- Optimize for 60fps
- Test on mobile devices
- Lazy load GSAP if needed

---

#### 3.2 Image Optimization & Management
**Priority:** 🟢 Medium | **Status:** ⏳ Not Started | **Effort:** 1-2 days

**Current Issues:**
- Images in `/public/images`
- No CDN integration
- Manual image management

**Solutions:**

**Option A: Vercel Image Optimization (Recommended)**
- Built-in with Next.js on Vercel
- Automatic format conversion (WebP)
- Responsive images
- No setup required

**Option B: Cloudinary Integration**
```typescript
// src/app/lib/cloudinary/config.ts
// Upload images to Cloudinary
// Use transformation URLs
// Automatic optimization
```

**Option C: Supabase Storage**
```typescript
// Store images in Supabase Storage
// Generate signed URLs
// Integrate with project data
```

**Recommendation:**
1. Immediate: Use Vercel (built-in)
2. Scale: Move to Cloudinary or Supabase Storage
3. Add image upload interface for CMS

---

#### 3.3 SEO Optimization
**Priority:** 🟢 Medium | **Status:** ⏳ Not Started | **Effort:** 1-2 days

**Current State:**
- Basic metadata only
- No Open Graph tags
- No structured data
- No sitemap

**Implementation Checklist:**

1. **Metadata Enhancement:**
```typescript
// src/app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Inga - Software Designer & Creative Technologist',
    template: '%s | Inga Portfolio'
  },
  description: 'Portfolio of Inga, software designer and creative technologist based in Texas. Showcasing AI experiences, infrastructure projects, and mobile applications.',
  keywords: ['software design', 'creative technologist', 'AI', 'UX'],
  authors: [{ name: 'Inga' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Inga Portfolio',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inga - Software Designer',
    description: 'Portfolio showcasing design and technology projects',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

2. **Structured Data:**
```typescript
// Add JSON-LD for Person schema
// Add JSON-LD for CreativeWork schema
```

3. **Sitemap Generation:**
```typescript
// src/app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://yourdomain.com', lastModified: new Date() },
    // Dynamic project URLs from database
  ];
}
```

4. **robots.txt:**
```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  };
}
```

**Files to Create:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `public/og-image.png`
- `public/twitter-image.png`

**Files to Modify:**
- `src/app/layout.tsx`
- `src/app/projects/[slug]/page.tsx` (dynamic metadata)

---

#### 3.4 Analytics Integration
**Priority:** 🟢 Medium | **Status:** ⏳ Not Started | **Effort:** 2-4 hours

**Options:**

**Option A: Vercel Analytics (Recommended for Vercel deployments)**
```bash
npm install @vercel/analytics
```
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

<body>
  {children}
  <Analytics />
</body>
```

**Option B: Google Analytics 4**
```bash
npm install @next/third-parties
```
```typescript
// src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

**Option C: Plausible Analytics (Privacy-focused)**
```typescript
// Add script tag or use plausible-tracker package
```

**Tracking Events:**
- Page views
- Project tile clicks
- External link clicks
- Spotify widget interactions
- Time on page

---

## Phase 4: Advanced Features (Week 6-10)

### 🔵 Low Priority / Future Considerations

#### 4.1 Sanity CMS Integration
**Priority:** 🔵 Low | **Status:** ⏳ Not Started | **Effort:** 1 week

**Current State:**
- Sanity client installed
- No studio setup
- Dependency on decision: Supabase vs Sanity

**Decision Required:**
Choose between:
1. **Supabase only** - Simpler, already set up
2. **Sanity CMS** - Better for content management, visual editor
3. **Hybrid** - Supabase for data, Sanity for blog/content

**If Implementing Sanity:**

1. **Setup Sanity Studio:**
```bash
cd sanity/
sanity init
sanity start
```

2. **Define Schemas:**
```typescript
// sanity/schemas/project.ts
export default {
  name: 'project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'image', type: 'image' },
    { name: 'description', type: 'text' },
    // ... more fields
  ]
};
```

3. **Frontend Integration:**
```typescript
// src/app/lib/sanity/client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});
```

**Recommendation:**
- Start with Supabase (simpler)
- Add Sanity later if content editing needs grow
- Consider if you need visual CMS features

---

#### 4.2 Anthropic AI Features
**Priority:** 🔵 Low | **Status:** ⏳ Not Started | **Effort:** 1-2 weeks

**Current State:**
- @anthropic-ai/sdk installed
- No clear use case defined

**Potential Use Cases:**

**Option A: Portfolio Chatbot**
```typescript
// AI assistant to answer questions about projects
// "Tell me about the 7-Eleven AI project"
// "What technologies does Inga work with?"
```

**Option B: Project Recommendations**
```typescript
// Suggest similar projects based on user interest
// Personalized project descriptions
```

**Option C: Content Generation**
```typescript
// Generate project descriptions
// SEO metadata generation
// Alt text for images
```

**Option D: Interactive Resume**
```typescript
// Chat-based resume exploration
// Answer interview questions
// Showcase AI capabilities
```

**Implementation Example (Chatbot):**
```typescript
// src/app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const { message } = await request.json();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: `You are a helpful assistant for Inga's portfolio...`,
    messages: [{ role: 'user', content: message }],
  });

  return Response.json(response);
}
```

**Decision Required:**
- Define primary use case
- Consider API costs
- Evaluate value vs complexity

---

#### 4.3 Blog/Writing Section
**Priority:** 🔵 Low | **Status:** ⏳ Not Started | **Effort:** 1 week

**Structure:**
```
/writing                   → Blog index
/writing/[slug]           → Individual post
```

**CMS Options:**
1. Sanity CMS (visual editor)
2. MDX files (markdown with React)
3. Supabase (database-driven)

**Features:**
- Article listing with pagination
- Categories and tags
- Reading time estimate
- Syntax highlighting for code
- Social sharing
- Comments (optional)

---

#### 4.4 Contact Form
**Priority:** 🔵 Low | **Status:** ⏳ Not Started | **Effort:** 1-2 days

**Implementation:**
```typescript
// src/app/contact/page.tsx
// Simple form with:
// - Name
// - Email
// - Message
// - Spam protection (Turnstile/reCAPTCHA)
```

**Backend Options:**
1. Email API (Resend, SendGrid)
2. Form service (Formspree, Basin)
3. Supabase function
4. API route with Nodemailer

---

#### 4.5 Dark Mode
**Priority:** 🔵 Low | **Status:** ⏳ Not Started | **Effort:** 2-3 days

**Implementation:**
```typescript
// Use next-themes
npm install next-themes

// Update constants.ts with dark mode colors
// Add theme toggle component
// Store preference in localStorage
```

**Design Considerations:**
- Update color palette for dark mode
- Ensure sufficient contrast
- Test all components
- Smooth transition animations

---

## Phase 5: Performance & Production (Week 10-12)

### Production Readiness Checklist

#### 5.1 Performance Optimization
**Priority:** 🟡 High | **Status:** ⏳ Not Started

- [ ] Lighthouse audit (target: 90+ all metrics)
- [ ] Lazy load images below the fold
- [ ] Code splitting for heavy components
- [ ] Bundle size analysis (`npm run build && analyze`)
- [ ] Optimize font loading (font-display: swap)
- [ ] Implement service worker/PWA (optional)
- [ ] Database query optimization
- [ ] Add Redis caching layer
- [ ] CDN for static assets

#### 5.2 Testing
**Priority:** 🟡 High | **Status:** ⏳ Not Started

**Setup Testing Framework:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

**Test Coverage Goals:**
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API routes
- E2E tests for critical flows (optional: Playwright)

**Files to Create:**
```
__tests__/
  ├── components/
  │   ├── ProjectTile.test.tsx
  │   ├── ProjectGrid.test.tsx
  │   └── SpotifyWidget.test.tsx
  ├── lib/
  │   └── supabase/queries.test.ts
  └── utils/
```

#### 5.3 Error Handling & Monitoring
**Priority:** 🟡 High | **Status:** ⏳ Not Started

**Error Boundaries:**
```typescript
// src/app/components/ErrorBoundary.tsx
// Catch and display errors gracefully
```

**Monitoring Options:**
1. **Sentry** - Error tracking
2. **LogRocket** - Session replay
3. **Vercel Analytics** - Performance monitoring

**Implementation:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

#### 5.4 Security Audit
**Priority:** 🟡 High | **Status:** ⏳ Not Started

**Checklist:**
- [ ] Environment variables secure (never in client code)
- [ ] API rate limiting
- [ ] CORS configuration
- [ ] Content Security Policy headers
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (React default + validation)
- [ ] Authentication tokens secure (httpOnly cookies)
- [ ] Dependency vulnerability scan (`npm audit`)
- [ ] Supabase RLS policies configured

#### 5.5 Deployment Preparation
**Priority:** 🟡 High | **Status:** ⏳ Not Started

**Vercel Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

**Environment Variables to Set:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `ANTHROPIC_API_KEY` (if using)

**Post-Deployment:**
- [ ] Custom domain setup
- [ ] SSL certificate (automatic with Vercel)
- [ ] Supabase production database migration
- [ ] Update CORS origins in Supabase
- [ ] Set up monitoring alerts
- [ ] Configure automatic deployments (git push)

---

## Quick Wins (Can Do Anytime)

These tasks provide immediate value with minimal effort:

### QW1: Add Loading States (2 hours)
```typescript
// Add skeleton loaders for project tiles
// Loading spinner for Spotify widget
// Suspense boundaries
```

### QW2: 404 Page (1 hour)
```typescript
// src/app/not-found.tsx
// Custom 404 page with navigation back
```

### QW3: Favicon & Meta Images (30 mins)
```bash
# Create and add:
# - favicon.ico
# - apple-touch-icon.png
# - og-image.png
```

### QW4: Console Cleanup (30 mins)
```typescript
// Remove console.logs
// Add error boundaries
// Clean up warnings
```

### QW5: TypeScript Strict Mode (2 hours)
```typescript
// Fix any remaining type issues
// Remove any 'any' types
// Ensure full type coverage
```

### QW6: Accessibility Audit (2-3 hours)
```typescript
// Add aria-labels where needed
// Ensure keyboard navigation
// Test with screen reader
// Add skip navigation link
// Check color contrast ratios
```

---

## Dependencies & Blockers

### Critical Path
```
1. Mobile Responsiveness (1.1)
   ↓
2. Git Cleanup (1.2) + README (1.3)
   ↓
3. Supabase Integration (2.1)
   ↓
4. Project Detail Pages (2.2)
   ↓
5. Production Deployment (5.5)
```

### Parallel Tracks
- **Design Track:** GSAP Animations (3.1) + Dark Mode (4.5)
- **Content Track:** Spotify API (2.3) + SEO (3.3)
- **Infrastructure Track:** Analytics (3.4) + Monitoring (5.3)

### Decision Dependencies
- **Sanity vs Supabase:** Decide before starting 4.1
- **AI Use Case:** Define before starting 4.2
- **Image Strategy:** Choose before scaling (3.2)

---

## Estimated Timeline

### Minimal Viable Production (4-6 weeks)
- Phase 1: Foundation fixes (1-2 weeks)
- Phase 2: Core features (2-3 weeks)
- Phase 5: Production readiness (1 week)

### Full Feature Set (10-12 weeks)
- All phases complete
- Including AI features and CMS
- Full test coverage
- Performance optimized

### Quick Production Path (2 weeks)
- Mobile fixes only (1.1)
- Skip dynamic data (keep static)
- Basic SEO (3.3)
- Deploy as-is with Polish

---

## Priority Matrix

```
High Impact, Low Effort (DO FIRST):
- Mobile responsiveness (1.1)
- Git cleanup (1.2)
- README (1.3)
- SEO basics (3.3)
- Quick wins

High Impact, High Effort (PLAN CAREFULLY):
- Supabase integration (2.1)
- Project detail pages (2.2)
- Spotify API (2.3)
- Performance optimization (5.1)

Low Impact, Low Effort (FILL TIME):
- 404 page (QW2)
- Favicon (QW3)
- Console cleanup (QW4)
- Accessibility (QW6)

Low Impact, High Effort (DEPRIORITIZE):
- Sanity CMS (4.1) - unless content editing is crucial
- AI features (4.2) - unless it's a key differentiator
- Blog section (4.3) - unless content strategy is ready
```

---

## Metrics & Success Criteria

### Performance Targets
- **Lighthouse Score:** 90+ (all metrics)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Cumulative Layout Shift:** < 0.1
- **Bundle Size:** < 200KB (initial JS)

### SEO Targets
- **Google PageSpeed:** 90+ mobile/desktop
- **Core Web Vitals:** All green
- **Indexed Pages:** 100% within 1 week
- **Mobile Friendly:** Pass Google test

### User Experience
- **Zero 404 errors** on internal links
- **100% keyboard accessible**
- **WCAG AA compliance**
- **Mobile responsive** 100%
- **Cross-browser tested** (Chrome, Safari, Firefox)

---

## Next Steps

### Immediate Actions (Today)
1. Fix mobile responsiveness (1.1)
2. Clean up git repository (1.2)
3. Create README.md (1.3)

### This Week
1. Complete Phase 1 (Foundation)
2. Start Supabase integration (2.1)
3. Set up analytics (3.4)

### This Month
1. Complete Phase 2 (Core Features)
2. Start Phase 3 (Polish)
3. Begin SEO work (3.3)

### Decision Points
- [ ] **Week 2:** Decide on Sanity vs Supabase only
- [ ] **Week 3:** Decide on AI feature use case
- [ ] **Week 4:** Decide on deployment timeline
- [ ] **Week 6:** Decide on blog/content strategy

---

**Document Version:** 1.0
**Last Updated:** February 14, 2026
**Owner:** Development Team
