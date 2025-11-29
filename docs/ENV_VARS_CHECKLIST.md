# Environment Variables Checklist for Vercel

## ✅ Currently Set (Based on Your Dashboard)

- [x] `NEXTAUTH_URL` - ✅ Set
- [x] `NEXT_PUBLIC_BASE_URL` - ✅ Set  
- [x] `NEXT_PUBLIC_APP_URL` - ✅ Set
- [x] `NEXTAUTH_SECRET` - ✅ Set
- [x] `NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE` - ✅ Set
- [x] `NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE` - ✅ Set
- [x] `NEXT_PUBLIC_STRIPE_PRICE_ID_KIT` - ✅ Set
- [x] `CLOUDINARY_URL` - ✅ Set

## ⚠️ Check If Needed

### Database (Required if using Prisma)
- [ ] `DATABASE_URL` - **Check if this is set** (might be below visible area)
  - Format: `postgresql://user:password@host:port/database`
  - If using Supabase: Get from Supabase Dashboard → Project Settings → Database → Connection String

### Additional Recommended Variables

- [ ] `STRIPE_SECRET_KEY` - For Stripe checkout to work
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For Stripe checkout
- [ ] `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID` - For premium meal planner subscription
- [ ] `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- [ ] `OPENAI_API_KEY` - For meal planner AI features
- [ ] `RESEND_API_KEY` - For email notifications
- [ ] `RESEND_FROM_EMAIL` - For email sender address

## Next Steps

1. **Check if `DATABASE_URL` is set** - Scroll down in the environment variables list
2. **Verify the site works** - Visit `https://bornfidis-platform.vercel.app`
3. **Check latest deployment** - Ensure commit `66058ea` is deployed (has the 404 fix)

## If Site Still Shows 404

1. **Wait for latest commit to deploy** - The fix is in commit `66058ea`
2. **Manually trigger redeploy** - Vercel Dashboard → Deployments → Redeploy
3. **Check deployment logs** - Look for any runtime errors

## Current Status

✅ Environment variables are properly configured  
✅ Critical variables are set  
⚠️ Verify `DATABASE_URL` is present  
⏳ Wait for latest commit (`66058ea`) to deploy for 404 fix

