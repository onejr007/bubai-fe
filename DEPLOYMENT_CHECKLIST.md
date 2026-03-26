# 🚀 Firebase Deployment Checklist

## ✅ Pre-Deployment

### Environment Setup
- [x] Firebase project created: `bub-ai`
- [x] Firebase config added to `src/config/firebase.ts`
- [x] Firebase CLI installed: `npm install -g firebase-tools`
- [x] `.firebaserc` configured
- [x] `firebase.json` configured
- [x] `.env.production` created

### Code Ready
- [x] HP Camera module created
- [x] Routes integrated
- [x] Firebase initialized in `main.tsx`
- [x] Path aliases configured
- [x] Dependencies installed

### Files Created
- [x] `src/config/firebase.ts` - Firebase configuration
- [x] `.firebaserc` - Firebase project config
- [x] `firebase.json` - Hosting configuration
- [x] `.env.production` - Production environment
- [x] `deploy.sh` - Bash deployment script
- [x] `deploy.ps1` - PowerShell deployment script
- [x] `FIREBASE_DEPLOYMENT.md` - Full deployment guide
- [x] `DEPLOY_NOW.md` - Quick deployment guide

## 🔧 Deployment Steps

### Step 1: Login to Firebase
```bash
firebase login
```
- [ ] Login successful
- [ ] Correct account selected

### Step 2: Verify Project
```bash
firebase projects:list
firebase use bub-ai
```
- [ ] Project `bub-ai` listed
- [ ] Project selected

### Step 3: Install Dependencies
```bash
cd FE
npm install
```
- [ ] All dependencies installed
- [ ] No errors

### Step 4: Build Application
```bash
npm run build
```
- [ ] Build successful
- [ ] `dist/` folder created
- [ ] No TypeScript errors (except existing ones)

### Step 5: Test Build Locally
```bash
npm run preview
# or
firebase serve
```
- [ ] Local preview works
- [ ] Routes accessible
- [ ] No console errors

### Step 6: Deploy to Firebase
```bash
firebase deploy --only hosting
# or
npm run deploy:hosting
# or
.\deploy.ps1 (Windows)
# or
./deploy.sh (Linux/Mac)
```
- [ ] Deployment successful
- [ ] Deployment URL received

### Step 7: Verify Deployment
```bash
firebase open hosting:site
```
- [ ] Site accessible
- [ ] HTTPS working
- [ ] Routes working

## 🧪 Post-Deployment Testing

### Test 1: Basic Access
- [ ] Open `https://bub-ai.web.app`
- [ ] Homepage loads
- [ ] No console errors

### Test 2: HP Camera - Pairing
- [ ] Open `https://bub-ai.web.app/hp-cam`
- [ ] QR Code generates
- [ ] No errors in console

### Test 3: HP Camera - Mobile
- [ ] Scan QR Code with phone
- [ ] Browser opens with HTTPS URL
- [ ] Camera permission requested
- [ ] Approve permission
- [ ] Camera starts streaming

### Test 4: HP Camera - Viewer
- [ ] PC auto-redirects to viewer
- [ ] Connection status shows "Connected"
- [ ] Heartbeat updates
- [ ] Green indicator shows

### Test 5: HP Camera - Stop
- [ ] Click "Stop" on PC
- [ ] HP receives stop signal
- [ ] Camera stops
- [ ] Status updates

### Test 6: Session Persistence
- [ ] Close HP browser
- [ ] Reopen same URL
- [ ] No permission request
- [ ] Camera starts immediately

### Test 7: HTTPS & Security
```bash
curl -I https://bub-ai.web.app
```
- [ ] Status: 200 OK
- [ ] HTTPS active
- [ ] Security headers present

### Test 8: Analytics
- [ ] Open Firebase Console
- [ ] Check Analytics dashboard
- [ ] Events tracking

## 🔐 Security Verification

### HTTPS
- [ ] All pages use HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid

### Headers
- [ ] X-Frame-Options present
- [ ] X-Content-Type-Options present
- [ ] X-XSS-Protection present
- [ ] Referrer-Policy present

### Camera Permissions
- [ ] Permission required
- [ ] User must approve
- [ ] Works on HTTPS only

## 📊 Monitoring Setup

### Firebase Console
- [ ] Hosting dashboard accessible
- [ ] Analytics configured
- [ ] Performance monitoring active

### Check URLs
- [ ] Primary: `https://bub-ai.web.app`
- [ ] Secondary: `https://bub-ai.firebaseapp.com`
- [ ] HP Camera: `https://bub-ai.web.app/hp-cam`

## 🐛 Troubleshooting

### If Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### If Deploy Fails
```bash
firebase logout
firebase login
firebase use bub-ai
firebase deploy --only hosting
```

### If Camera Not Working
- Check HTTPS is active
- Check browser permissions
- Check console for errors
- Test on different device

## 📝 Documentation

### Update Documentation
- [ ] Update README with live URL
- [ ] Update QUICK_START with live URL
- [ ] Update USER_GUIDE with live URL
- [ ] Add deployment date to CHANGELOG

### Share Links
```
Production URL: https://bub-ai.web.app
HP Camera: https://bub-ai.web.app/hp-cam
Documentation: https://bub-ai.web.app/docs
```

## 🎉 Success Criteria

### All Must Pass
- [x] Build successful
- [ ] Deploy successful
- [ ] Site accessible via HTTPS
- [ ] QR Code generation works
- [ ] Camera permission works
- [ ] Streaming works
- [ ] Stop mechanism works
- [ ] Session persistence works
- [ ] No console errors
- [ ] Analytics tracking

## 🔄 Rollback Plan

### If Issues Found
```bash
# List deployments
firebase hosting:channel:list

# Rollback to previous
firebase hosting:rollback

# Or redeploy previous version
git checkout <previous-commit>
npm run build
firebase deploy --only hosting
```

## 📞 Support

### Resources
- Firebase Console: https://console.firebase.google.com/project/bub-ai
- Firebase Docs: https://firebase.google.com/docs/hosting
- HP Camera Docs: [DOCS_INDEX.md](./src/modules/hp-cam/DOCS_INDEX.md)

### Commands
```bash
# Check status
firebase hosting:channel:list

# View logs
firebase hosting:channel:open production

# Redeploy
firebase deploy --only hosting
```

## ✅ Final Checklist

Before marking as complete:
- [ ] All tests passed
- [ ] No critical errors
- [ ] Documentation updated
- [ ] Team notified
- [ ] Monitoring active
- [ ] Backup created

---

## 🚀 Ready to Deploy?

Run these commands:

```bash
cd FE
firebase login
npm install
npm run build
firebase deploy --only hosting
```

Or use the deployment script:

**Windows:**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Status:** ⬜ Pending / ✅ Complete
**Live URL:** https://bub-ai.web.app

---

Good luck with your deployment! 🚀
