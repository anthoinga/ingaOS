# Portfolio Deployment Guide
## Supabase + Vercel + Porkbun Custom Domain

This guide covers deploying your Next.js portfolio with Supabase backend integration and a custom Porkbun domain.

---

## Architecture Overview

**Recommended Setup:**
- **Frontend Hosting**: Vercel (optimal for Next.js)
- **Backend Services**: Supabase (database, auth, storage if needed)
- **Domain**: Porkbun custom domain
- **CDN**: Cloudflare (optional, for additional performance)

---

## Part 1: Prepare Your Project

### 1.1 Environment Variables Setup

Create `.env.production` file:
```bash
# Spotify API (optional - if keeping widget)
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token

# Supabase (if using backend features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 1.2 Update next.config.js

Ensure your config is production-ready:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
  // Add if using external APIs
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.external-service.com/:path*',
      },
    ];
  },
};
```

### 1.3 Build Test
```bash
npm run build
npm start
```
Test locally at http://localhost:3000 to ensure production build works.

---

## Part 2: Supabase Setup (Optional Backend)

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in details:
   - **Name**: `portfolio-backend`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Wait 2-3 minutes for setup

### 2.2 Get API Credentials

From your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...`

### 2.3 Optional: Setup Database (if storing data)

```sql
-- Example: Create a contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy (adjust as needed)
CREATE POLICY "Enable insert for all users"
ON contact_submissions FOR INSERT
WITH CHECK (true);
```

---

## Part 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from `.env.production`
6. Click "Deploy"

### 3.3 Verify Deployment

Your site will be live at:
- `https://your-project.vercel.app`
- Test all features
- Check browser console for errors

---

## Part 4: Connect Porkbun Domain

### 4.1 Get Vercel DNS Records

From Vercel dashboard:
1. Go to your project
2. Click **Settings** → **Domains**
3. Click "Add Domain"
4. Enter your custom domain: `yourdomain.com`
5. Vercel will show DNS records to add:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 4.2 Configure Porkbun DNS

1. Log into [Porkbun](https://porkbun.com)
2. Go to "Domain Management"
3. Click your domain
4. Navigate to "DNS Records"
5. Delete any existing A and CNAME records for @ and www
6. Add Vercel's records:

   **Record 1 (Root domain):**
   - Type: `A`
   - Host: `@` (or leave blank)
   - Answer: `76.76.21.21`
   - TTL: `600`

   **Record 2 (WWW subdomain):**
   - Type: `CNAME`
   - Host: `www`
   - Answer: `cname.vercel-dns.com`
   - TTL: `600`

7. Click "Save" or "Update DNS"

### 4.3 Enable SSL in Vercel

1. Back in Vercel, verify domain ownership
2. Vercel automatically provisions SSL certificate (takes ~1 hour)
3. Once verified, your site will be accessible at:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

### 4.4 DNS Propagation Wait

- DNS changes take 15 minutes to 48 hours
- Check status: [whatsmydns.net](https://whatsmydns.net)
- Test your domain periodically

---

## Part 5: Optional Optimizations

### 5.1 Add Cloudflare (Optional CDN)

**Benefits:**
- Faster global delivery
- DDoS protection
- Additional caching

**Setup:**
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update Porkbun nameservers to Cloudflare's
4. Enable proxy (orange cloud) for your records
5. Configure:
   - SSL/TLS: Full (strict)
   - Speed → Optimization: Enable Auto Minify
   - Caching → Configuration: Standard

### 5.2 Performance Checklist

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://yourdomain.com --view

# Check bundle size
npm run build
# Look for large chunks

# Analyze bundle
npm install -D @next/bundle-analyzer
```

### 5.3 Analytics Setup

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Part 6: CI/CD & Monitoring

### 6.1 Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **main branch** → Production
- **other branches** → Preview deployments

### 6.2 Environment-Specific Configs

In Vercel dashboard:
- **Production**: Add prod environment variables
- **Preview**: Add preview/staging variables
- **Development**: Keep local `.env.local`

### 6.3 Monitoring

**Set up alerts:**
1. Vercel: Deployment notifications
2. Supabase: Database usage alerts
3. Uptime monitoring: [UptimeRobot](https://uptimerobot.com) (free)

---

## Part 7: Post-Deployment Tasks

### 7.1 Update Package.json

Add deployment scripts:
```json
{
  "scripts": {
    "deploy:preview": "vercel",
    "deploy:prod": "vercel --prod",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### 7.2 Create robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### 7.3 Add Sitemap (Optional)

```bash
npm install next-sitemap
```

Create `next-sitemap.config.js`:
```javascript
module.exports = {
  siteUrl: 'https://yourdomain.com',
  generateRobotsTxt: true,
};
```

Add to `package.json`:
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

---

## Troubleshooting

### Issue: Domain Not Resolving

**Check:**
```bash
# Check DNS propagation
nslookup yourdomain.com

# Check CNAME
nslookup www.yourdomain.com
```

**Solution:**
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records in Porkbun match Vercel's requirements
- Clear browser cache and try incognito mode

### Issue: SSL Certificate Error

**Solution:**
- Wait for SSL certificate provisioning (up to 1 hour)
- Verify domain ownership in Vercel
- Check Cloudflare SSL mode if using (should be "Full (strict)")

### Issue: Build Failing on Vercel

**Check:**
- Build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Environment variables are set correctly
- No hardcoded localhost URLs

### Issue: 404 on Dynamic Routes

**Solution:**
- Ensure `output: 'standalone'` is NOT set (for dynamic routes)
- Check `next.config.js` for correct configuration
- Verify API routes are in `/app/api/` directory

---

## Cost Breakdown

### Free Tier Limits:
- **Vercel**:
  - 100GB bandwidth/month
  - Unlimited personal projects
  - Automatic SSL

- **Supabase**:
  - 500MB database
  - 1GB file storage
  - 50,000 monthly active users

- **Porkbun**:
  - Domain: ~$10-15/year (already purchased)
  - Free WHOIS privacy
  - Free SSL certificates

### Upgrade Costs (if needed):
- **Vercel Pro**: $20/month (1TB bandwidth, priority support)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Production build test
npm run build && npm start

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# Set environment variable
vercel env add VARIABLE_NAME production
```

---

## Checklist Before Going Live

- [ ] All images optimized (use WebP format)
- [ ] Environment variables set in Vercel
- [ ] Build succeeds locally
- [ ] All features tested in production build
- [ ] DNS records configured in Porkbun
- [ ] SSL certificate issued
- [ ] Analytics setup (optional)
- [ ] Monitoring configured
- [ ] robots.txt and sitemap added
- [ ] Meta tags and SEO optimized
- [ ] 404 page customized
- [ ] Loading states for async content
- [ ] Error boundaries implemented
- [ ] Mobile responsiveness tested

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Porkbun Support**: https://porkbun.com/support
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Timeline

- **Project Preparation**: 30 minutes
- **Supabase Setup**: 15 minutes (if needed)
- **Vercel Deployment**: 10 minutes
- **DNS Configuration**: 15 minutes
- **DNS Propagation**: 15 minutes - 48 hours
- **SSL Certificate**: Automatic (up to 1 hour)
- **Testing & Verification**: 30 minutes

**Total**: ~2 hours (+ DNS propagation time)

---

Good luck with your deployment! 🚀
