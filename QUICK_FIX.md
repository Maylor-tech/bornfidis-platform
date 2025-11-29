# ⚡ QUICK FIX - ChunkLoadError

## The Problem
OneDrive is syncing your `.next` folder, causing Next.js to fail loading chunks.

## ✅ IMMEDIATE FIX (Do This Now)

### Step 1: Stop the Server
Press `Ctrl+C` in your terminal to stop the dev server.

### Step 2: Delete .next Folder
In File Explorer, navigate to your project folder and **delete the `.next` folder completely**.

OR run this in PowerShell:
```powershell
cd "C:\Users\18023\OneDrive\Documents\bornfidis-platform"
Remove-Item -Recurse -Force .next
```

### Step 3: Exclude .next from OneDrive
1. Right-click the `.next` folder (if it recreates)
2. Go to **OneDrive** → **Free up space** 
3. OR in OneDrive Settings, exclude `.next` from sync

### Step 4: Restart Server
```bash
npm run dev
```

---

## 🎯 PERMANENT FIX

**Best Solution:** Move your project OUT of OneDrive:

1. Move project to: `C:\Projects\bornfidis-platform` (or any non-OneDrive folder)
2. Update your code editor to point to new location
3. Run `npm install` in new location
4. Run `npm run dev`

---

## ✅ What I Fixed

- ✅ Cleaned `.next` folder
- ✅ Updated Next.js config for better chunk handling
- ✅ Removed unused imports
- ✅ Fixed webpack configuration

**Now just restart your server and it should work!**

```bash
npm run dev
```

If you still see errors, the OneDrive sync is the issue - exclude `.next` from OneDrive sync.

