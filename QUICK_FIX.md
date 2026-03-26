# 🔧 Quick Fix - Halaman Kosong Setelah Deploy

## ⚡ Solusi Cepat (2 Menit)

### 1. Rebuild & Redeploy
```powershell
cd FE

# Clean
Remove-Item -Recurse -Force dist

# Build
npm run build

# Deploy
firebase deploy --only hosting --force
```

### 2. Hard Refresh Browser
```
Tekan: Ctrl + Shift + R
Atau: Ctrl + F5
```

### 3. Clear Cache
```
Chrome: Settings → Privacy → Clear browsing data
Firefox: Options → Privacy → Clear Data
Edge: Settings → Privacy → Clear browsing data
```

### 4. Test Incognito
```
Buka browser Incognito/Private mode
Akses: https://bub-ai.web.app
```

## 🔍 Check Errors

### Browser Console
1. Buka: https://bub-ai.web.app
2. Tekan: F12
3. Tab: Console
4. Lihat error messages

### Common Errors & Fixes

#### Error: "Failed to load module"
```powershell
# Rebuild
npm run build
firebase deploy --only hosting
```

#### Error: "404 Not Found"
```powershell
# Check firebase.json
# Pastikan ada rewrites config
```

#### Error: "Blank page, no errors"
```powershell
# Hard refresh
Ctrl + Shift + R

# Or clear cache
```

## ✅ Verified Deploy Script

Gunakan script yang sudah include verification:

```powershell
.\deploy-verified.ps1
```

Script ini akan:
1. ✅ Clean old build
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Verify build files
5. ✅ Check Firebase login
6. ✅ Deploy to hosting
7. ✅ Verify deployment

## 🧪 Test Local First

Sebelum deploy, test dulu local:

```powershell
# Build
npm run build

# Test
npm run preview

# Buka: http://localhost:4173
```

Jika local works, deploy:
```powershell
firebase deploy --only hosting
```

## 📝 Checklist

Sebelum deploy:
- [ ] `npm run build` success
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` exists
- [ ] `npm run preview` works
- [ ] Logged in: `firebase login`
- [ ] Project: `firebase use bub-ai`

Setelah deploy:
- [ ] `https://bub-ai.web.app` accessible
- [ ] Hard refresh: `Ctrl + Shift + R`
- [ ] Console: No errors
- [ ] Routes: All working

## 🆘 Still Blank?

### Option 1: Force Redeploy
```powershell
Remove-Item -Recurse -Force dist
npm install
npm run build
firebase deploy --only hosting --force
```

### Option 2: Check Firebase Console
1. Go to: https://console.firebase.google.com/project/bub-ai/hosting
2. Check deployment status
3. Check error logs

### Option 3: Rollback
```powershell
firebase hosting:rollback
```

### Option 4: Use Verified Script
```powershell
.\deploy-verified.ps1
```

## 💡 Pro Tips

1. **Always test local first**
   ```powershell
   npm run preview
   ```

2. **Always hard refresh after deploy**
   ```
   Ctrl + Shift + R
   ```

3. **Check console for errors**
   ```
   F12 → Console tab
   ```

4. **Use verified deploy script**
   ```powershell
   .\deploy-verified.ps1
   ```

5. **Clear browser cache if needed**
   ```
   Settings → Privacy → Clear cache
   ```

## ✅ Success Indicators

Deployment berhasil jika:
- ✅ Build success (no errors)
- ✅ Deploy success (no errors)
- ✅ Browser shows content (not blank)
- ✅ Console has no errors
- ✅ Routes work

## 📞 Need More Help?

Check:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Detailed troubleshooting
- [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) - Full deployment guide
- Browser Console (F12) - Error messages
- Firebase Console - Deployment logs

---

**Quick Deploy Now:**
```powershell
.\deploy-verified.ps1
```

Then hard refresh browser: `Ctrl + Shift + R`
