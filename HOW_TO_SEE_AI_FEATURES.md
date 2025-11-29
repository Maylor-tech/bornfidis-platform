# 🎯 HOW TO SEE THE AI FEATURES - Step by Step

## ✅ You've Added API Keys - Now Let's See Them!

### Step 1: RESTART YOUR SERVER (IMPORTANT!)

**Environment variables only load when the server starts!**

1. **Stop your current server:**
   - In your terminal, press `Ctrl+C`
   - Wait for it to stop completely

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to say:**
   ```
   ✓ Ready in X seconds
   ○ Local: http://localhost:3000
   ```

---

### Step 2: Go to the Customize Page

1. **Open your browser**
2. **Go to:** http://localhost:3000/customize
3. **You should see:**
   - Page title: "Customize Your Experience"
   - Two tabs: "👕 Custom Clothing" and "👨‍🍳 Chef Services"
   - "👕 Custom Clothing" should be selected (coral/orange background)

---

### Step 3: Find the AI Design Assistant

**Scroll down on the page and look for:**

1. **First section:** "Select Product & Base Color"
   - Product dropdown
   - Color swatches

2. **Second section (THIS IS THE AI!):** 
   - **"🎨 AI Design Assistant"** heading
   - White box with:
     - Text area: "Describe your design"
     - Dropdown: "Style" (Modern, Minimalist, etc.)
     - **Button: "✨ Generate Design"**
     - Tips section below

**If you don't see it:**
- Make sure you're on the "👕 Custom Clothing" tab (not Chef Services)
- Scroll down - it's below the product/color selection
- Check browser console (F12) for errors

---

### Step 4: Test the AI Feature

1. **In the text area, type:**
   ```
   Mountain landscape with coral sunset, minimalist style
   ```

2. **Select a style** from dropdown (e.g., "Minimalist")

3. **Click:** "✨ Generate Design" button

4. **What should happen:**
   - Button shows "Generating..." 
   - After 10-30 seconds, a design appears
   - Design shows in preview section
   - Design automatically added to canvas below

---

### Step 5: Check Chef AI (Optional)

1. **Click:** "👨‍🍳 Chef Services" tab
2. **Fill in:**
   - Dietary preferences
   - Cuisine style
   - Number of courses
3. **Click:** "✨ Generate AI Menu" button

---

## 🔍 TROUBLESHOOTING

### "I don't see the AI section"

**Check:**
1. ✅ Are you on `/customize` page? (not `/shop` or `/about`)
2. ✅ Is "👕 Custom Clothing" tab selected? (should be coral/orange)
3. ✅ Did you scroll down? (it's below product selection)
4. ✅ Did you restart the server after adding API keys?

**Try:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console (F12) for errors

---

### "I see it but button doesn't work"

**Check:**
1. ✅ Did you restart server after adding `.env.local`?
2. ✅ Is API key correct in `.env.local`?
   - Should be: `OPENAI_API_KEY=sk-...`
   - No spaces around `=`
   - No quotes needed
3. ✅ Check terminal for errors when clicking button

**Test API key:**
- Open browser console (F12)
- Click "Generate Design"
- Look for error message
- Should NOT say "API key not found"

---

### "Button shows error"

**Common errors:**

1. **"Failed to generate design"**
   - Check `.env.local` has correct key
   - Restart server
   - Check OpenAI account has credits

2. **"API key not found"**
   - Key not in `.env.local`
   - File named wrong (should be `.env.local` not `.env`)
   - Server not restarted

3. **"Rate limit exceeded"**
   - Too many requests
   - Wait a few minutes
   - Check OpenAI dashboard

---

## 📍 EXACT LOCATION ON PAGE

**Page Structure:**
```
/customize page
├── Header: "Customize Your Experience"
├── Tabs: [👕 Custom Clothing] [👨‍🍳 Chef Services]
├── Section 1: "Select Product & Base Color"
│   ├── Product dropdown
│   └── Color swatches
├── Section 2: "🎨 AI Design Assistant" ← THIS IS IT!
│   ├── Text area
│   ├── Style dropdown
│   └── "✨ Generate Design" button
├── Section 3: Generated Design Preview (appears after generation)
└── Section 4: Design Canvas
```

---

## ✅ QUICK CHECKLIST

- [ ] Server restarted after adding API keys?
- [ ] On `/customize` page?
- [ ] "👕 Custom Clothing" tab selected?
- [ ] Scrolled down past product selection?
- [ ] See "🎨 AI Design Assistant" section?
- [ ] See "✨ Generate Design" button?

**If all checked, the AI should be visible!**

---

## 🎯 STILL NOT SEEING IT?

**Take a screenshot and check:**
1. What page are you on? (URL should be `localhost:3000/customize`)
2. What tab is selected? (should be "Custom Clothing")
3. What do you see? (describe the sections)

**Or try:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share what you see

---

## 🚀 ONCE YOU SEE IT

**The AI section should look like:**
- White box with border
- Heading: "🎨 AI Design Assistant"
- Text area for design description
- Style dropdown
- Coral/orange "✨ Generate Design" button
- Tips section at bottom

**That's the AI feature!** Just add your design idea and click generate! 🎉


