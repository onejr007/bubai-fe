# HP Camera Module - Firebase Deployment Script (PowerShell)
# Usage: .\deploy.ps1

Write-Host "🚀 Starting Firebase Deployment..." -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is installed
$firebaseCmd = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseCmd) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Check if logged in
Write-Host "🔐 Checking Firebase login..." -ForegroundColor Cyan
firebase login:list

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Build application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy to Firebase
Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is live at:" -ForegroundColor Cyan
Write-Host "   https://bub-ai.web.app" -ForegroundColor White
Write-Host "   https://bub-ai.firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "📱 HP Camera routes:" -ForegroundColor Cyan
Write-Host "   https://bub-ai.web.app/hp-cam" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
