# 🚀 GitHub + Vercel Deployment Guide

## 📋 VERCEL ENVIRONMENT VARIABLES

Copy these **EXACT** environment variables to your Vercel dashboard:

### 🔑 Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyDw4vHZDrwO0wf1iUnM-8v7Sy2ZXpp7nCk
VITE_FIREBASE_AUTH_DOMAIN=solo-leveling-2ccb9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=solo-leveling-2ccb9
VITE_FIREBASE_STORAGE_BUCKET=solo-leveling-2ccb9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=749733788294
VITE_FIREBASE_APP_ID=1:749733788294:web:449011e675dad54e9b6f07
VITE_FIREBASE_MEASUREMENT_ID=G-G2TVFCHREJ
```

### 🤖 AI Configuration
```
VITE_GEMINI_API_KEY=AIzaSyDnXONcQCr0ItuhYQHTGnzZ9UsX3fE3dXc
```

## 📂 STEP 1: Prepare Your Project

### Check Your Files
Make sure these files exist in your `levelup-life` folder:
- ✅ `.gitignore` (protects your secrets)
- ✅ `package.json` (project configuration)
- ✅ `vercel.json` (deployment settings)
- ✅ `README.md` (project documentation)
- ✅ All source code in `src/` folder

### Verify .gitignore
Your `.gitignore` file now protects:
- ✅ Environment variables (`.env` files)
- ✅ Node modules
- ✅ Build outputs
- ✅ API keys and secrets
- ✅ OS and editor files

## 📤 STEP 2: Push to GitHub

### Option A: Create New Repository on GitHub
1. **Go to GitHub.com**
2. **Click "New Repository"**
3. **Repository Name**: `levelup-life` (or your preferred name)
4. **Description**: `Gamified productivity platform inspired by Solo Leveling`
5. **Set to Public** (or Private if you prefer)
6. **DON'T initialize with README** (you already have one)
7. **Click "Create Repository"**

### Option B: Manual Git Commands

Open terminal/command prompt in your `levelup-life` folder and run:

```bash
# Initialize git repository
git init

# Add all files (gitignore will protect secrets)
git add .

# Make first commit
git commit -m "Initial commit: LevelUp Life productivity platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name!**

### Example Commands:
If your GitHub username is `john123` and repository is `levelup-life`:
```bash
git remote add origin https://github.com/john123/levelup-life.git
git push -u origin main
```

## 🚀 STEP 3: Deploy to Vercel

### 1. Go to Vercel Dashboard
- Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
- Sign in with GitHub account

### 2. Import Your Repository
- Click **"New Project"**
- Find your `levelup-life` repository
- Click **"Import"**

### 3. Configure Project Settings
- **Framework Preset**: Select **"Vite"**
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### 4. Add Environment Variables
In the **Environment Variables** section, add each variable:

**Variable Name** → **Value**
```
VITE_FIREBASE_API_KEY → AIzaSyDw4vHZDrwO0wf1iUnM-8v7Sy2ZXpp7nCk
VITE_FIREBASE_AUTH_DOMAIN → solo-leveling-2ccb9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID → solo-leveling-2ccb9
VITE_FIREBASE_STORAGE_BUCKET → solo-leveling-2ccb9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID → 749733788294
VITE_FIREBASE_APP_ID → 1:749733788294:web:449011e675dad54e9b6f07
VITE_FIREBASE_MEASUREMENT_ID → G-G2TVFCHREJ
VITE_GEMINI_API_KEY → AIzaSyDnXONcQCr0ItuhYQHTGnzZ9UsX3fE3dXc
```

**IMPORTANT**: Set each variable for **Production**, **Preview**, and **Development** environments.

### 5. Deploy
- Click **"Deploy"**
- Wait for build to complete (2-3 minutes)
- Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 STEP 4: Post-Deployment Setup

### Update Firebase Console
1. **Go to**: [console.firebase.google.com](https://console.firebase.google.com)
2. **Select your project**: `solo-leveling-2ccb9`
3. **Go to**: Authentication → Settings → Authorized domains
4. **Add your Vercel domain**: `your-project-name.vercel.app`
5. **Save changes**

### Test Your Deployment
- ✅ Visit your Vercel URL
- ✅ Try signing up with email
- ✅ Try Google sign-in
- ✅ Check 3D scenes load
- ✅ Test AI features
- ✅ Verify mobile responsiveness

## 🔄 STEP 5: Future Updates

### To Update Your App:
```bash
# Make your changes to the code
# Then commit and push:
git add .
git commit -m "Description of your changes"
git push origin main
```

**Vercel will automatically redeploy** when you push to GitHub!

## 🚨 TROUBLESHOOTING

### Build Fails?
- Check environment variables are set correctly in Vercel
- Verify all variable names start with `VITE_`
- Check build logs in Vercel dashboard

### Authentication Not Working?
- Ensure Vercel domain is added to Firebase authorized domains
- Check Firebase console for error messages
- Verify API keys are correct

### 3D Scenes Not Loading?
- Check browser console for errors
- Verify on modern browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices

## 📞 NEED HELP?

### Quick Checks:
1. **Environment Variables**: All 8 variables set in Vercel?
2. **Firebase Domain**: Added Vercel URL to authorized domains?
3. **Build Logs**: Any errors in Vercel deployment logs?
4. **Browser Console**: Any JavaScript errors?

### Resources:
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Project README**: See `README.md` in your repository

---

## 🎉 SUCCESS!

Once deployed, your **LevelUp Life** productivity platform will be live and accessible worldwide!

**Your app URL**: `https://your-project-name.vercel.app`

**Features that will work**:
- ✅ User authentication (Google + Email)
- ✅ 3D avatar and environments
- ✅ AI-powered coaching and habits
- ✅ Gamified productivity tracking
- ✅ Mobile-responsive design
- ✅ Real-time data sync

**Ready to level up your productivity game!** 🎮✨
