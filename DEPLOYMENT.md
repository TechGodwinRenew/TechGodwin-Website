# TechGodwin Deployment Guide

This guide covers deploying TechGodwin to various platforms.

## Prerequisites

- Git repository (GitHub, GitLab, or Gitea)
- PostgreSQL database (Supabase recommended)
- Node.js 18+
- npm or yarn

## Quick Start: Render.com Deployment

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab:
```bash
git add .
git commit -m "Initial TechGodwin setup"
git push origin main
```

2. Create `.env` file in root (Render will use this):
```bash
# Copy from .env.local
cp .env.local .env.render
```

### Step 2: Set Up Supabase Database

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database > Connection String
4. Copy the PostgreSQL connection string (save for later)

### Step 3: Deploy on Render

1. Visit [render.com](https://render.com) and sign up
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `techgodwin`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to your users (Oregon, Dallas, Frankfurt)
   - **Plan**: Standard ($12/month) or higher

### Step 4: Add Environment Variables

In Render dashboard, go to Environment:

```
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres?schema=public
NEXT_PUBLIC_APP_URL=https://techgodwin.onrender.com
NODE_ENV=production
```

### Step 5: Deploy Database Schema

After first deployment:

1. SSH into Render service or use Render's shell
2. Run:
```bash
npx prisma db push
npx prisma db seed  # Optional: loads sample data
```

Or automate in build command:
```bash
npm install && npm run build && npx prisma db push
```

### Step 6: Verify Deployment

1. Visit your deployed URL: `https://techgodwin.onrender.com`
2. Check if home page loads
3. Navigate to `/blog` and `/classes`
4. Try creating a test class via API

## Advanced: Multiple Environment Deployment

### Staging Environment (Render)

1. Create new service for staging
2. Connect to `staging` branch
3. Use separate Supabase project for staging DB
4. Deploy to: `https://techgodwin-staging.onrender.com`

### Production Environment (Render)

1. Keep main service for production
2. Connect to `main` branch
3. Use production Supabase database
4. Deploy to: `https://techgodwin.onrender.com`

### Database Backups

Supabase automatically backs up daily. For additional security:

```bash
# Manual backup from Supabase dashboard:
# 1. Go to Settings > Backups
# 2. Click "Take Backup Now"
# 3. Or schedule automatic backups
```

## Payments Activation

To enable Stripe or PayPal payments:

### Stripe Integration

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard > API Keys
3. Add to Render environment:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

4. Update payment route (`app/api/payments/route.ts`):
```typescript
// Uncomment Stripe implementation
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

5. Set up Stripe webhooks for payment callbacks

### PayPal Integration

1. Create PayPal Developer account
2. Get OAuth credentials from Developer Console
3. Add to Render environment:
```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

4. Update payment route for PayPal

## Performance Optimization

### Image Optimization

```typescript
// next.config.js - Configure image domains
images: {
  domains: ['supabase.co', 'cdn.example.com'],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
}
```

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_blogpost_published ON BlogPost(published);
CREATE INDEX idx_class_startdate ON UpcomingClass(startDate);
```

### Caching Headers

```typescript
// Set cache headers in API routes
res.setHeader('Cache-Control', 'max-age=300'); // 5 minutes
```

## Monitoring & Logging

### Render Logs

View in Render dashboard > Service > Logs

### Application Monitoring

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const withSentry = require("@sentry/nextjs/withSentry");
module.exports = withSentry({
  // ... next config
});
```

### Uptime Monitoring

Use [uptime.com](https://uptime.com) or similar to monitor `/` endpoint

## Scaling Considerations

### Database Scaling (Supabase)

- Monitor Compute Size
- Upgrade if CPU > 80% consistently
- Enable connection pooling for high traffic

### Application Scaling (Render)

- Upgrade to Pro ($60+/month) for redundancy
- Enable auto-scaling if available
- Consider multi-region deployment

### CDN for Static Assets

```bash
# Use Supabase Storage or similar
# Serve images via CDN for faster delivery
```

## Troubleshooting

### Build Failures

Check build logs in Render dashboard:
```bash
# Common issues:
- Missing environment variables
- Prisma migration issues
- Node version incompatibility
```

### Database Connection Errors

1. Verify DATABASE_URL is correct
2. Check firewall rules in Supabase
3. Test connection locally:
```bash
npx prisma db push --force-reset  # WARNING: Resets DB
```

### Slow Performance

1. Check database query performance
2. Enable query logging:
```
DATABASE_URL="...?schema=public&debug=true"
```

3. Monitor with Prisma Studio:
```bash
npm run db:studio
```

## Security Checklist

- [ ] Rotate all API keys regularly
- [ ] Enable 2FA on all accounts (Supabase, Render, Stripe)
- [ ] Use strong database passwords
- [ ] Enable HTTPS (automatic with Render)
- [ ] Set Content Security Policy headers
- [ ] Enable rate limiting on API
- [ ] Regular database backups
- [ ] Audit logs monitoring

## Disaster Recovery

### Database Backup Recovery

```bash
# In case of data loss:
# 1. Go to Supabase > Backups
# 2. Select previous backup
# 3. Click "Restore"
# 4. Verify in Prisma Studio
```

### Code Rollback

```bash
# Revert to previous deployment
git revert <commit-hash>
git push origin main
# Render auto-redeploys
```

## Support

For issues:
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated**: 2024-07-23
**Status**: Production Ready ✅
