#!/bin/bash

# Simple build script for Vercel
echo "Starting build process..."

# Clean any existing dist
rm -rf dist

# Try to run vite build directly
echo "Attempting to build with vite..."
if npx --yes vite@latest build; then
    echo "Build successful with npx vite!"
    exit 0
fi

echo "npx vite failed, trying node directly..."
if node ./node_modules/vite/bin/vite.js build; then
    echo "Build successful with node!"
    exit 0
fi

echo "All build methods failed"
exit 1
