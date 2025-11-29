# Fixing Prisma OneDrive File Lock Issue

## Problem
When running `npm run db:generate` on Windows with OneDrive, you may see:
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node'
```

This happens because OneDrive locks files during sync.

## Solutions

### Option 1: Exclude node_modules from OneDrive (Recommended)

1. Right-click the `node_modules` folder
2. Select "OneDrive" → "Free up space" or "Always keep on this device"
3. Or exclude it from sync:
   - OneDrive Settings → Sync and backup → Advanced settings
   - Add `node_modules` to exclusion list

### Option 2: Pause OneDrive Temporarily

1. Right-click OneDrive icon in system tray
2. Click "Pause syncing" → "2 hours"
3. Run `npm run db:generate`
4. Resume OneDrive sync

### Option 3: Move Project Outside OneDrive

Move the project to a location like:
- `C:\Projects\bornfidis-platform`
- `C:\dev\bornfidis-platform`

Then run the commands again.

### Option 4: Use WSL (Windows Subsystem for Linux)

If you have WSL installed:
```bash
wsl
cd /mnt/c/Users/18023/OneDrive/Documents/bornfidis-platform
npm run db:generate
```

## Current Status

**Good News:** The app will work without Prisma generate if:
- `DATABASE_URL` is not set → Uses localStorage fallback
- Database features are optional for development

**To Use Database:**
1. Fix the OneDrive issue using one of the options above
2. Set `DATABASE_URL` in `.env.local`
3. Run `npm run db:generate`
4. Run `npm run db:push`

## Quick Workaround

For now, you can:
1. Continue development without database
2. Use localStorage for cart/orders (works fine for dev)
3. Fix OneDrive issue when ready to use database

The app is fully functional without the database - it just uses localStorage instead.


