# 🔧 Fix OneDrive Sync Issue

## The Problem

OneDrive is syncing your `.next` folder, which causes Next.js build errors. The `.next` folder should NOT be synced to OneDrive.

## ✅ Solution

### Option 1: Exclude .next from OneDrive (Recommended)

1. Right-click on the `.next` folder in File Explorer
2. Select **OneDrive** → **Free up space** (or **Always keep on this device**)
3. Or go to OneDrive Settings → Sync and Backup → Advanced Settings
4. Add `.next` to the exclusion list

### Option 2: Move Project Outside OneDrive

Move your project to a location OneDrive doesn't sync:
- `C:\Projects\bornfidis-platform`
- `C:\Dev\bornfidis-platform`
- `C:\Users\18023\Documents\bornfidis-platform` (if Documents isn't synced)

### Option 3: Use .onedriveignore (if available)

Create a `.onedriveignore` file in your project root:
```
.next/
node_modules/
.env.local
```

## 🚀 After Fixing

1. Delete `.next` folder completely
2. Restart your dev server:
   ```bash
   npm run dev
   ```

## ✅ Quick Fix Right Now

I've already:
- ✅ Cleaned the `.next` folder
- ✅ Fixed the webpack config
- ✅ Removed unused imports

**Just restart your server:**
```bash
npm run dev
```

If it still errors, the OneDrive sync is the issue - use Option 1 above.

