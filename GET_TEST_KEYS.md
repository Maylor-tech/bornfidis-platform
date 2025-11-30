# 🔑 Get Your Stripe Test Keys

## Quick Steps:

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/test/apikeys
   - Make sure you're in **TEST MODE** (toggle in top right)

2. **Copy Your Test Keys:**
   - **Secret key:** Starts with `sk_test_...`
   - **Publishable key:** Starts with `pk_test_...`

3. **Get Test Price ID:**
   - Go to: https://dashboard.stripe.com/test/products
   - Find or create "Bornfidis Smart Meal Planner Premium"
   - Copy the **Price ID** (starts with `price_...`)

4. **Paste them here or update .env.local:**
   ```env
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PRICE_ID_HERE
   ```

---

**Current Live Keys (what you have now):**
- Secret: `sk_live_...` (check your .env.local file)
- Publishable: `pk_live_...` (check your .env.local file)

**You need TEST keys that start with:**
- `sk_test_...` (instead of `sk_live_...`)
- `pk_test_...` (instead of `pk_live_...`)

