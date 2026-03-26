# Instalasi HP Camera Module

## Langkah Instalasi

### 1. Install Dependencies
```bash
cd FE
npm install
```

Dependencies yang dibutuhkan:
- `qrcode` - Generate QR Code
- `react-router-dom` - Routing
- `@types/qrcode` - TypeScript types

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Akses Aplikasi

#### Di PC:
1. Buka browser: `http://localhost:5173/hp-cam`
2. QR Code akan muncul
3. Tunggu HP scan dan approve

#### Di HP:
1. Scan QR Code yang muncul di PC
2. Browser akan meminta izin kamera
3. Klik "Allow" untuk memberikan izin
4. Kamera akan mulai streaming

### 4. Testing

#### Test Flow Lengkap:
1. PC: Buka `/hp-cam`
2. HP: Scan QR Code
3. HP: Approve camera permission
4. PC: Auto-redirect ke viewer
5. HP: Kamera aktif dan streaming
6. PC: Monitor status koneksi
7. Test Stop dari PC atau HP

#### Test Session Persistence:
1. Setelah approve pertama kali
2. Tutup browser HP
3. Buka lagi URL yang sama
4. Kamera langsung aktif tanpa approval lagi

#### Test Auto-Disconnect:
1. Matikan HP atau tutup browser HP
2. PC akan detect disconnect dalam 10 detik
3. Status berubah menjadi "HP terputus"

## Troubleshooting

### QR Code tidak muncul
- Pastikan dependencies sudah terinstall
- Check console untuk error
- Refresh halaman

### Camera permission ditolak
- Check browser settings
- Pastikan HTTPS atau localhost
- Coba browser lain

### Koneksi terputus terus
- Check network connection
- Pastikan HP tidak sleep mode
- Check localStorage tidak penuh

### Session tidak tersimpan
- Check localStorage enabled
- Clear cache dan coba lagi
- Check browser compatibility

## Browser Support

### PC Browser:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Mobile Browser:
- Chrome Mobile 90+
- Safari iOS 14+
- Samsung Internet 14+

## Security Notes

- Gunakan HTTPS di production
- Session ID random dan unique
- Camera permission required
- LocalStorage untuk session management
- No server-side storage (privacy-first)

## Performance Tips

- Gunakan WiFi untuk koneksi stabil
- Tutup aplikasi lain di HP
- Gunakan resolusi camera yang sesuai
- Monitor battery HP
