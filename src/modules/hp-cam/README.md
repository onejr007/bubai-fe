# HP Camera Module

Module untuk menghubungkan kamera HP ke PC browser menggunakan QR Code pairing.

## 🎯 Fitur Utama

- ✅ **QR Code Pairing** - Scan sekali untuk koneksi
- ✅ **Auto Permission** - Redirect otomatis ke camera permission
- ✅ **Session Saved** - Tidak perlu approval berulang
- ✅ **Real-time Monitor** - Status koneksi live
- ✅ **Auto Disconnect** - Detect HP mati otomatis
- ✅ **Manual Stop** - Control dari PC atau HP

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd FE
npm install

# 2. Run dev server
npm run dev

# 3. Buka di PC
http://localhost:5173/hp-cam

# 4. Scan QR dengan HP
# 5. Approve camera permission
# 6. Done!
```

## 📱 Cara Penggunaan

### 1. Pairing (PC)
- Buka `/hp-cam` di PC browser
- QR Code akan muncul
- Tunggu HP scan

### 2. Scan QR (HP)
- Scan QR Code dengan HP
- Browser HP akan terbuka otomatis
- Tunggu loading

### 3. Approve Camera (HP)
- Browser meminta izin kamera
- Klik "Allow"
- Kamera langsung aktif

### 4. Monitor (PC)
- PC auto-redirect ke viewer
- Monitor status koneksi
- Lihat heartbeat real-time

### 5. Stop
- Dari PC: Klik "Stop Streaming"
- Dari HP: Klik "Stop Streaming"
- Otomatis: Matikan HP

## 🗺️ Routes

| Route | Deskripsi | Device |
|-------|-----------|--------|
| `/hp-cam` | Pairing page dengan QR Code | PC |
| `/hp-cam/mobile/:sessionId` | Camera streaming page | HP |
| `/hp-cam/viewer/:sessionId` | Viewer & monitoring page | PC |

## 🏗️ Architecture

```
┌──────────────┐         ┌──────────────┐
│ PairingPage  │────────▶│ ViewerPage   │
│ (PC)         │         │ (PC)         │
└──────────────┘         └──────────────┘
       │                        │
       │   localStorage         │
       │   (Signaling)          │
       │                        │
       └────────────┬───────────┘
                    │
         ┌──────────▼──────────┐
         │ MobileCameraPage    │
         │ (HP)                │
         └─────────────────────┘
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "qrcode": "^1.5.3",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.5"
  }
}
```

## 🔧 Session Management

Session disimpan di localStorage:

```typescript
{
  sessionId: string;        // Unique ID
  createdAt: number;        // Timestamp
  approved: boolean;        // Camera permission status
  deviceInfo?: string;      // HP device info
}
```

### Session Flow
1. PC generate session ID
2. HP scan QR → open URL with session ID
3. HP approve camera → mark session.approved = true
4. PC detect approval → redirect to viewer
5. Session saved → no re-approval needed

## 💓 Heartbeat System

- HP kirim heartbeat setiap **3 detik**
- PC check heartbeat setiap **2 detik**
- Timeout **10 detik** = disconnect
- Auto-cleanup old signals

## 🛑 Stop Mechanism

### 3 Cara Stop:
1. **Manual PC** - Klik Stop di PC → HP terima signal
2. **Manual HP** - Klik Stop di HP → PC detect
3. **Auto** - HP mati → PC timeout dalam 10s

## 🔐 Security

### Current
- Random session ID
- LocalStorage only
- No external server
- Camera permission required

### Production Recommendations
- ⚠️ HTTPS mandatory
- ⚠️ Add authentication
- ⚠️ Session expiry (24h)
- ⚠️ Rate limiting
- ⚠️ Encryption

## 📚 Dokumentasi Lengkap

| Document | Deskripsi |
|----------|-----------|
| [DOCS_INDEX.md](./DOCS_INDEX.md) | Index semua dokumentasi |
| [QUICK_START_ID.md](./QUICK_START_ID.md) | Mulai dalam 5 menit |
| [USER_GUIDE.md](./USER_GUIDE.md) | Panduan lengkap pengguna |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |
| [INSTALLATION.md](./INSTALLATION.md) | Setup & installation |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Testing lengkap |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [SUMMARY.md](./SUMMARY.md) | Project summary |

## 🧪 Testing

```bash
# Run tests
npm test

# Check diagnostics
npm run build
```

Lihat [TESTING_GUIDE.md](./TESTING_GUIDE.md) untuk test cases lengkap.

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output: FE/dist/
```

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk deployment guide lengkap.

## 🌐 Browser Support

### PC Browser
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Mobile Browser
- Chrome Mobile 90+
- Safari iOS 14+
- Samsung Internet 14+

## 🎯 Use Cases

1. **Webcam Replacement** - Video call dengan HP camera
2. **Security Camera** - Monitor ruangan
3. **Baby Monitor** - Pantau bayi
4. **Pet Camera** - Lihat hewan peliharaan
5. **Remote Monitoring** - Monitor apapun

## 💡 Tips

### Koneksi Stabil
- Gunakan WiFi yang sama (PC & HP)
- Jangan minimize browser HP
- Disable battery saver
- Keep screen on

### Battery Saving
- Kurangi brightness HP
- Gunakan mode airplane (WiFi on)
- Charge HP saat streaming lama

### Kualitas Terbaik
- HP dengan kamera bagus
- Pencahayaan cukup
- Stabilkan posisi HP
- Gunakan tripod

## 🐛 Troubleshooting

### QR Code tidak muncul
```bash
npm install qrcode @types/qrcode
npm run dev
```

### Camera permission ditolak
- Check browser settings
- Enable camera permission
- Try different browser

### Koneksi terputus
- Disable battery saver
- Keep screen on
- Check WiFi connection

Lihat [USER_GUIDE.md](./USER_GUIDE.md#troubleshooting) untuk solusi lengkap.

## 📈 Roadmap

### Version 1.0 (Current) ✅
- QR Code pairing
- Camera permission
- Session management
- Heartbeat monitoring
- Manual stop

### Version 2.0 (Planned)
- WebRTC streaming
- Video display di PC
- Audio support
- Recording feature

### Version 3.0 (Future)
- Multiple camera
- Zoom control
- Flash control
- Screenshot
- Cloud storage

## 🤝 Contributing

Contributions welcome! Please:
1. Read documentation
2. Follow code style
3. Add tests
4. Update docs

## 📄 License

MIT License - See LICENSE file

## 📞 Support

- Documentation: [DOCS_INDEX.md](./DOCS_INDEX.md)
- Issues: Check console browser
- Testing: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## ✅ Status

- **Version:** 1.0.0
- **Status:** ✅ Complete & Ready
- **Last Updated:** 2026-03-26
- **Author:** Claude AI Assistant

---

**Happy Streaming!** 📹

Untuk memulai, baca [QUICK_START_ID.md](./QUICK_START_ID.md) atau [DOCS_INDEX.md](./DOCS_INDEX.md).
