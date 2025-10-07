# 🕵️ Anonymous Deployment Guide - Info Peruana de Cine

## 🎭 Maintaining Complete Anonymity

### Option 1: Deploy via GitHub (Recommended - Most Anonymous)

#### Step 1: Push to Your Anonymous GitHub
```bash
# Push your code to your anonymous GitHub repo
git push origin anonymous-main
```

#### Step 2: Connect GitHub to Vercel Anonymously
1. Go to https://vercel.com
2. **Sign up with a new anonymous email** (use ProtonMail: inforealdecine@proton.me)
3. Choose **"Continue with GitHub"** 
4. Connect your **anonymous GitHub account** (infoperuanadecine)
5. Import the **infoperuanadecine** repository
6. Deploy from the **anonymous-main** branch

### Option 2: Deploy via Vercel CLI (Alternative)

#### Step 1: Create Anonymous Vercel Account
```bash
# Login with anonymous credentials
vercel login
# Use: inforealdecine@proton.me
```

#### Step 2: Deploy Anonymously
```bash
# Deploy with anonymous settings
vercel --name info-peruana-de-cine-anon
```

## 🔐 Anonymous Environment Variables Setup

Once deployed, add these environment variables in Vercel dashboard:

```
MONGODB_URI = mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster

TMDB_API_KEY = dec9b4176986e6d1333c7b017cca6488

NODE_ENV = production
```

## 🌐 Your Anonymous Domains

Vercel will provide anonymous URLs like:
- `https://info-peruana-de-cine-anon.vercel.app`
- `https://infoperuanadecine.vercel.app`

## 🛡️ Privacy Protection Features

✅ **Anonymous GitHub Repository** - No personal connection
✅ **Anonymous Vercel Account** - Uses ProtonMail
✅ **Anonymous MongoDB Atlas** - Uses fake credentials
✅ **No Personal Information** - All data is anonymized
✅ **Clean Git History** - No identifying commits

## 📱 Anonymous Movie Management

After deployment, manage movies anonymously:

### Method 1: Local Script (Most Secure)
```bash
# Run from your local machine (completely anonymous)
node add-movie-to-live.js
```

### Method 2: MongoDB Atlas Web Interface
1. Login to MongoDB Atlas with anonymous credentials
2. Browse Collections → moviedb → movies
3. Insert/Update documents directly
4. Changes appear on live site immediately

### Method 3: Anonymous API Calls
```bash
# Use curl or Postman anonymously
curl -X POST https://your-anonymous-site.vercel.app/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"New Movie","year":2024,"available":true}'
```

## 🚨 Anonymity Checklist

Before going live, verify:

- [ ] GitHub repository owner: **infoperuanadecine** (anonymous)
- [ ] Vercel account email: **inforealdecine@proton.me** (anonymous)  
- [ ] MongoDB Atlas account: **anonymous credentials**
- [ ] No personal information in code or commits
- [ ] Domain doesn't contain your real name
- [ ] Git history is clean of personal data

## 🔄 Anonymous Updates

To update your anonymous site:

```bash
# Make changes locally
git add .
git commit -m "Anonymous update"
git push origin anonymous-main

# Vercel auto-deploys from GitHub (completely anonymous)
```

## 💡 Pro Anonymous Tips

1. **Use VPN** when managing the site
2. **Clear browser data** after each session
3. **Use incognito/private browsing** for all admin tasks
4. **Keep credentials in encrypted storage** (not browser passwords)
5. **Use anonymous payment methods** if upgrading Vercel (crypto, prepaid cards)

Your entire movie hosting platform will be completely anonymous! 🕵️‍♂️🇵🇪