# 🚀 Deploy Sekarang - Quick Guide

## Langkah Cepat (5 Menit)

### 1️⃣ Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2️⃣ Login ke Firebase
```bash
firebase login
```

### 3️⃣ Deploy!

#### Windows (PowerShell):
```powershell
cd FE
.\deploy.ps1
```

#### Linux/Mac (Bash):
```bash
cd FE
chmod +x deploy.sh
./deploy.sh
```

#### Manual:
```bash
cd FE
npm install
npm run build
firebase deploy --only hosting
```

### 4️⃣ Akses Aplikasi
```
https://bub-ai.web.app/hp-cam
```

## ✅ Selesai!

Aplikasi Anda sudah live di Firebase Hosting dengan HTTPS otomatis!

---

## 🔧 Commands Berguna

### Deploy
```bash
npm run deploy              # Build + Deploy
npm run deploy:hosting      # Deploy hosting only
```

### Test Local
```bash
npm run preview             # Preview build
npm run firebase:serve      # Firebase local server
```

### Check Status
```bash
firebase hosting:channel:list    # List deployments
firebase open hosting:site       # Open in browser
```

### Rollback
```bash
firebase hosting:rollback        # Rollback to previous
```

---

## 📱 Test After Deploy

1. Buka: `https://bub-ai.web.app/hp-cam`
2. Scan QR Code dengan HP
3. Approve camera permission
4. Verify streaming works

---

## 🐛 Troubleshooting

### Firebase CLI not found
```bash
npm install -g firebase-tools
```

### Not logged in
```bash
firebase logout
firebase login
```

### Build error
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Deploy error
```bash
firebase use bub-ai
firebase deploy --only hosting
```

---

## 📚 Dokumentasi Lengkap

- [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) - Full guide
- [HP Camera Docs](./src/modules/hp-cam/DOCS_INDEX.md) - Module docs

---

**Ready to deploy?** Run the commands above! 🚀
