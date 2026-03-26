#!/bin/bash

# HP Camera Module - Firebase Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Firebase Deployment..."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if logged in
echo "🔐 Checking Firebase login..."
firebase login:list

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🌐 Your app is live at:"
echo "   https://bub-ai.web.app"
echo "   https://bub-ai.firebaseapp.com"
echo ""
echo "📱 HP Camera routes:"
echo "   https://bub-ai.web.app/hp-cam"
echo ""
echo "🎉 Done!"
