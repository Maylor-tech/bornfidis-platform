# Fix: Redirect URL Issues After Stripe Checkout

## Problem
After completing Stripe checkout, users are not being redirected to the correct success page URL.

## Root Cause
The `baseUrl` detection in `/api/stripe/create-premium-checkout/route.ts` might not be correctly detecting the local development port (e.g., 3003).

## Solution

### For Local Development:
1. **Set `NEXT_PUBLIC_BASE_URL` in `.env.local`:**
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3003
   ```
   (Replace `3003` with your actual dev server port)

2. **Restart the dev server** after adding the environment variable:
   ```bash
   npm run dev
   ```

### For Production:
1. **Set `NEXT_PUBLIC_BASE_URL` in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_BASE_URL=https://bornfidis-platform.vercel.app`

2. **Redeploy** the application

## How It Works
The checkout API now prioritizes `NEXT_PUBLIC_BASE_URL` if set, then falls back to:
1. `origin` header (preserves port for localhost)
2. `host` header with protocol
3. `referer` header
4. Config default (`http://localhost:3000`)

## Testing
1. Complete a test checkout
2. Verify you're redirected to: `http://localhost:3003/mealplanner/success?session_id=cs_...`
3. Check browser console for any redirect errors

