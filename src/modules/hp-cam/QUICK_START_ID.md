# Quick Start - HP Camera Module

## 🚀 Mulai Cepat (5 Menit)

### 1️⃣ Install & Run
```bash
cd FE
npm install
npm run dev
```

### 2️⃣ Buka di PC
```
http://localhost:5173/hp-cam
```

### 3️⃣ Scan QR dengan HP
- QR Code akan muncul di layar PC
- Scan dengan kamera HP
- Browser HP akan terbuka otomatis

### 4️⃣ Approve Camera
- Klik "Allow" saat diminta izin kamera
- Kamera langsung aktif
- PC otomatis redirect ke viewer

### 5️⃣ Selesai! 🎉
- HP streaming kamera
- PC monitor status
- Klik Stop untuk berhenti

## 📱 Screenshot Flow

```
┌─────────────────┐
│   PC Browser    │
│                 │
│  ┌───────────┐  │
│  │ QR CODE   │  │  ← Scan ini dengan HP
│  │ █████████ │  │
│  │ █████████ │  │
│  └───────────┘  │
│                 │
│ Scan QR Code    │
│ dengan HP Anda  │
└─────────────────┘

        ↓ Scan

┌─────────────────┐
│  Mobile Browser │
│                 │
│  📷 Camera      │
│  Permission     │
│                 │
│  [Block] [Allow]│  ← Klik Allow
└─────────────────┘

        ↓ Allow

┌─────────────────┐
│  Mobile Browser │
│                 │
│  ┌───────────┐  │
│  │ 📹 LIVE   │  │
│  │           │  │
│  │  Camera   │  │
│  │  Active   │  │
│  └───────────┘  │
│                 │
│  🟢 Streaming   │
│  [Stop]         │
└─────────────────┘

        ↓ Auto

┌─────────────────┐
│   PC Browser    │
│                 │
│  🟢 Connected   │
│                 │
│  HP terhubung   │
│  dan streaming  │
│                 │
│  Session: xxx   │
│  Heartbeat: OK  │
│                 │
│  [Stop] [New]   │
└─────────────────┘
```

## ⚡ Tips Cepat

### Koneksi Stabil:
- Gunakan WiFi yang sama
- Jangan minimize browser HP
- Keep screen HP on

### Pairing Ulang:
- Tidak perlu scan QR lagi
- Buka URL yang sama di HP
- Langsung connect

### Stop Streaming:
- Dari PC: Klik Stop
- Dari HP: Klik Stop
- Otomatis: Matikan HP

## 🔧 Troubleshooting Cepat

### QR tidak muncul?
```bash
npm install
npm run dev
```

### Camera ditolak?
- Settings → Permissions → Camera → Allow

### Koneksi putus?
- Disable battery saver
- Keep screen on
- Gunakan WiFi stabil

## 📚 Dokumentasi Lengkap

- `README.md` - Overview module
- `USER_GUIDE.md` - Panduan lengkap
- `ARCHITECTURE.md` - Technical details
- `INSTALLATION.md` - Setup guide

## 🎯 Use Cases

### 1. Webcam Replacement
Gunakan HP sebagai webcam untuk video call

### 2. Security Camera
Monitor ruangan dengan HP lama

### 3. Baby Monitor
Pantau bayi dari PC

### 4. Pet Camera
Lihat hewan peliharaan dari jauh

### 5. Remote Monitoring
Monitor apapun dengan HP

## 🔐 Keamanan

- ✅ No external server
- ✅ Data di localStorage
- ✅ Session random ID
- ⚠️ Gunakan HTTPS di production

## 🚀 Next Steps

Setelah berhasil:
1. Baca USER_GUIDE.md untuk fitur lengkap
2. Check ARCHITECTURE.md untuk technical details
3. Customize sesuai kebutuhan
4. Deploy ke production dengan HTTPS

## 💡 Pro Tips

1. **Save URL HP** - Copy URL dari browser HP untuk akses cepat
2. **Multiple Sessions** - Bisa pairing multiple HP
3. **Battery Saving** - Kurangi brightness HP
4. **Stable Mount** - Gunakan tripod untuk HP

## ❓ FAQ Singkat

**Q: Perlu internet?**
A: Tidak, cukup WiFi lokal

**Q: Data aman?**
A: Ya, semua lokal di browser

**Q: Berapa lama session?**
A: Selamanya sampai clear cache

**Q: Bisa multiple HP?**
A: Ya, setiap HP beda session

## 🎉 Selamat!

Anda sudah berhasil setup HP Camera Module!

Untuk pertanyaan lebih lanjut, baca dokumentasi lengkap atau check console browser untuk error.

Happy Streaming! 📹
