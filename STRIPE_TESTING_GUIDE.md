# 🧪 Stripe Testing Guide

## ⚠️ Important: Live vs Test Keys

**You're currently using LIVE keys** (`sk_live_` and `pk_live_`). 

**For Testing, use TEST keys:**
- Test keys start with `sk_test_` and `pk_test_`
- Test keys don't charge real money
- You can use test card numbers

**To switch to test mode:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy test keys
3. Update `.env.local` with test keys
4. Restart dev server

---

## 🧪 Testing Stripe Checkout

### Method 1: Test via Shop Page

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit shop page:**
   - Go to http://localhost:3000/shop
   - Click on any product

3. **Add to cart:**
   - Select size (if applicable)
   - Click "Add to Cart" or "Buy Now"

4. **Go to checkout:**
   - Click cart icon or go to `/cart`
   - Click "Checkout" or "Proceed to Checkout"

5. **Test payment:**
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Any future expiration date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)
   - Any ZIP code

6. **Complete payment:**
   - Click "Pay"
   - You'll be redirected to success page

### Method 2: Test via API Directly

You can test the checkout API directly:

```bash
curl -X POST http://localhost:3000/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "middle-mountain-hoodie",
    "size": "M"
  }'
```

Or test the checkout route:

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "middle-mountain-hoodie",
      "priceId": "price_1SYBmNRV4jor9T5UloEeu1o5",
      "quantity": 1,
      "price": 89.99
    }]
  }'
```

---

## 🎯 Test Card Numbers

### Success Cards:
- `4242 4242 4242 4242` - Basic success
- `4000 0027 6000 3184` - Requires 3D Secure authentication

### Decline Cards:
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

### Other Test Scenarios:
- `4000 0025 0000 3155` - Requires authentication
- `5555 5555 5555 4444` - Success (Visa)

**All test cards:**
- Use any future expiration date
- Use any 3-digit CVC
- Use any ZIP code

---

## ✅ Your Current Setup

**Stripe Keys:** ✅ Configured (LIVE keys - switch to TEST for testing)
**Price IDs:** ✅ All 3 products configured
- Hoodie: `price_1SYBmNRV4jor9T5UloEeu1o5`
- Beanie: `price_1SYBvWRV4jor9T5UnasawPLX`
- Kit: `price_1SYBydRV4jor9T5UGv2DeqaP`

**Products in code:**
- ✅ Middle Mountain Hoodie
- ✅ Bornfidis Beanie
- ✅ Chef Digital Starter Kit

---

## 🚀 Quick Test Steps

1. **Make sure dev server is running:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Go to http://localhost:3000/shop

3. **Test a product:**
   - Click on "Middle Mountain Hoodie"
   - Click "Add to Cart" or "Buy Now"
   - Fill shipping info (if on checkout page)
   - Click "Proceed to Payment"
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

4. **Verify success:**
   - Should redirect to `/shop/success` or `/checkout/success`
   - Check Stripe Dashboard → Payments to see the test payment

---

## 🔍 Troubleshooting

### "Stripe is not configured" error
- Check `.env.local` has `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Restart dev server after changing `.env.local`

### "Invalid price ID" error
- Verify price IDs in `.env.local` match Stripe Dashboard
- Check products exist in Stripe Dashboard
- Ensure price IDs are active

### Checkout page not loading
- Check browser console for errors
- Verify API route is working: http://localhost:3000/api/stripe/create-checkout
- Check server logs for errors

### Payment succeeds but no order created
- Check if database is configured
- If not, orders use localStorage (check browser console)
- Webhook will create order if configured

---

## 📊 Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/payments
2. Switch to "Test mode" (toggle in top right)
3. You should see test payments
4. Click on a payment to see details

---

## 🎉 Success Indicators

✅ Checkout redirects to Stripe  
✅ Payment form loads  
✅ Test card accepted  
✅ Redirects to success page  
✅ Payment appears in Stripe Dashboard  
✅ Order created (if database/webhook configured)

---

**Ready to test!** Start the dev server and visit `/shop` to begin.


