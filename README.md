# 🚀 AI Design Studio - Vercel Deployment

## Quick Deploy to Vercel

### Step 1: Create MongoDB Atlas Database (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new **FREE** cluster (M0 Sandbox)
3. Create a database user with password
4. Click **Connect** → **Drivers** → Copy the connection string
5. Replace `<password>` with your actual password in the connection string

Your connection string will look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not already):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   cd scarlet-gemini
   vercel
   ```

4. **Add MongoDB URI as Environment Variable**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project → Settings → Environment Variables
   - Add: `MONGODB_URI` = your MongoDB connection string
   - Redeploy the project

### Step 3: Test Your Live Site

After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

Test these pages:
- `/` - Login page
- `/signup.html` - Signup page
- `/dashboard.html` - Dashboard
- `/studio.html` - AI Design Studio
- `/api/health` - Health check

## Project Structure

```
scarlet-gemini/
├── api/
│   ├── login.js          # Auth API
│   ├── signup.js         # Registration API
│   ├── generate-image.js # AI Image Generation
│   └── health.js         # Health check
├── studio.html           # Main AI Studio
├── dashboard.html        # User Dashboard
├── login.html            # Login Page
├── signup.html           # Signup Page
├── styles.css            # Styles
├── vercel.json           # Vercel config
└── package.json          # Dependencies
```

## Features

✅ User Authentication with MongoDB  
✅ AI Image Generation (Pollinations.ai - FREE)  
✅ Design Studio with Fabric.js  
✅ Serverless Functions on Vercel  

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Vercel | 100GB bandwidth/month |
| MongoDB Atlas M0 | 512MB storage |
| Pollinations.ai | Unlimited |
