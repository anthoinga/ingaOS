# Pre-Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Vercel account created (sign up with GitHub)
- [ ] Porkbun domain purchased and accessible
- [ ] Supabase account created (optional)

---

## Code Preparation

### Required Actions:
- [ ] Update `robots.txt` with your actual domain
- [ ] Replace `anthony@inga.dev` in ChatInterface.tsx (if needed)
- [ ] Update LinkedIn URL in ChatInterface.tsx
- [ ] Add your actual Spotify credentials to `.env.production`
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Fix any build errors

### Optional but Recommended:
- [ ] Add custom 404 page (`app/not-found.tsx`)
- [ ] Add loading states (`app/loading.tsx`)
- [ ] Add error boundaries (`app/error.tsx`)
- [ ] Optimize images (convert to WebP)
- [ ] Add metadata for SEO (`app/layout.tsx`)

---

## Information You Need to Collect

### From Porkbun:
- [ ] Your domain name: ________________
- [ ] Login credentials saved

### From Spotify (if using widget):
- [ ] Client Secret: ________________
- [ ] Refresh Token: ________________

### From Supabase (if using backend):
- [ ] Project URL: ________________
- [ ] Anon Key: ________________

---

## Deployment Steps

### 1. GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Vercel Deployment
- [ ] Project imported from GitHub
- [ ] Environment variables added:
  - [ ] SPOTIFY_CLIENT_SECRET
  - [ ] SPOTIFY_REFRESH_TOKEN
  - [ ] NEXT_PUBLIC_SUPABASE_URL (if applicable)
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (if applicable)
- [ ] First deployment successful
- [ ] Vercel URL tested: https://__________.vercel.app

### 3. Domain Configuration
- [ ] Custom domain added in Vercel
- [ ] DNS records copied from Vercel:
  - [ ] A record for @ → 76.76.21.21
  - [ ] CNAME for www → cname.vercel-dns.com
- [ ] DNS records added in Porkbun
- [ ] DNS propagation verified (use whatsmydns.net)
- [ ] SSL certificate issued (automatic, wait ~1 hour)

### 4. Testing
- [ ] Main domain works: https://yourdomain.com
- [ ] WWW subdomain works: https://www.yourdomain.com
- [ ] SSL certificate valid (green padlock)
- [ ] All pages load correctly
- [ ] ChatInterface works
- [ ] Language toggle works (EN/ES)
- [ ] Contact CTAs work (Email copy, LinkedIn link)
- [ ] Mobile responsive
- [ ] Spotify widget loads (if configured)

### 5. Post-Deployment
- [ ] Browser cache cleared and re-tested
- [ ] Test on multiple devices
- [ ] Lighthouse audit run (aim for 90+ scores)
- [ ] Analytics setup (optional)
- [ ] Monitoring configured (optional)
- [ ] Share with friends/colleagues for feedback

---

## Common Issues & Quick Fixes

### Domain not loading:
- Wait for DNS propagation (up to 48 hours)
- Check DNS records match Vercel's requirements
- Try incognito mode / different browser

### Build failing:
- Check Vercel logs for specific error
- Verify all environment variables are set
- Test build locally first

### SSL not working:
- Wait up to 1 hour for certificate
- Verify domain ownership in Vercel
- Check Vercel domain status

### Features not working:
- Check browser console for errors
- Verify environment variables in Vercel
- Check API routes are deployed correctly

---

## Timeline Estimate

| Task | Time |
|------|------|
| Code preparation | 30 min |
| GitHub push | 5 min |
| Vercel setup | 15 min |
| DNS configuration | 15 min |
| DNS propagation | 15 min - 48 hrs |
| SSL certificate | Automatic (< 1 hr) |
| Testing | 30 min |
| **Total** | **~2 hours + DNS wait** |

---

## Support Contacts

**If you get stuck:**

1. **Vercel Support**
   - Docs: https://vercel.com/docs
   - Discord: https://vercel.com/discord

2. **Porkbun Support**
   - Email: support@porkbun.com
   - Docs: https://kb.porkbun.com

3. **Supabase Support**
   - Docs: https://supabase.com/docs
   - Discord: https://discord.supabase.com

---

## Success Criteria

Your deployment is successful when:
- ✅ Your custom domain loads with HTTPS
- ✅ All pages and features work
- ✅ No console errors in browser
- ✅ Mobile responsive
- ✅ Fast load times (<3 seconds)
- ✅ Email/LinkedIn CTAs functional
- ✅ Language switching works

---

## Next Steps After Deployment

1. **Share your portfolio**
   - Update LinkedIn with portfolio URL
   - Add to resume
   - Share on social media

2. **Monitor performance**
   - Set up Vercel Analytics
   - Check Lighthouse scores monthly
   - Monitor error rates

3. **Keep updated**
   - Regular dependency updates: `npm outdated`
   - Security patches: `npm audit fix`
   - Content updates as you build new projects

4. **Backup**
   - Code is backed up on GitHub
   - Environment variables documented
   - DNS configuration documented

---

Good luck! 🚀
