# Fix: Vercel 404 NOT_FOUND Error After Successful Build

## Problem
Build succeeds, but the deployed app returns `404: NOT_FOUND` when accessing the site.

## Root Cause
Missing or incorrect environment variables in Vercel, causing runtime errors that manifest as 404.

## Required Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

### **Critical (Must Have)**

```env
# Base URL - Use your Vercel deployment URL
NEXT_PUBLIC_BASE_URL=https://bornfidis-platform.vercel.app

# NextAuth - Required for app to start
NEXTAUTH_URL=https://bornfidis-platform.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Database - Prisma needs this even if not using DB
DATABASE_URL=postgresql://user:password@host:port/database
```

### **Important (App will work but features won't)**

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI (for meal planner)
OPENAI_API_KEY=sk-...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@bornfidis.com
```

## Quick Fix Steps

1. **Set Minimum Required Variables:**
   - `NEXT_PUBLIC_BASE_URL` = Your Vercel URL (e.g., `https://bornfidis-platform.vercel.app`)
   - `NEXTAUTH_URL` = Same as above
   - `NEXTAUTH_SECRET` = Generate with: `openssl rand -base64 32`
   - `DATABASE_URL` = Your Supabase/Postgres connection string

2. **Redeploy:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on the latest deployment
   - Or push a new commit

3. **Verify:**
   - Check build logs for any errors
   - Visit the site - should load homepage

## Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

## Why This Happens

The app's `layout.tsx` uses `process.env.NEXT_PUBLIC_BASE_URL` in metadata. If it's missing:
- Next.js may fail to render the page
- This manifests as a 404 error
- NextAuth also requires `NEXTAUTH_SECRET` and `NEXTAUTH_URL` to initialize

## After Setting Variables

1. **Clear Build Cache** (optional but recommended):
   - Vercel Dashboard → Settings → Clear Build Cache

2. **Redeploy:**
   - Trigger a new deployment

3. **Check Logs:**
   - Vercel Dashboard → Deployments → Latest → Logs
   - Look for any runtime errors

## Expected Result

After setting the required environment variables and redeploying:
- ✅ Homepage loads at `https://bornfidis-platform.vercel.app`
- ✅ No 404 errors
- ✅ Navigation works
- ✅ Pages render correctly

