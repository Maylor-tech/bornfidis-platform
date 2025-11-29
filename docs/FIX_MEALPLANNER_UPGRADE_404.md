# Fix: /mealplanner/upgrade 404 Error

## Problem
The route `/mealplanner/upgrade` returns 404 even though the file exists at `app/mealplanner/upgrade/page.tsx`.

## Quick Fixes

### Solution 1: Restart Dev Server (Most Common Fix)

1. **Stop the dev server:**
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Clear Next.js cache:**
   ```bash
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Wait for compilation:**
   - Look for "Ready" message
   - Should see route: `○ /mealplanner/upgrade`

5. **Test the route:**
   - Visit: `http://localhost:3000/mealplanner/upgrade`

### Solution 2: Check for Build Errors

1. **Check terminal output:**
   - Look for any errors during compilation
   - Check for TypeScript errors
   - Look for missing dependencies

2. **If you see errors:**
   - Fix the errors shown
   - Restart dev server

### Solution 3: Verify File Structure

The file should be at:
```
app/
  mealplanner/
    upgrade/
      page.tsx  ← This file must exist
```

**Verify it exists:**
```bash
Test-Path app/mealplanner/upgrade/page.tsx
```

Should return: `True`

### Solution 4: Check for Syntax Errors

The `page.tsx` file uses:
- `'use client'` directive (correct for this page)
- `useSession` from `next-auth/react`
- React hooks

**If there are import errors:**
- Make sure `next-auth` is installed: `npm install next-auth`
- Make sure React is installed: `npm install react react-dom`

## Expected Behavior

After restart:
- ✅ Route should compile: `○ /mealplanner/upgrade`
- ✅ Page should load at `http://localhost:3000/mealplanner/upgrade`
- ✅ Should show premium upgrade page with benefits and "Unlock Full Meal Planner" button

## If Still 404

1. **Check Next.js version:**
   ```bash
   npm list next
   ```
   Should be `14.0.0` or later

2. **Check for conflicting routes:**
   - Make sure there's no `app/mealplanner/upgrade.tsx` (should be in folder)

3. **Check terminal for route compilation:**
   - Should see: `○ /mealplanner/upgrade` in build output
   - If you see errors, fix them

4. **Try accessing other routes:**
   - `http://localhost:3000/mealplanner` (should work)
   - `http://localhost:3000/about` (should work)
   - If these work but upgrade doesn't, it's route-specific

## Most Likely Cause

**90% of the time**: Dev server needs restart after adding new routes or making changes.

**Fix**: Stop server → Clear `.next` folder → Restart server

