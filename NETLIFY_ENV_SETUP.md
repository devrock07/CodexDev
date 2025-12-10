# Quick Netlify Environment Variables Setup

## What You Need

Copy these 3 environment variables to Netlify:

```env
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
MONGODB_URI=mongodb+srv://your-connection-string
```

---

## Where to Add Them in Netlify

### Step 1: Go to Your Site Settings
1. Open https://app.netlify.com
2. Click on your site
3. Click **"Site configuration"** (in the top menu)
4. Click **"Environment variables"** (in the left sidebar)

### Step 2: Add Each Variable
Click **"Add a variable"** button and add:

**Variable 1:**
- Key: `UPLOADTHING_SECRET`
- Value: `sk_live_xxxxx` (from Uploadthing dashboard)
- Scopes: ✅ All scopes

**Variable 2:**
- Key: `UPLOADTHING_APP_ID`  
- Value: `xxxxx` (from Uploadthing dashboard)
- Scopes: ✅ All scopes

**Variable 3:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://...` (your MongoDB connection string)
- Scopes: ✅ All scopes

### Step 3: Redeploy
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## Get Uploadthing Keys

1. Go to https://uploadthing.com
2. Sign up (free)
3. Create new app
4. Go to **"API Keys"** section
5. Copy both keys

---

## Test It Works

After deployment:
1. Visit `https://your-site.netlify.app/login`
2. Login to dashboard
3. Click **"CDN Files"**
4. Upload a test file
5. Copy URL and test in Discord

---

That's it! Your CDN will work on Netlify. 🚀
