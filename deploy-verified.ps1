# HP Camera - Verified Deployment Script
# This script includes verification steps

Write-Host "🚀 HP Camera - Verified Deployment" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Step 1: Clean
Write-Host "🧹 Step 1: Cleaning old build..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "✅ Cleaned dist folder" -ForegroundColor Green
}
Write-Host ""

# Step 2: Install
Write-Host "📦 Step 2: Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Build
Write-Host "🔨 Step 3: Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Verify Build
Write-Host "🔍 Step 4: Verifying build..." -ForegroundColor Cyan

if (-not (Test-Path "dist/index.html")) {
    Write-Host "❌ dist/index.html not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ index.html exists" -ForegroundColor Green

if (-not (Test-Path "dist/assets")) {
    Write-Host "❌ dist/assets folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ assets folder exists" -ForegroundColor Green

$indexContent = Get-Content "dist/index.html" -Raw
if ($indexContent -match "index-.*\.js") {
    Write-Host "✅ JavaScript bundle found" -ForegroundColor Green
} else {
    Write-Host "❌ JavaScript bundle not found in index.html!" -ForegroundColor Red
    exit 1
}

if ($indexContent -match "index-.*\.css") {
    Write-Host "✅ CSS bundle found" -ForegroundColor Green
} else {
    Write-Host "⚠️  CSS bundle not found (might be optional)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Check Firebase
Write-Host "🔥 Step 5: Checking Firebase..." -ForegroundColor Cyan

$firebaseCmd = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseCmd) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Install with: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Firebase CLI installed" -ForegroundColor Green

# Check login
$loginCheck = firebase login:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Firebase!" -ForegroundColor Red
    Write-Host "Run: firebase login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Logged in to Firebase" -ForegroundColor Green

# Check project
$projectCheck = firebase projects:list 2>&1
if ($projectCheck -match "bub-ai") {
    Write-Host "✅ Project 'bub-ai' found" -ForegroundColor Green
} else {
    Write-Host "❌ Project 'bub-ai' not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Deploy
Write-Host "🚀 Step 6: Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""

# Step 7: Verify Deployment
Write-Host "🔍 Step 7: Verifying deployment..." -ForegroundColor Cyan

Write-Host "Testing URL: https://bub-ai.web.app" -ForegroundColor White
$response = Invoke-WebRequest -Uri "https://bub-ai.web.app" -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "✅ Site is live and responding!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Site returned status: $($response.StatusCode)" -ForegroundColor Yellow
}
Write-Host ""

# Success Summary
Write-Host "=================================" -ForegroundColor Green
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is live at:" -ForegroundColor Cyan
Write-Host "   https://bub-ai.web.app" -ForegroundColor White
Write-Host "   https://bub-ai.firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "📱 HP Camera routes:" -ForegroundColor Cyan
Write-Host "   https://bub-ai.web.app/hp-cam" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Hard refresh browser: Ctrl + Shift + R" -ForegroundColor White
Write-Host "   - Check console: F12 → Console tab" -ForegroundColor White
Write-Host "   - View deployment: firebase open hosting:site" -ForegroundColor White
Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
