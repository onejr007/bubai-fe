# 🔥 Firebase Hosting - HP Camera Module

## 📋 Overview

HP Camera Module telah dikonfigurasi untuk deployment ke Firebase Hosting dengan project ID: `bub-ai`

## 🌐 Live URLs

### Production
- **Primary:** https://bub-ai.web.app
- **Secondary:** https://bub-ai.firebaseapp.com

### HP Camera Routes
- **Pairing:** https://bub-ai.web.app/hp-cam
- **Mobile:** https://bub-ai.web.app/hp-cam/mobile/:sessionId
- **Viewer:** https://bub-ai.web.app/hp-cam/viewer/:sessionId

## 🚀 Quick Deploy

### Option 1: Automated Script (Recommended)

**Windows (PowerShell):**
```powershell
cd FE
.\deploy.ps1
```

**Linux/Mac (Bash):**
```bash
cd FE
chmod +x deploy.sh
./deploy.sh
```

### Option 2: NPM Scripts
```bash
cd FE
npm run deploy              # Build + Deploy
npm run deploy:hosting      # Deploy hosting only
```

### Option 3: Manual
```bash
cd FE
npm install
npm run build
firebase deploy --only hosting
```

## 📦 Configuration Files

### Firebase Configuration
- **`.firebaserc`** - Project configuration
- **`firebase.json`** - Hosting configuration
- **`src/config/firebase.ts`** - Firebase SDK initialization
- **`.env.production`** - Production environment variables

### Deployment Scripts
- **`deploy.sh`** - Bash deployment script
- **`deploy.ps1`** - PowerShell deployment script

### Documentation
- **`FIREBASE_DEPLOYMENT.md`** - Complete deployment guide
- **`DEPLOY_NOW.md`** - Quick deployment guide
- **`DEPLOYMENT_CHECKLIST.md`** - Deployment checklist

## 🔧 Firebase Project Details

```javascript
Project ID: bub-ai
Auth Domain: bub-ai.firebaseapp.com
Storage Bucket: bub-ai.firebasestorage.app
Messaging Sender ID: 864909635750
App ID: 1:864909635750:web:7887a89baddda127154467
Measurement ID: G-C4M2ZMEGSL
```

## ✨ Features Configured

### Hosting
- ✅ HTTPS automatic
- ✅ SSL certificate managed
- ✅ Global CDN
- ✅ SPA routing configured
- ✅ Cache headers optimized
- ✅ Security headers configured

### Analytics
- ✅ Google Analytics integrated
- ✅ Event tracking ready
- ✅ Performance monitoring

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 📱 Camera Permissions

### HTTPS Required
- ✅ Firebase provides automatic HTTPS
- ✅ Camera API requires secure context
- ✅ All routes use HTTPS

### Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Edge 90+ ✅
- Safari 14+ ✅
- Chrome Mobile 90+ ✅
- Safari iOS 14+ ✅

## 🧪 Testing After Deploy

### 1. Basic Test
```bash
# Check if site is live
curl -I https://bub-ai.web.app

# Should return: 200 OK
```

### 2. HP Camera Test
1. Open: https://bub-ai.web.app/hp-cam
2. Verify QR Code appears
3. Scan with phone
4. Approve camera permission
5. Verify streaming works

### 3. HTTPS Test
```bash
# Check SSL certificate
openssl s_client -connect bub-ai.web.app:443

# Check security headers
curl -I https://bub-ai.web.app
```

## 📊 Monitoring

### Firebase Console
- **Hosting:** https://console.firebase.google.com/project/bub-ai/hosting
- **Analytics:** https://console.firebase.google.com/project/bub-ai/analytics
- **Performance:** https://console.firebase.google.com/project/bub-ai/performance

### Commands
```bash
# List deployments
firebase hosting:channel:list

# Open hosting dashboard
firebase open hosting:site

# View deployment history
firebase hosting:channel:open production
```

## 🔄 CI/CD (Optional)

### GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd FE && npm ci
      - run: cd FE && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: bub-ai
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Errors
```bash
# Re-authenticate
firebase logout
firebase login

# Verify project
firebase use bub-ai

# Deploy again
firebase deploy --only hosting
```

### Camera Not Working
1. Verify HTTPS is active
2. Check browser permissions
3. Test on different device
4. Check console for errors

## 📝 Deployment Checklist

Before deploying:
- [ ] All tests passed
- [ ] Build successful
- [ ] Firebase CLI installed
- [ ] Logged in to Firebase
- [ ] Project selected: `bub-ai`

After deploying:
- [ ] Site accessible
- [ ] HTTPS working
- [ ] QR Code generation works
- [ ] Camera permission works
- [ ] Streaming works
- [ ] Analytics tracking

## 🔐 Security Best Practices

### Production Recommendations
1. ✅ HTTPS (automatic with Firebase)
2. ⚠️ Add authentication for sensitive features
3. ⚠️ Implement session expiry (24h)
4. ⚠️ Add rate limiting
5. ⚠️ Monitor usage and errors

### Current Security
- Random session IDs
- LocalStorage only
- No external server
- Camera permission required
- HTTPS enforced

## 📚 Documentation

### Quick Links
- [Quick Deploy](./DEPLOY_NOW.md) - 5 minute guide
- [Full Guide](./FIREBASE_DEPLOYMENT.md) - Complete deployment guide
- [Checklist](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [HP Camera Docs](./src/modules/hp-cam/DOCS_INDEX.md) - Module documentation

### Support
- Firebase Docs: https://firebase.google.com/docs/hosting
- Firebase Console: https://console.firebase.google.com
- HP Camera Issues: Check console and logs

## 🎉 Success!

Once deployed, your HP Camera module will be live at:

```
🌐 https://bub-ai.web.app/hp-cam
```

Share this URL to start using HP Camera pairing!

---

## 📞 Need Help?

1. Check [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) for detailed guide
2. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step
3. Check Firebase Console for logs and errors
4. Check browser console for client-side errors

---

**Project:** bub-ai
**Status:** ✅ Ready to Deploy
**Last Updated:** 2026-03-26

**Deploy now with:** `.\deploy.ps1` or `./deploy.sh`
