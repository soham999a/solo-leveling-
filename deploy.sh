#!/bin/bash

# LevelUp Life Deployment Script
echo "🚀 Starting LevelUp Life deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' directory"
    echo ""
    echo "🌐 To deploy to Vercel:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repo to Vercel"
    echo "3. Set environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Optional: Preview the build locally
read -p "🔍 Would you like to preview the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting preview server..."
    npm run preview
fi

echo "🎉 Deployment preparation complete!"
