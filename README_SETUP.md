# 🚀 BORNFIDIS - Complete Setup Guide

## ⚡ SUPER QUICK START (2 minutes)

### 1. Create .env.local file

Run this command in your terminal:
```bash
npm run setup-env
```

OR manually create a file named `.env.local` in the root folder with:
```env
OPENAI_API_KEY=sk-placeholder
PRINTFUL_API_KEY=placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm run dev
```

### 4. Open browser
Go to: http://localhost:3000

**That's it!** The site should work now. Add real API keys later.

---

## 📋 What's Included

✅ **Fully Working Customization System**
- Design canvas with text and image tools
- AI design assistant (needs OpenAI key)
- Shopping cart
- Checkout system (needs Stripe keys)
- Order tracking
- Printful integration (needs Printful key)

✅ **Chef Services Customization**
- Menu generator (needs OpenAI key)
- Dietary preferences
- Booking system

---

## 🔑 Getting Real API Keys (When Ready)

### OpenAI (for AI features)
1. https://platform.openai.com/
2. Sign up → API Keys → Create key
3. Add $5+ credits
4. Copy key to `.env.local`

### Printful (for orders)
1. https://www.printful.com/
2. Sign up (free)
3. Dashboard → Stores → API → Generate key
4. Copy to `.env.local`

### Stripe (for payments)
1. https://stripe.com/
2. Sign up (free)
3. Developers → API keys
4. Copy both keys to `.env.local`

---

## ✅ Testing Checklist

After setup, test:
- [ ] Homepage loads
- [ ] `/customize` page works
- [ ] Can add text to canvas
- [ ] Can upload images
- [ ] Can add to cart
- [ ] Cart page shows items
- [ ] Checkout page loads

---

## 🐛 Common Issues

**"Module not found"**
→ Run `npm install` again

**"fabric is not defined"**
→ Make sure `npm install` completed successfully

**".env.local not found"**
→ Create it manually or run `npm run setup-env`

**Tailwind classes not working**
→ Restart dev server (`Ctrl+C` then `npm run dev`)

**Site won't load**
→ Check terminal for error messages
→ Make sure port 3000 isn't in use

---

## 📁 File Structure

```
bornfidis-platform/
├── .env.local              ← CREATE THIS (not in git)
├── app/
│   ├── customize/          ← Customization page
│   ├── cart/               ← Shopping cart
│   ├── checkout/           ← Checkout page
│   └── api/                ← API routes
├── components/
│   ├── DesignCanvas.tsx    ← Design tool
│   ├── AIDesignAssistant.tsx
│   └── Cart.tsx
└── lib/
    ├── database.ts         ← Data storage
    ├── cart.ts             ← Cart functions
    └── printful.ts        ← Printful API
```

---

## 🎯 Next Steps

1. **Test the site** - Make sure everything loads
2. **Add API keys** - Get real keys when ready
3. **Customize** - Adjust colors, text, etc.
4. **Deploy** - Push to Vercel/Netlify when ready

---

## 💡 Pro Tips

- **Start without API keys** - Most features work without them
- **Use test mode** - Stripe has test keys that work for testing
- **Check console** - Browser console shows helpful errors
- **Read errors** - Terminal errors tell you exactly what's wrong

---

**The site IS ready - just needs the .env.local file!** 🎉

For detailed docs, see:
- `QUICK_START.md` - Fast setup
- `SETUP_INSTRUCTIONS.md` - Detailed guide
- `PRODUCTION_READY.md` - Production deployment

