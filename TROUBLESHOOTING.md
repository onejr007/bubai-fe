# 🔧 Troubleshooting Guide - Firebase Deployment

## ❌ Masalah: Halaman Kosong Setelah Deploy

### Penyebab Umum:
1. Build error tidak terdeteksi
2. Firebase hosting config salah
3. Routing tidak configured
4. Cache browser

### ✅ Solusi:

#### 1. Clear Build & Rebuild
```bash
cd FE

# Hapus dist folder
rm -rf dist

# Rebuild
npm run build

# Verify build success
ls dist/
```

#### 2. Test Local Dulu
```bash
# Test dengan Vite preview
npm run preview

# Atau test dengan Firebase serve
firebase serve
```

Buka browser: `http://localhost:4173` atau `http://localhost:5000`

#### 3. Check firebase.json
Pastikan file `firebase.json` benar:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### 4. Deploy Ulang
```bash
# Deploy dengan force
firebase deploy --only hosting --force

# Atau gunakan script
.\deploy.ps1
```

#### 5. Clear Browser Cache
- Tekan `Ctrl + Shift + R` (hard refresh)
- Atau buka Incognito/Private mode
- Atau clear cache di browser settings

#### 6. Check Console Browser
1. Buka `https://bub-ai.web.app`
2. Tekan `F12` untuk buka DevTools
3. Check tab Console untuk errors
4. Check tab Network untuk failed requests

## ❌ Masalah: Build Error

### Error: TypeScript Errors
```bash
# Fix unused variables
# Change: const [state, setState] = useState()
# To: const [state] = useState()
```

### Error: Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Error: Out of Memory
```bash
# Increase Node memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## ❌ Masalah: Firebase Deploy Error

### Error: Not Logged In
```bash
firebase logout
firebase login
```

### Error: Wrong Project
```bash
firebase use bub-ai
firebase projects:list
```

### Error: Permission Denied
```bash
# Check Firebase Console
# Verify you have Owner/Editor role
```

### Error: Quota Exceeded
```bash
# Check Firebase Console → Usage
# Upgrade plan if needed
```

## ❌ Masalah: Routes Tidak Bekerja

### 404 on Refresh
Pastikan `firebase.json` punya rewrites:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Routes Not Found
Check `src/routes.ts`:
```typescript
import { hpCamRoutes } from '@modules/hp-cam/routes';

export const routes: Route[] = [
  // ... existing routes
  ...hpCamRoutes,  // ← Pastikan ini ada
];
```

## ❌ Masalah: Camera Tidak Bekerja

### Permission Denied
- Pastikan menggunakan HTTPS (Firebase auto-HTTPS)
- Check browser permissions
- Try different browser

### QR Code Tidak Muncul
```bash
# Check if qrcode installed
npm list qrcode

# Reinstall if needed
npm install qrcode @types/qrcode
```

### Connection Timeout
- Check WiFi connection
- Disable battery saver
- Keep screen on

## 🔍 Debug Steps

### 1. Check Build Output
```bash
npm run build

# Should see:
# ✓ built in X.XXs
# dist/index.html
# dist/assets/...
```

### 2. Check Dist Folder
```bash
ls dist/

# Should contain:
# index.html
# assets/
```

### 3. Check index.html
```bash
cat dist/index.html

# Should have:
# <script type="module" src="/assets/index-XXX.js">
# <link rel="stylesheet" href="/assets/index-XXX.css">
```

### 4. Test Local
```bash
npm run preview
# Open: http://localhost:4173
```

### 5. Check Firebase Hosting
```bash
firebase hosting:channel:list

# Should show deployment
```

### 6. Check Live Site
```bash
curl -I https://bub-ai.web.app

# Should return: 200 OK
```

## 📝 Deployment Checklist

Sebelum deploy, pastikan:
- [ ] `npm run build` success (no errors)
- [ ] `dist/` folder exists
- [ ] `dist/index.html` exists
- [ ] `firebase.json` configured correctly
- [ ] Logged in: `firebase login`
- [ ] Project selected: `firebase use bub-ai`
- [ ] Test local: `npm run preview` works

## 🚀 Deploy Step-by-Step

```bash
# 1. Clean
rm -rf dist node_modules

# 2. Install
npm install

# 3. Build
npm run build

# 4. Verify
ls dist/
cat dist/index.html

# 5. Test Local
npm run preview
# Check: http://localhost:4173

# 6. Deploy
firebase deploy --only hosting

# 7. Verify
curl -I https://bub-ai.web.app

# 8. Open Browser
# https://bub-ai.web.app
# Hard refresh: Ctrl + Shift + R
```

## 🆘 Still Not Working?

### Check Firebase Console
1. Go to: https://console.firebase.google.com/project/bub-ai/hosting
2. Check deployment status
3. Check deployment history
4. Check error logs

### Check Browser Console
1. Open: https://bub-ai.web.app
2. Press F12
3. Check Console tab for errors
4. Check Network tab for failed requests
5. Check Sources tab for loaded files

### Rollback
```bash
# Rollback to previous version
firebase hosting:rollback
```

### Force Redeploy
```bash
# Clear cache and redeploy
firebase hosting:channel:delete production
firebase deploy --only hosting --force
```

## 📞 Get Help

### Useful Commands
```bash
# Check Firebase status
firebase --version
firebase login:list
firebase projects:list

# Check build
npm run build
ls dist/

# Check deployment
firebase hosting:channel:list
firebase open hosting:site

# View logs
firebase hosting:channel:open production
```

### Check These Files
1. `FE/firebase.json` - Hosting config
2. `FE/.firebaserc` - Project config
3. `FE/dist/index.html` - Built file
4. `FE/src/routes.ts` - Routes config
5. `FE/src/main.tsx` - Entry point

### Common Fixes
```bash
# Fix 1: Rebuild
rm -rf dist
npm run build
firebase deploy --only hosting

# Fix 2: Clear cache
# Browser: Ctrl + Shift + R

# Fix 3: Reinstall
rm -rf node_modules dist
npm install
npm run build
firebase deploy --only hosting

# Fix 4: Force deploy
firebase deploy --only hosting --force

# Fix 5: Check project
firebase use bub-ai
firebase deploy --only hosting
```

## ✅ Success Indicators

Deployment berhasil jika:
- ✅ Build success (no errors)
- ✅ Deploy success (no errors)
- ✅ `curl -I https://bub-ai.web.app` returns 200
- ✅ Browser shows content (not blank)
- ✅ Console has no errors
- ✅ Routes work (no 404)

---

**Masih ada masalah?** Check console browser dan Firebase Console untuk error details.
