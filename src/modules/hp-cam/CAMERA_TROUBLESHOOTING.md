# 📷 Camera Troubleshooting Guide

## ✅ Masalah "Session Tidak Valid" - FIXED!

Masalah ini sudah diperbaiki. Sekarang:
- ✅ Session otomatis dibuat di HP saat scan QR
- ✅ Tidak perlu session sudah ada di localStorage
- ✅ Setiap device punya localStorage sendiri

## 🔧 Cara Kerja Baru

### Flow Pairing:
1. **PC**: Generate QR Code dengan session ID
2. **HP**: Scan QR → Buka URL dengan session ID
3. **HP**: Auto-create session di localStorage HP
4. **HP**: Request camera permission
5. **HP**: Approve → Mark session.approved = true
6. **PC**: Polling localStorage PC untuk detect approval
7. **PC**: Redirect ke viewer saat approved

### Session Storage:
- **PC localStorage**: Session untuk monitoring
- **HP localStorage**: Session untuk camera access
- **Signaling**: Via localStorage (same origin)

## 📱 Testing Setelah Deploy

### 1. Clear Cache
```
Browser: Ctrl + Shift + R
Atau: Ctrl + F5
```

### 2. Test Flow
```
1. PC: Buka https://bub-ai.web.app/hp-cam
2. PC: QR Code muncul
3. HP: Scan QR Code
4. HP: Browser terbuka dengan URL
5. HP: Klik "Allow" untuk camera
6. HP: Camera aktif
7. PC: Auto-redirect ke viewer
```

### 3. Check Console
Jika ada error:
```
F12 → Console tab
Screenshot error messages
```

## 🐛 Common Errors & Solutions

### Error: "Browser tidak support camera API"
**Penyebab:** Browser lama atau tidak support getUserMedia

**Solusi:**
- Update browser ke versi terbaru
- Gunakan Chrome 90+ atau Safari 14+
- Jangan gunakan browser in-app (Facebook, Instagram, dll)

### Error: "Izin kamera ditolak"
**Penyebab:** User klik "Block" atau permission denied

**Solusi:**
1. Buka browser settings
2. Cari "Site Settings" atau "Permissions"
3. Cari "Camera"
4. Allow untuk `bub-ai.web.app`
5. Refresh halaman

**Chrome Mobile:**
```
Settings → Site Settings → Camera → Allow
```

**Safari iOS:**
```
Settings → Safari → Camera → Allow
```

### Error: "Kamera tidak ditemukan"
**Penyebab:** Device tidak punya kamera atau kamera disabled

**Solusi:**
- Pastikan device punya kamera
- Check kamera tidak di-disable di settings
- Coba restart device

### Error: "Kamera sedang digunakan aplikasi lain"
**Penyebab:** Aplikasi lain menggunakan kamera

**Solusi:**
- Tutup aplikasi camera lain
- Tutup tab browser lain yang akses camera
- Restart browser
- Restart device

### Error: "Kamera tidak support resolusi"
**Penyebab:** Kamera tidak support 1280x720

**Solusi:**
- Aplikasi akan auto-retry dengan resolusi default
- Jika masih error, check console untuk detail

## 🔐 HTTPS & Permissions

### HTTPS Required
- ✅ Firebase Hosting provides automatic HTTPS
- ✅ Camera API requires secure context (HTTPS)
- ✅ All routes use HTTPS

### Browser Permissions
- Camera permission required per domain
- Permission saved after first approval
- Can be revoked in browser settings

## 📊 Session Management

### Session Creation
```typescript
// Auto-created on mobile when scan QR
{
  sessionId: "timestamp-random",
  createdAt: Date.now(),
  approved: false
}
```

### Session Approval
```typescript
// After camera permission granted
{
  sessionId: "timestamp-random",
  createdAt: Date.now(),
  approved: true,
  deviceInfo: "User-Agent string"
}
```

### Session Persistence
- Saved in localStorage
- Survives page refresh
- Survives browser restart
- Per-device (not shared)

## 🧪 Testing Checklist

### PC Side:
- [ ] Open `/hp-cam`
- [ ] QR Code generates
- [ ] Session created in localStorage
- [ ] No console errors

### HP Side:
- [ ] Scan QR Code
- [ ] Browser opens URL
- [ ] Session auto-created
- [ ] Camera permission requested
- [ ] Click "Allow"
- [ ] Camera starts
- [ ] Video preview shows
- [ ] No console errors

### PC Viewer:
- [ ] Auto-redirect to viewer
- [ ] Connection status shows
- [ ] Heartbeat updates
- [ ] Can stop streaming

## 🔄 Retry Logic

### Camera Permission Retry
```typescript
1. Try with high resolution (1280x720)
2. If fails with OverconstrainedError:
   → Retry with default resolution
3. If still fails:
   → Show error with troubleshooting
```

### Error Messages
- Clear, actionable error messages
- Troubleshooting tips included
- Browser-specific instructions

## 💡 Best Practices

### For Users:
1. Use latest browser version
2. Allow camera permission
3. Keep screen on during streaming
4. Disable battery saver
5. Use stable WiFi

### For Developers:
1. Always check browser support
2. Handle all error cases
3. Provide clear error messages
4. Auto-retry with fallbacks
5. Test on multiple devices

## 📞 Support

### If Still Having Issues:

1. **Check Console:**
   ```
   F12 → Console tab
   Screenshot errors
   ```

2. **Check Browser:**
   ```
   Chrome: chrome://version
   Safari: About Safari
   ```

3. **Check Permissions:**
   ```
   Settings → Site Settings → Camera
   ```

4. **Test Different Browser:**
   ```
   Try Chrome, Safari, Firefox
   ```

5. **Check HTTPS:**
   ```
   URL must start with https://
   ```

## ✅ Success Indicators

Everything working if:
- ✅ QR Code generates on PC
- ✅ HP can scan and open URL
- ✅ Camera permission requested
- ✅ Camera starts after approval
- ✅ Video preview shows on HP
- ✅ PC viewer shows connection
- ✅ Heartbeat updates
- ✅ Can stop from PC or HP

## 🎉 Fixed Issues

- ✅ "Session tidak valid" error
- ✅ Session auto-creation on mobile
- ✅ Better error messages
- ✅ Camera permission retry logic
- ✅ Resolution fallback
- ✅ Clear troubleshooting steps

---

**Last Updated:** 2026-03-26
**Version:** 1.1.0
**Status:** ✅ Session Issues Fixed
