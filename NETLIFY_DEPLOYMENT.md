# Netlify Deployment Guide for Codex CDN

## Prerequisites

1. ✅ Uploadthing account created at https://uploadthing.com
2. ✅ Uploadthing API keys ready
3. ✅ MongoDB connection string ready
4. ✅ GitHub repository with your code

---

## Step 1: Get Uploadthing API Keys

1. Go to https://uploadthing.com
2. Sign up (free tier: 2GB storage, 2GB bandwidth/month)
3. Create a new app
4. Go to **API Keys** section
5. Copy both:
   - `UPLOADTHING_SECRET` (starts with `sk_live_...`)
   - `UPLOADTHING_APP_ID`

---

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Framework**: Next.js

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

---

## Step 3: Add Environment Variables in Netlify

### Via Netlify Dashboard:

1. Go to your site in Netlify dashboard
2. Click **"Site configuration"** → **"Environment variables"**
3. Click **"Add a variable"** and add each of these:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Uploadthing CDN
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx

# Next.js
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### Via Netlify CLI:

```bash
# Set environment variables
netlify env:set MONGODB_URI "your-mongodb-uri"
netlify env:set UPLOADTHING_SECRET "sk_live_xxxxx"
netlify env:set UPLOADTHING_APP_ID "your-app-id"
netlify env:set NEXT_PUBLIC_APP_URL "https://your-site.netlify.app"
```

---

## Step 4: Configure Next.js for Netlify

Your `next.config.js` should already be configured, but verify it has:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'], // Uploadthing CDN domain
  },
};

module.exports = nextConfig;
```

---

## Step 5: Redeploy

After adding environment variables:

1. **Via Dashboard**: Click **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**
2. **Via CLI**: `netlify deploy --prod`

---

## Step 6: Test Your CDN

1. Visit `https://your-site.netlify.app/login`
2. Login with staff credentials
3. Go to **Dashboard** → **CDN Files**
4. Upload a test image or ZIP file
5. Copy the URL
6. Test the URL in Discord to verify embeds work

---

## Environment Variables Summary

Here's what you need in Netlify:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `UPLOADTHING_SECRET` | Uploadthing secret key | `sk_live_xxxxx` |
| `UPLOADTHING_APP_ID` | Uploadthing app ID | `xxxxx` |
| `NEXT_PUBLIC_APP_URL` | Your site URL | `https://yoursite.netlify.app` |

---

## Troubleshooting

### Build Fails

**Error**: "Module not found: uploadthing"
- **Solution**: Make sure `package.json` includes uploadthing dependencies
- Run `npm install` locally first

### Upload Fails

**Error**: "Unauthorized"
- **Solution**: Check that `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` are set correctly in Netlify
- Verify you're logged in as staff

### Files Not Loading

**Error**: CORS or network issues
- **Solution**: Add Uploadthing domain to `next.config.js`:
  ```javascript
  images: {
    domains: ['utfs.io', 'uploadthing.com'],
  }
  ```

### Discord Embeds Not Working

**Issue**: Links don't show previews
- **Solution**: 
  1. Verify meta tags are rendering (view page source)
  2. Test with Discord's embed tester
  3. Make sure file is accessible (not deleted)

---

## Production Checklist

- [ ] Uploadthing account created
- [ ] API keys copied
- [ ] Environment variables added to Netlify
- [ ] Site deployed successfully
- [ ] Test file upload works
- [ ] Test file download works
- [ ] Test Discord embed works
- [ ] Test on mobile device

---

## Monitoring

### Uploadthing Dashboard
- Check storage usage
- Monitor bandwidth
- View upload activity

### Netlify Dashboard
- Monitor build logs
- Check function logs
- View bandwidth usage

---

## Upgrading Uploadthing Plan

If you need more storage/bandwidth:

1. Go to Uploadthing dashboard
2. Click **"Upgrade"**
3. Choose a plan:
   - **Hobby**: $10/mo - 10GB storage, 100GB bandwidth
   - **Pro**: $30/mo - 100GB storage, 1TB bandwidth

---

## Security Notes

✅ **Already Implemented**:
- Files only uploadable by authenticated staff
- No public file listing
- Secure authentication via cookies
- Environment variables not exposed to client

⚠️ **Best Practices**:
- Never commit `.env.local` to Git
- Rotate API keys periodically
- Monitor Uploadthing usage
- Set up Netlify deploy notifications

---

## Quick Reference

**Upload a file**:
1. Login → Dashboard → CDN Files
2. Click "Upload File" or drag-and-drop
3. Click "Copy URL"
4. Share anywhere!

**Share in Discord**:
- Just paste the URL
- Images auto-embed with preview
- ZIPs show download card

**Delete a file**:
1. Go to CDN Files
2. Click trash icon
3. Confirm deletion

---

## Support

- **Uploadthing Docs**: https://docs.uploadthing.com
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs

Your CDN is now production-ready on Netlify! 🚀
