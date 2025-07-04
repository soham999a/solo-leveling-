# 🚀 Vercel Deployment Guide for LevelUp Life

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **API Keys**: Gather all required API keys

## 🔑 Required Environment Variables

Set these in your Vercel dashboard under **Settings > Environment Variables**:

### Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyDw4vHZDrwO0wf1iUnM-8v7Sy2ZXpp7nCk
VITE_FIREBASE_AUTH_DOMAIN=solo-leveling-2ccb9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=solo-leveling-2ccb9
VITE_FIREBASE_STORAGE_BUCKET=solo-leveling-2ccb9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=749733788294
VITE_FIREBASE_APP_ID=1:749733788294:web:449011e675dad54e9b6f07
VITE_FIREBASE_MEASUREMENT_ID=G-G2TVFCHREJ
```

### AI Configuration
```
VITE_GEMINI_API_KEY=AIzaSyDnXONcQCr0ItuhYQHTGnzZ9UsX3fE3dXc
```

### Production Settings
```
NODE_ENV=production
VITE_DEV_MODE=false
```

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd levelup-life
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **N**
   - Project name: **levelup-life**
   - Directory: **./levelup-life** (or current directory)
   - Override settings? **N**

5. **Set environment variables**:
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   vercel env add VITE_FIREBASE_MEASUREMENT_ID
   vercel env add VITE_GEMINI_API_KEY
   vercel env add NODE_ENV
   ```

6. **Deploy**:
   ```bash
   vercel --prod
   ```

### Method 2: GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import in Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**:
   - Go to **Settings > Environment Variables**
   - Add all the variables listed above
   - Set them for **Production**, **Preview**, and **Development**

4. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete

## 🔧 Build Configuration

The project includes:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.example` - Environment variables template
- ✅ Proper routing for SPA
- ✅ Optimized build settings

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. Go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### Firebase Hosting Setup
Update Firebase console:
1. Go to **Authentication > Settings > Authorized domains**
2. Add your Vercel domain: `your-project.vercel.app`
3. Add any custom domains

## 🔍 Troubleshooting

### Build Errors
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Runtime Errors
- Check browser console for errors
- Verify Firebase configuration
- Test API keys are valid

### Authentication Issues
- Add Vercel domain to Firebase authorized domains
- Check CORS settings
- Verify redirect URLs

## 📊 Performance Optimization

The app is already optimized with:
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Asset optimization
- ✅ Error boundaries
- ✅ Fallback systems

## 🎉 Success!

Your LevelUp Life app should now be live at:
`https://your-project.vercel.app`

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build && npm run preview`
4. Check Firebase console for errors
