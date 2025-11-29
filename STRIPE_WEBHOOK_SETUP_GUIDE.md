# Stripe Webhook Setup Guide - Environment Requirements

## Prerequisites

### 1. **Stripe Account**
   - ✅ You need a Stripe account (free test account works)
   - Sign up at: https://dashboard.stripe.com/register
   - Use **Test Mode** for development (toggle in Stripe Dashboard)

### 2. **Stripe CLI Installed**
   - ✅ Already installed at: `C:\tools\stripe\stripe.exe`
   - ✅ Added to system PATH
   - Version: 1.33.0

### 3. **Stripe CLI Authentication**
   - Run: `stripe login`
   - Complete authentication in browser
   - This stores your API keys locally

### 4. **Development Server Running**
   - Your Next.js app must be running on `localhost:3000`
   - Run: `npm run dev`
   - The webhook endpoint must be accessible: `/api/stripe/premium-webhook`

### 5. **Environment Variables**
   Your `.env.local` file needs:
   ```env
   # Stripe API Keys (from Stripe Dashboard)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   
   # Stripe Premium Price ID
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_1SYXgWRV4jor9T5UFPh45dEG
   
   # Webhook Secret (from `stripe listen` command)
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Database
   DATABASE_URL=postgresql://...
   
   # OpenAI (for meal plan generation)
   OPENAI_API_KEY=sk-...
   ```

## Step-by-Step Setup Process

### Step 1: Authenticate Stripe CLI
```powershell
stripe login
```
- Press Enter to open browser
- Complete authentication
- Terminal will show: "Done! The Stripe CLI is configured"

### Step 2: Start Your Dev Server
```powershell
npm run dev
```
- Server should start on `http://localhost:3000`
- Keep this running in one terminal

### Step 3: Start Webhook Forwarding (New Terminal)
Open a **new terminal window** and run:
```powershell
stripe listen --forward-to localhost:3000/api/stripe/premium-webhook
```

**Important:** This will output:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Copy Webhook Secret
- Copy the `whsec_...` value
- Add to `.env.local`:
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

### Step 5: Restart Dev Server
- Stop the dev server (Ctrl+C)
- Start again: `npm run dev`
- This loads the new webhook secret

## Running Environment

### Terminal 1: Development Server
```powershell
cd C:\Users\18023\OneDrive\Documents\bornfidis-platform
npm run dev
```
**Status:** ✅ Running on `localhost:3000`

### Terminal 2: Stripe Webhook Listener
```powershell
stripe listen --forward-to localhost:3000/api/stripe/premium-webhook
```
**Status:** ⏳ Waiting for authentication

## What Each Terminal Does

### Terminal 1 (Dev Server)
- Runs your Next.js application
- Handles API requests
- Processes webhook events from Stripe CLI

### Terminal 2 (Stripe CLI)
- Listens for Stripe webhook events
- Forwards them to your local server
- Shows webhook events in real-time
- Provides webhook signing secret

## Testing the Setup

Once everything is running:

1. **Visit:** `http://localhost:3000/mealplanner/upgrade`
2. **Click:** "Unlock Full Meal Planner"
3. **Use Test Card:** `4242 4242 4242 4242`
4. **Watch Terminal 2:** You'll see webhook events
5. **Check Terminal 1:** Your server will process the webhook

## Troubleshooting

### Issue: "Stripe webhook not configured"
- **Solution:** Add `STRIPE_WEBHOOK_SECRET` to `.env.local`
- **Solution:** Restart dev server after adding

### Issue: "You have not configured API keys yet"
- **Solution:** Run `stripe login` and complete authentication

### Issue: "Connection refused" or "Cannot connect"
- **Solution:** Make sure `npm run dev` is running on port 3000
- **Solution:** Check that the webhook endpoint exists: `/api/stripe/premium-webhook`

### Issue: Webhook secret not showing
- **Solution:** Complete `stripe login` first
- **Solution:** Make sure you're in a new terminal (not the dev server terminal)

## Current Status

✅ Stripe CLI installed  
✅ Stripe CLI in PATH  
⏳ Stripe CLI authentication (in progress)  
✅ Dev server running  
⏳ Webhook forwarding (waiting for auth)  
⏳ Webhook secret (will appear after auth)  

## Next Steps

1. Complete `stripe login` authentication
2. Get webhook secret from `stripe listen` output
3. Add to `.env.local`
4. Restart dev server
5. Test premium upgrade flow

