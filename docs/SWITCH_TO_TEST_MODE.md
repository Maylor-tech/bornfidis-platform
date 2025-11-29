# 🔄 Switch to Stripe Test Mode

## The Problem
You're seeing: **"Your card was declined. Your request was in live mode, but used a known test card."**

This means you're using **LIVE Stripe keys** (`sk_live_...` and `pk_live_...`) but trying to use a **test card** (`4242 4242 4242 4242`).

## Solution: Switch to Test Keys

### Step 1: Get Your Test Keys from Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **IMPORTANT:** Make sure you're in **Test Mode** (toggle in top right should say "Test mode")
3. Go to **Developers → API keys**
4. Copy these keys:
   - **Secret key** (starts with `sk_test_...`)
   - **Publishable key** (starts with `pk_test_...`)

### Step 2: Update Your `.env.local` File

Open your `.env.local` file and update these lines:

```env
# Change from LIVE keys to TEST keys:
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
```

**Important:** 
- Replace `sk_live_...` with `sk_test_...`
- Replace `pk_live_...` with `pk_test_...`

### Step 3: Get Test Price ID

1. In Stripe Dashboard (Test Mode), go to **Products**
2. Find or create "Bornfidis Smart Meal Planner Premium"
3. Copy the **Price ID** (starts with `price_...`)
4. Update in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_TEST_PRICE_ID_HERE
```

### Step 4: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Again

1. Go to `/mealplanner/upgrade`
2. You should see: **"🧪 Test Mode Active"** banner
3. Click "Subscribe Now"
4. Use test card: `4242 4242 4242 4242`
5. Any future expiration (e.g., 12/34)
6. Any CVC (e.g., 123)
7. Any ZIP code

## How to Tell Which Mode You're In

### Test Mode Indicators:
- ✅ Keys start with `sk_test_` and `pk_test_`
- ✅ Yellow banner on upgrade page: "🧪 Test Mode Active"
- ✅ Test cards work (4242 4242 4242 4242)

### Live Mode Indicators:
- ⚠️ Keys start with `sk_live_` and `pk_live_`
- ⚠️ No test mode banner
- ❌ Test cards are rejected

## Quick Check

Run this in your terminal to check your current keys:

```powershell
# Check if using test keys
Select-String -Path .env.local -Pattern "pk_test_|sk_test_"
```

If you see results, you're in test mode. If not, you need to switch!

## For Production

When you're ready to go live:
1. Switch Stripe Dashboard to **Live Mode**
2. Get your **live keys** (`sk_live_...` and `pk_live_...`)
3. Update `.env.local` with live keys
4. Use **real credit cards** (not test cards)

---

**Need help?** Check your `.env.local` file and make sure both keys start with `test_` for development!

