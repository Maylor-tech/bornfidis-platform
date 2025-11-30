# Premium Features Testing Checklist

## Prerequisites
1. ✅ Dev server running on `http://localhost:3003`
2. ✅ `.env.local` has `NEXT_PUBLIC_BASE_URL=http://localhost:3003`
3. ✅ Test Stripe keys configured
4. ✅ Logged in as a test user

---

## TEST 1: Premium Upgrade Flow

### Steps:
1. Navigate to `/mealplanner/upgrade`
2. Verify page loads with:
   - Comparison table (Free vs Premium)
   - Value calculator
   - Testimonials
   - FAQ section
   - "Subscribe Now" button
3. Click "Subscribe Now"
4. Complete test payment:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
5. Verify redirect to `/mealplanner/success?session_id=cs_...`

### Expected Results:
- ✅ Upgrade page displays correctly
- ✅ Stripe checkout opens
- ✅ Payment completes successfully
- ✅ Redirects to success page
- ✅ Success page shows animated checkmark
- ✅ Premium status verified

### Status: ⏳ PENDING TEST

---

## TEST 2: Welcome Email

### Steps:
1. Complete a test subscription (TEST 1)
2. Check email inbox (or Stripe test mode logs)
3. Verify email received with:
   - Welcome message
   - Getting started guide
   - Premium benefits list
   - Link to meal planner

### Expected Results:
- ✅ Email sent within 30 seconds of subscription
- ✅ Email contains all required content
- ✅ Links work correctly
- ✅ Email styling is correct

### Status: ⏳ PENDING TEST

**Note:** Requires `RESEND_API_KEY` in `.env.local`

---

## TEST 3: Premium Badge

### Steps:
1. After completing subscription, refresh page
2. Check navigation header
3. Verify "⭐ Premium" badge appears
4. Click badge - should link to `/mealplanner`

### Expected Results:
- ✅ Badge appears in navigation
- ✅ Badge only shows for premium users
- ✅ Badge links to meal planner
- ✅ Badge has loading state

### Status: ⏳ PENDING TEST

---

## TEST 4: Dashboard Premium Section

### Steps:
1. Navigate to `/dashboard`
2. Verify premium card displays:
   - "Premium Meal Planner" heading
   - "ACTIVE" badge
   - Member since date
   - Subscription status
   - Usage stats (if plans generated)
3. Click "Manage Billing" button
4. Verify Stripe portal opens

### Expected Results:
- ✅ Premium card shows correct information
- ✅ Member since date is accurate
- ✅ Usage stats display correctly
- ✅ "Manage Billing" opens Stripe portal
- ✅ Portal allows updating payment method

### Status: ⏳ PENDING TEST

---

## TEST 5: Meal Planner (7-Day)

### Steps:
1. Navigate to `/mealplanner`
2. Fill out meal plan form
3. Submit form
4. Verify meal plan displays:
   - All 7 days visible (not just 3)
   - Complete shopping list (not limited)
   - No "Upgrade" blur on days 4-7

### Expected Results:
- ✅ Full 7-day meal plan generated
- ✅ All days visible and accessible
- ✅ Complete shopping list shown
- ✅ No premium upgrade prompts

### Status: ⏳ PENDING TEST

---

## TEST 6: PDF Export

### Steps:
1. Generate a meal plan (TEST 5)
2. Scroll to bottom of results
3. Click "Export PDF" button
4. Verify PDF downloads
5. Open PDF and check:
   - Bornfidis branding
   - Scripture (Proverbs 9:1)
   - Full 7-day meal plan
   - Complete shopping list

### Expected Results:
- ✅ PDF export button visible
- ✅ PDF downloads successfully
- ✅ PDF contains all content
- ✅ PDF has proper branding

### Status: ⏳ PENDING TEST

---

## TEST 7: Customer Portal

### Steps:
1. Navigate to `/dashboard`
2. Click "Manage Billing" button
3. Verify Stripe Customer Portal opens
4. Test portal features:
   - View invoices
   - Update payment method
   - Cancel subscription (test only)

### Expected Results:
- ✅ Portal opens successfully
- ✅ Portal shows subscription details
- ✅ Can update payment method
- ✅ Can view invoices
- ✅ Can cancel subscription

### Status: ⏳ PENDING TEST

---

## TEST 8: Usage Stats

### Steps:
1. Generate 2-3 meal plans
2. Navigate to `/dashboard`
3. Verify stats display:
   - Total meal plans count
   - Plans this month count
4. Verify stats update after generating new plan

### Expected Results:
- ✅ Stats display correctly
- ✅ Total plans count is accurate
- ✅ Monthly count is accurate
- ✅ Stats update in real-time

### Status: ⏳ PENDING TEST

---

## TEST 9: Free Tier Limits

### Steps:
1. **Log out** or use a **different test account** (non-premium)
2. Navigate to `/mealplanner`
3. Generate a meal plan
4. Verify free tier restrictions:
   - Only first 3 days visible
   - Days 4-7 blurred with "Upgrade" prompt
   - Shopping list limited (shows "+ X more items (Premium)")
   - PDF export button disabled/hidden
   - Upgrade banner visible

### Expected Results:
- ✅ Only 3 days visible for free users
- ✅ Days 4-7 show upgrade prompt
- ✅ Shopping list is limited
- ✅ PDF export not available
- ✅ Upgrade prompts are clear

### Status: ⏳ PENDING TEST

---

## TEST 10: Error Handling

### Steps:
1. Test with invalid Stripe keys (temporarily)
2. Test with network disconnected
3. Test with expired session
4. Test with missing environment variables
5. Check error messages are user-friendly

### Expected Results:
- ✅ Graceful error handling
- ✅ User-friendly error messages
- ✅ No crashes or blank pages
- ✅ Fallback pricing displays
- ✅ Console logs for debugging

### Status: ⏳ PENDING TEST

---

## Quick Test Commands

```bash
# Check if dev server is running
curl http://localhost:3003

# Check premium status API
curl http://localhost:3003/api/mealplanner/premium-status

# Check dashboard stats API
curl http://localhost:3003/api/dashboard/stats
```

---

## Common Issues & Fixes

### Issue: Build Error on Success Page
**Fix:** Ensure syntax is correct, restart dev server

### Issue: Redirect Not Working
**Fix:** Set `NEXT_PUBLIC_BASE_URL=http://localhost:3003` in `.env.local`

### Issue: Premium Badge Not Showing
**Fix:** Check premium status API, verify user has active subscription

### Issue: PDF Export Not Working
**Fix:** Verify user is premium, check browser console for errors

### Issue: Welcome Email Not Sending
**Fix:** Check `RESEND_API_KEY` is set, check server logs

---

## Test Results Template

Copy this to track your results:

```
TEST 1: Premium Upgrade Flow
Status: ✅ PASS / ❌ FAIL
Notes: 
Issues found:

TEST 2: Welcome Email
Status: ✅ PASS / ❌ FAIL
Notes:
Issues found:

[... continue for all tests ...]
```

