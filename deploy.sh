#!/bin/bash

# Arovi Frontend Deployment Script

echo "🚀 Starting Arovi Frontend Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set production environment
export REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'build' directory"
    echo ""
    echo "🌐 Your app is ready to deploy!"
    echo "📋 Next steps:"
    echo "   1. Upload the 'build' folder to your hosting platform"
    echo "   2. Or use one of the deployment options in deployment-config.md"
    echo ""
    echo "🔗 Backend URL: https://arovi-backend.onrender.com"
    echo "⚙️  Environment variable set: REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
