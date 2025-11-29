# 🚀 Quick Setup - Get Your Site Running in 5 Minutes

## Step 1: Create .env.local File

**IMPORTANT:** You need to create a `.env.local` file in the root directory.

### Option A: Copy the example file
```bash
# In your terminal, run:
copy .env.local.example .env.local
```

### Option B: Create manually
1. Create a new file called `.env.local` in the root folder
2. Copy this content into it:

```env
# AI Services (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Print-on-Demand (Required for orders)
PRINTFUL_API_KEY=your-printful-api-key-here

# Payment (Required for checkout)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

3. Replace the placeholder values with your actual API keys

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- fabric.js (for design canvas)
- openai (for AI features)
- axios (for API calls)
- @stripe/stripe-js (for payments)

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Open Your Browser

Visit: `http://localhost:3000`

## Step 5: Test the Customization Tool

Visit: `http://localhost:3000/customize`

---

## 🔑 Getting Your API Keys

### OpenAI API Key (for AI design generation)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Paste it in `.env.local` as `OPENAI_API_KEY`

**Note:** You'll need to add credits to your OpenAI account ($5 minimum)

### Printful API Key (for print-on-demand)
1. Go to https://www.printful.com/
2. Create a free account
3. Go to Dashboard → Stores → API
4. Click "Generate API key"
5. Copy the key
6. Paste it in `.env.local` as `PRINTFUL_API_KEY`

### Stripe Keys (for payments)
1. Go to https://stripe.com/
2. Create account or log in
3. Go to Developers → API keys
4. Copy:
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
5. Paste in `.env.local`

---

## ⚠️ Common Issues & Fixes

### Issue: "Module not found" errors
**Fix:** Run `npm install` again

### Issue: "fabric is not defined"
**Fix:** Make sure you ran `npm install` and restart the dev server

### Issue: "API key not found"
**Fix:** 
1. Check that `.env.local` exists in the root folder
2. Make sure the variable names match exactly (case-sensitive)
3. Restart the dev server after adding keys

### Issue: Tailwind classes not working
**Fix:** The coral color is now in the config. If you still see issues, restart the dev server.

### Issue: Site won't load
**Fix:**
1. Make sure you're in the project directory
2. Run `npm install`
3. Run `npm run dev`
4. Check the terminal for error messages

---

## ✅ What Should Work Without API Keys

Even without API keys, you should be able to:
- ✅ View the customization page
- ✅ Use the design canvas (add text, upload images)
- ✅ Add items to cart
- ✅ View cart page

**What WON'T work without API keys:**
- ❌ AI design generation (needs OpenAI)
- ❌ Order processing (needs Printful)
- ❌ Payment checkout (needs Stripe)

---

## 🎯 Quick Test Checklist

After setup, test these:

1. [ ] Site loads at `localhost:3000`
2. [ ] Can visit `/customize` page
3. [ ] Can select product type
4. [ ] Can change colors
5. [ ] Can add text to canvas
6. [ ] Can upload images
7. [ ] Can add to cart
8. [ ] Cart page shows items

---

## 📞 Need Help?

If you're still seeing errors:
1. Check the terminal/console for specific error messages
2. Make sure all dependencies are installed: `npm install`
3. Try deleting `node_modules` and `.next` folder, then run `npm install` again
4. Restart your dev server

---

**You're all set!** Once you add your API keys, everything will work. 🎉

