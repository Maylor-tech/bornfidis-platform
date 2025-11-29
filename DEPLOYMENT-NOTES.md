# 🚀 Production Deployment Notes
## Bornfidis Platform - Final Deployment Guide

**Last Updated:** December 2024  
**Status:** ✅ Ready for Production

---

## 📋 Required Environment Variables

Copy these to your hosting platform's environment variables section:

### **Critical (Required)**

```env
# AI Services
OPENAI_API_KEY=sk-your-actual-openai-key

# Payment Processing - Stripe
STRIPE_SECRET_KEY=sk_live_your-actual-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-actual-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-actual-webhook-secret

# Stripe Product Price IDs (create in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE=price_your-hoodie-price-id
NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE=price_your-beanie-price-id
NEXT_PUBLIC_STRIPE_PRICE_ID_KIT=price_your-kit-price-id

# Print-on-Demand - Printful
PRINTFUL_API_KEY=your-actual-printful-api-key
PRINTFUL_WEBHOOK_SECRET=your-actual-printful-webhook-secret

# Database
DATABASE_URL=mysql://user:password@host:port/database?sslaccept=strict

# Authentication
NEXTAUTH_SECRET=your-generated-secret-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
```

### **Optional (Recommended)**

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
RESEND_API_KEY=re_your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# File Storage
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_UPLOAD_PRESET=bornfidis_designs

# Application URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 🗄️ Database Migrations

### Step 1: Generate Prisma Client

```bash
npm run db:generate
```

### Step 2: Run Migrations

**For Development:**
```bash
npm run db:push
```

**For Production:**
```bash
npm run db:migrate deploy
```

### Step 3: Verify Connection

```bash
npm run db:studio
```

This opens Prisma Studio to verify your database connection and view data.

---

## 💳 Stripe Configuration

### 1. Create Products in Stripe Dashboard

1. Go to https://dashboard.stripe.com/products
2. Create products for:
   - Hoodie
   - Beanie
   - Chef Digital Starter Kit
3. For each product:
   - Set pricing
   - Copy the **Price ID** (starts with `price_`)
   - Add to environment variables:
     - `NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE`
     - `NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE`
     - `NEXT_PUBLIC_STRIPE_PRICE_ID_KIT`

### 2. Set Up Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to environment variable: `STRIPE_WEBHOOK_SECRET`

### 3. Test Mode vs Live Mode

- **Development:** Use test keys (`sk_test_...`, `pk_test_...`)
- **Production:** Use live keys (`sk_live_...`, `pk_live_...`)
- Test cards: `4242 4242 4242 4242` (any future date, any CVC)

---

## 📦 Printful Configuration

### 1. Get API Key

1. Go to https://www.printful.com/dashboard/api
2. Click "Generate API key"
3. Copy the key
4. Add to environment variable: `PRINTFUL_API_KEY`

### 2. Set Up Webhook (Optional but Recommended)

1. Go to https://www.printful.com/dashboard/webhooks
2. Add webhook URL:
   ```
   https://yourdomain.com/api/webhooks/printful
   ```
3. Select events:
   - `order:created`
   - `order:updated`
   - `package:shipped`
   - `package:returned`
   - `order:failed`
4. Copy the webhook secret
5. Add to environment variable: `PRINTFUL_WEBHOOK_SECRET`

### 3. Configure Store Products

1. Go to Printful Dashboard → Products
2. Ensure your product variants match the IDs in `lib/printful.ts`
3. Update `PRODUCT_VARIANTS` mapping if needed

---

## 🔐 NextAuth Secret Generation

Generate a secure secret:

**macOS/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Add the output to `NEXTAUTH_SECRET` environment variable.

---

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)

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
   - Add all variables from the list above
   - Use **Production** environment for live keys

4. **Configure Domain:**
   - Go to Settings → Domains
   - Add your custom domain
   - Update `NEXT_PUBLIC_BASE_URL` and `NEXTAUTH_URL`

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Option 2: DigitalOcean App Platform

1. **Create App:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Run command: `npm start`

2. **Add Database:**
   - Add managed MySQL database
   - Update `DATABASE_URL`

3. **Set Environment Variables:**
   - Add all required variables

4. **Deploy:**
   - Push to main branch triggers deployment

---

## ✅ Post-Deployment Checklist

### Immediate Verification

- [ ] Homepage loads correctly
- [ ] No console errors
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Images display

### Payment Testing

- [ ] Test checkout with Stripe test card: `4242 4242 4242 4242`
- [ ] Verify webhook receives `checkout.session.completed` event
- [ ] Check order appears in database
- [ ] Verify order status updates

### Printful Testing

- [ ] Create test order
- [ ] Verify Printful order created
- [ ] Check webhook receives events
- [ ] Verify order status updates

### Authentication Testing

- [ ] Test login/register (if enabled)
- [ ] Test Google OAuth (if configured)
- [ ] Verify sessions persist
- [ ] Test protected routes

---

## 🔧 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check database credentials
- Ensure database is accessible
- Run `npm run db:push` to test connection

### Webhook Issues

- Verify webhook URLs are correct
- Check webhook secrets match
- Use Stripe/Printful webhook testing tools
- Check server logs for webhook events

### API Key Issues

- Verify keys are correct (no extra spaces)
- Check API key permissions
- Verify API credits/limits
- Check console for specific errors

---

## 📊 Monitoring & Maintenance

### Recommended Tools

- **Error Tracking:** Sentry, LogRocket
- **Analytics:** Google Analytics, Plausible
- **Uptime:** UptimeRobot, Pingdom
- **Performance:** Vercel Analytics, Lighthouse

### Regular Tasks

- Monitor error logs weekly
- Review API usage monthly
- Update dependencies quarterly
- Backup database daily (automated)

---

## 🎯 Important Notes

1. **Cart Storage:** Cart uses localStorage (client-side) until checkout. Orders are saved to database.

2. **Design Storage:** Designs use database if configured, fallback to localStorage for development.

3. **Rate Limiting:** Current implementation is in-memory. For multi-instance deployments, use Redis.

4. **Webhook Security:** All webhooks verify signatures. Ensure secrets are set in production.

5. **Database Schema:** The schema includes `printfulOrderId` and `trackingNumber` fields on Order model.

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Stripe Docs:** https://stripe.com/docs
- **Printful Docs:** https://developers.printful.com
- **Vercel Docs:** https://vercel.com/docs

---

**Status:** ✅ Ready for Production Deployment  
**Last Updated:** December 2024


