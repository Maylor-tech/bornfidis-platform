# 🚀 Production Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local` (for local) and set environment variables in hosting platform
- [ ] Set all required API keys:
  - [ ] `OPENAI_API_KEY` (for AI features)
  - [ ] `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for payments)
  - [ ] `PRINTFUL_API_KEY` (for order fulfillment)
  - [ ] `DATABASE_URL` (for database)
  - [ ] `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] Set production URLs:
  - [ ] `NEXT_PUBLIC_BASE_URL` (your production domain)
  - [ ] `NEXTAUTH_URL` (your production domain)
- [ ] Configure optional services:
  - [ ] `CLOUDINARY_URL` (for file storage)
  - [ ] `RESEND_API_KEY` or `SENDGRID_API_KEY` (for emails)
  - [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for OAuth)

### 2. Database Setup
- [ ] Create database (PlanetScale, Supabase, or self-hosted)
- [ ] Set `DATABASE_URL` in environment variables
- [ ] Run Prisma migrations:
  ```bash
  npm run db:generate
  npm run db:push  # or db:migrate for production
  ```
- [ ] Verify database connection

### 3. Stripe Configuration
- [ ] Create Stripe account (or use existing)
- [ ] Get API keys from Stripe Dashboard
- [ ] Create products and prices in Stripe Dashboard
- [ ] Set Price IDs in environment variables:
  - [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE`
  - [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE`
  - [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID_KIT`
- [ ] Set up webhook endpoint:
  - [ ] URL: `https://yourdomain.com/api/stripe/webhook`
  - [ ] Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
  - [ ] Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Printful Configuration
- [ ] Create Printful account
- [ ] Get API key from Printful Dashboard
- [ ] Set `PRINTFUL_API_KEY` in environment variables
- [ ] Configure webhook (optional):
  - [ ] URL: `https://yourdomain.com/api/webhooks/printful`
  - [ ] Set `PRINTFUL_WEBHOOK_SECRET`

### 5. File Storage
- [ ] Set up Cloudinary account (recommended) or AWS S3
- [ ] Configure upload preset in Cloudinary
- [ ] Set `CLOUDINARY_URL` and `CLOUDINARY_UPLOAD_PRESET` in environment variables

### 6. Build & Test
- [ ] Run build locally:
  ```bash
  npm run build
  ```
- [ ] Fix any build errors
- [ ] Test all features:
  - [ ] Homepage loads
  - [ ] Navigation works
  - [ ] Product pages display
  - [ ] Shopping cart functions
  - [ ] Checkout process (test mode)
  - [ ] AI features (if enabled)
  - [ ] Authentication (if enabled)

## Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Configure Domain:**
   - Go to Settings → Domains
   - Add your custom domain
   - Update `NEXT_PUBLIC_BASE_URL` and `NEXTAUTH_URL`

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean Dashboard
   - Create new App
   - Connect GitHub repository

2. **Configure Build:**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment: Node.js

3. **Set Environment Variables:**
   - Add all variables from `.env.local`

4. **Add Database:**
   - Add managed MySQL database
   - Update `DATABASE_URL`

5. **Deploy:**
   - Push to main branch triggers deployment

### Option 3: Self-Hosted (Docker)

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t bornfidis-platform .
   docker run -p 3000:3000 --env-file .env.local bornfidis-platform
   ```

## Post-Deployment

### 1. Verify Deployment
- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] Images load properly
- [ ] API routes respond correctly
- [ ] No console errors

### 2. Test Critical Features
- [ ] **Payments:**
  - [ ] Test checkout with Stripe test card: `4242 4242 4242 4242`
  - [ ] Verify webhook receives events
  - [ ] Check order creation in database

- [ ] **AI Features:**
  - [ ] Test design generation
  - [ ] Test menu generation
  - [ ] Verify API responses

- [ ] **Authentication:**
  - [ ] Test login/register
  - [ ] Test OAuth (if configured)
  - [ ] Verify session management

- [ ] **Orders:**
  - [ ] Test order creation
  - [ ] Verify Printful integration
  - [ ] Check webhook processing

### 3. Security Checklist
- [ ] All environment variables are set (no placeholders)
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Webhook secrets are configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (if implemented)

### 4. Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Optimize images
- [ ] Enable caching
- [ ] Set up CDN (if using Vercel, automatic)

### 5. Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Monitor API usage (OpenAI, Stripe, Printful)
- [ ] Set up uptime monitoring
- [ ] Configure email alerts for errors

### 6. Documentation
- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document backup procedures

## Rollback Plan

If deployment fails:

1. **Vercel:**
   - Go to Deployments → Previous deployment → Promote to Production

2. **DigitalOcean:**
   - Go to App → Deployments → Rollback

3. **Self-Hosted:**
   - Revert to previous Docker image
   - Or restore from backup

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review API usage monthly
- [ ] Update dependencies quarterly
- [ ] Backup database daily (automated)
- [ ] Review security updates monthly

### Updates
- [ ] Test updates in staging first
- [ ] Update dependencies: `npm update`
- [ ] Run migrations: `npm run db:migrate`
- [ ] Rebuild and redeploy

## Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Printful Docs:** https://developers.printful.com
- **Prisma Docs:** https://www.prisma.io/docs

## Emergency Contacts

- **Hosting Support:** [Your hosting provider support]
- **Database Support:** [Your database provider support]
- **Payment Support:** Stripe Support
- **Fulfillment Support:** Printful Support

---

**Last Updated:** December 2024  
**Status:** Ready for Production Deployment


