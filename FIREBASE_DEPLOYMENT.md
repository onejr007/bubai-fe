# Firebase Deployment Guide - HP Camera Module

## 🔥 Firebase Hosting Setup

### Prerequisites
- Firebase CLI installed
- Firebase project: `bub-ai`
- Node.js 18+

## 📋 Quick Deploy

### 1. Install Firebase CLI (jika belum)
```bash
npm install -g firebase-tools
```

### 2. Login ke Firebase
```bash
firebase login
```

### 3. Build Aplikasi
```bash
cd FE
npm install
npm run build
```

### 4. Deploy ke Firebase
```bash
firebase deploy
```

### 5. Akses Aplikasi
```
https://bub-ai.web.app/hp-cam
https://bub-ai.firebaseapp.com/hp-cam
```

## 🔧 Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      // Security headers configured
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "bub-ai"
  }
}
```

## 🚀 Deployment Steps Detail

### Step 1: Prepare Build
```bash
cd FE

# Install dependencies
npm install

# Build for production
npm run build

# Verify build
ls -la dist/
```

### Step 2: Test Locally
```bash
# Preview production build
npm run preview

# Or use Firebase emulator
firebase serve
```

### Step 3: Deploy
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy with message
firebase deploy --only hosting -m "Deploy HP Camera v1.0.0"
```

### Step 4: Verify Deployment
```bash
# Check deployment status
firebase hosting:channel:list

# Open in browser
firebase open hosting:site
```

## 🌐 URLs

### Production URLs
- Primary: `https://bub-ai.web.app`
- Secondary: `https://bub-ai.firebaseapp.com`

### HP Camera Routes
- Pairing: `https://bub-ai.web.app/hp-cam`
- Mobile: `https://bub-ai.web.app/hp-cam/mobile/:sessionId`
- Viewer: `https://bub-ai.web.app/hp-cam/viewer/:sessionId`

## 📱 Testing After Deploy

### Test 1: QR Code Generation
1. Buka: `https://bub-ai.web.app/hp-cam`
2. Verify QR Code muncul
3. Check console untuk errors

### Test 2: Mobile Camera
1. Scan QR Code dengan HP
2. Verify redirect ke HTTPS URL
3. Test camera permission
4. Verify streaming works

### Test 3: HTTPS & Security
```bash
# Check SSL
curl -I https://bub-ai.web.app

# Check headers
curl -I https://bub-ai.web.app/hp-cam
```

## 🔐 Security Configuration

### HTTPS
✅ Firebase Hosting provides automatic HTTPS
✅ SSL certificate managed by Firebase
✅ HTTP automatically redirects to HTTPS

### Security Headers (Configured)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Camera Permissions
- ✅ HTTPS required for camera access
- ✅ User must approve permission
- ✅ Permission saved per domain

## 📊 Firebase Analytics

Analytics sudah dikonfigurasi:
```typescript
// src/config/firebase.ts
import { getAnalytics } from "firebase/analytics";
export const analytics = getAnalytics(app);
```

### Track Events
```typescript
import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';

// Track pairing
logEvent(analytics, 'pairing_started');

// Track camera approval
logEvent(analytics, 'camera_approved');

// Track streaming
logEvent(analytics, 'streaming_started');
```

## 🔄 CI/CD with GitHub Actions

### .github/workflows/firebase-deploy.yml
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
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd FE
          npm ci
      
      - name: Build
        run: |
          cd FE
          npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: bub-ai
```

## 🎯 Custom Domain (Optional)

### Add Custom Domain
```bash
# Add domain via Firebase Console
firebase hosting:channel:deploy production --only hosting

# Or via CLI
firebase hosting:sites:create your-domain.com
```

### DNS Configuration
```
Type: A
Name: @
Value: [Firebase IP]

Type: A
Name: www
Value: [Firebase IP]
```

## 📈 Monitoring

### Firebase Console
- Hosting: https://console.firebase.google.com/project/bub-ai/hosting
- Analytics: https://console.firebase.google.com/project/bub-ai/analytics
- Performance: https://console.firebase.google.com/project/bub-ai/performance

### Check Deployment
```bash
# List deployments
firebase hosting:channel:list

# View deployment details
firebase hosting:channel:open production
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Errors
```bash
# Re-login
firebase logout
firebase login

# Check project
firebase projects:list
firebase use bub-ai
```

### Camera Not Working
- ✅ Verify HTTPS is active
- ✅ Check browser permissions
- ✅ Test on different devices
- ✅ Check console errors

## 🔄 Rollback

### Rollback to Previous Version
```bash
# List versions
firebase hosting:channel:list

# Rollback
firebase hosting:rollback
```

## 📝 Deployment Checklist

### Pre-Deploy
- [ ] All tests passed
- [ ] Build successful
- [ ] No console errors
- [ ] Firebase CLI installed
- [ ] Logged in to Firebase

### Deploy
- [ ] `npm run build` success
- [ ] `firebase deploy` success
- [ ] Deployment URL received
- [ ] Site accessible

### Post-Deploy
- [ ] Test QR generation
- [ ] Test mobile camera
- [ ] Test PC viewer
- [ ] Check analytics
- [ ] Monitor errors

## 💡 Tips

### Faster Deploys
```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy specific site
firebase deploy --only hosting:bub-ai
```

### Preview Channels
```bash
# Create preview
firebase hosting:channel:deploy preview

# Test before production
firebase hosting:channel:open preview
```

### Environment Variables
```bash
# Set Firebase config
firebase functions:config:set app.url="https://bub-ai.web.app"

# Get config
firebase functions:config:get
```

## 🎉 Success!

Setelah deploy berhasil:

1. ✅ Aplikasi live di `https://bub-ai.web.app`
2. ✅ HTTPS otomatis aktif
3. ✅ Camera permission works
4. ✅ Analytics tracking
5. ✅ Global CDN

### Share Your App
```
QR Code Pairing: https://bub-ai.web.app/hp-cam
```

## 📞 Support

- Firebase Console: https://console.firebase.google.com
- Firebase Docs: https://firebase.google.com/docs/hosting
- HP Camera Docs: See DOCS_INDEX.md

---

**Deployment Ready!** 🚀

Run `firebase deploy` untuk deploy sekarang!
