# Stripe Webhook Local Testing Setup

## Current Status
✅ Stripe CLI webhook listener is running  
✅ Webhook signing secret generated: `whsec_170b37e520401d0512bb30f5fb142bf85bf557930277694899943b12fbf53545`

## Next Steps

### 1. Add Webhook Secret to `.env.local`

Open `.env.local` and add/update:

```env
STRIPE_WEBHOOK_SECRET=whsec_170b37e520401d0512bb30f5fb142bf85bf557930277694899943b12fbf53545
```

**Important**: This secret is only for local testing. For production, you'll get a different secret from Stripe Dashboard.

### 2. Restart Your Dev Server

After adding the secret to `.env.local`:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Test the Premium Flow

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Keep Stripe CLI running** (the terminal you showed)

3. **Test the premium upgrade flow**:
   - Go to `http://localhost:3000/mealplanner/upgrade`
   - Click "Unlock Full Meal Planner"
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete checkout

4. **Watch the Stripe CLI terminal**:
   - You should see webhook events being forwarded
   - Events like `checkout.session.completed` should appear

5. **Check your dev server logs**:
   - Look for webhook processing messages
   - Verify premium access is created/updated

## Webhook Endpoint

The Stripe CLI is forwarding webhooks to:
- **Local endpoint**: `http://localhost:3000/api/stripe/premium-webhook`
- This matches your route: `app/api/stripe/premium-webhook/route.ts`

## Stripe API Version Note

Your Stripe CLI is using API version: `2025-08-27.basil`

Your code is configured for: `2023-10-16`

This should be fine - Stripe CLI uses the latest version, but your code specifies a stable version. The webhook events should still work correctly.

## Testing Checklist

- [ ] Webhook secret added to `.env.local`
- [ ] Dev server restarted
- [ ] Stripe CLI listener running
- [ ] Test premium checkout flow
- [ ] Verify webhook events appear in Stripe CLI
- [ ] Check dev server logs for webhook processing
- [ ] Confirm premium access is created in database

## Troubleshooting

### Webhook Not Received
- Check Stripe CLI is forwarding to correct URL
- Verify `STRIPE_WEBHOOK_SECRET` matches the secret shown
- Check dev server is running on port 3000

### Webhook Verification Fails
- Ensure `STRIPE_WEBHOOK_SECRET` is exactly as shown (no extra spaces)
- Restart dev server after adding secret
- Check webhook route is handling signature verification

### Events Not Processing
- Check runtime logs in dev server
- Verify database connection (if using Prisma)
- Check webhook route for error messages

## Production Setup

For production (Vercel):
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://bornfidis-platform.vercel.app/api/stripe/premium-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the webhook signing secret
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

