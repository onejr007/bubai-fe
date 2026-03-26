# Panduan Penggunaan HP Camera

## Deskripsi
Module ini memungkinkan Anda menggunakan kamera HP sebagai webcam untuk PC browser. Koneksi dilakukan melalui QR Code pairing yang aman dan mudah.

## Fitur Utama

✅ **QR Code Pairing** - Scan sekali untuk koneksi
✅ **Auto Permission** - Redirect otomatis ke camera permission
✅ **Session Saved** - Tidak perlu approval berulang
✅ **Real-time Monitor** - Status koneksi live
✅ **Auto Disconnect** - Detect HP mati otomatis
✅ **Manual Stop** - Control dari PC atau HP

## Cara Penggunaan

### Langkah 1: Pairing (PC)

1. Buka browser di PC
2. Akses URL: `http://localhost:5173/hp-cam`
3. QR Code akan muncul di layar
4. Jangan tutup halaman ini

### Langkah 2: Scan QR (HP)

1. Buka camera atau QR scanner di HP
2. Scan QR Code yang muncul di PC
3. Browser akan terbuka otomatis
4. Tunggu loading selesai

### Langkah 3: Approve Camera (HP)

1. Browser akan meminta izin kamera
2. Klik **"Allow"** atau **"Izinkan"**
3. Kamera akan langsung aktif
4. Anda akan melihat preview kamera

### Langkah 4: Monitor (PC)

1. PC akan otomatis redirect ke halaman viewer
2. Status koneksi akan muncul
3. Anda dapat melihat:
   - Status: Connected/Disconnected
   - Last Heartbeat time
   - Session ID
   - Dynamic URL

### Langkah 5: Stop Streaming

#### Dari PC:
1. Klik tombol **"Stop Streaming"**
2. HP akan menerima signal stop
3. Kamera HP akan berhenti

#### Dari HP:
1. Klik tombol **"Stop Streaming"**
2. PC akan detect disconnect
3. Status berubah menjadi disconnected

#### Otomatis:
- Matikan HP
- Tutup browser HP
- HP sleep/standby
- PC akan detect dalam 10 detik

## Penggunaan Lanjutan

### Session Management

#### Pairing Pertama Kali:
```
PC: Generate QR → HP: Scan → HP: Approve → Connected
```

#### Pairing Kedua Kali (Session Saved):
```
HP: Buka URL lama → Langsung Connected (No Approval)
```

#### Cara Mendapatkan URL:
1. Setelah pairing pertama
2. Copy URL dari browser HP
3. Simpan untuk penggunaan berikutnya
4. Buka URL tersebut kapan saja

### Multiple Sessions

Anda dapat membuat multiple sessions:
1. Setiap QR Code = Session baru
2. Session tersimpan di localStorage
3. Bisa pairing multiple HP
4. Setiap HP punya session sendiri

### Monitoring Koneksi

#### Indikator Status:
- 🟢 **Green Dot** = Connected
- 🔴 **Red Dot** = Disconnected
- ⚡ **Pulse Animation** = Active streaming

#### Heartbeat System:
- HP kirim signal setiap 3 detik
- PC check setiap 2 detik
- Timeout 10 detik = Disconnect

## Tips & Tricks

### Untuk Koneksi Stabil:
1. ✅ Gunakan WiFi yang sama (PC & HP)
2. ✅ Jangan minimize browser HP
3. ✅ Disable battery saver di HP
4. ✅ Keep screen HP on
5. ✅ Tutup aplikasi lain di HP

### Untuk Kualitas Terbaik:
1. ✅ Gunakan HP dengan kamera bagus
2. ✅ Pastikan pencahayaan cukup
3. ✅ Stabilkan posisi HP
4. ✅ Gunakan tripod jika perlu

### Untuk Battery Saving:
1. ⚡ Kurangi brightness HP
2. ⚡ Gunakan mode airplane (WiFi on)
3. ⚡ Charge HP saat streaming lama
4. ⚡ Gunakan resolusi lebih rendah

## Troubleshooting

### QR Code tidak muncul
**Penyebab:**
- Dependencies belum terinstall
- Error di console

**Solusi:**
```bash
cd FE
npm install
npm run dev
```

### Camera permission ditolak
**Penyebab:**
- Browser tidak support
- Permission di-block

**Solusi:**
1. Buka Settings browser
2. Cari "Site Settings" atau "Permissions"
3. Enable Camera permission
4. Refresh halaman

### Koneksi terputus terus
**Penyebab:**
- HP sleep mode
- Network tidak stabil
- Battery saver aktif

**Solusi:**
1. Disable sleep mode
2. Keep screen on
3. Disable battery saver
4. Gunakan WiFi stabil

### Session tidak tersimpan
**Penyebab:**
- localStorage disabled
- Private/Incognito mode
- Cache penuh

**Solusi:**
1. Gunakan normal mode (bukan incognito)
2. Enable localStorage di settings
3. Clear cache browser
4. Coba browser lain

### HP tidak terdetect disconnect
**Penyebab:**
- Heartbeat masih terkirim
- Timeout belum tercapai

**Solusi:**
- Tunggu 10 detik
- Atau klik Stop manual

## FAQ

### Q: Apakah perlu internet?
A: Tidak, cukup WiFi lokal yang sama untuk PC dan HP.

### Q: Apakah data aman?
A: Ya, semua data tersimpan di localStorage browser Anda. Tidak ada server external.

### Q: Berapa lama session berlaku?
A: Session berlaku selamanya sampai Anda hapus localStorage atau clear cache.

### Q: Bisa pairing multiple HP?
A: Ya, setiap HP bisa punya session sendiri.

### Q: Apakah bisa recording?
A: Belum, fitur ini akan ditambahkan di versi berikutnya.

### Q: Apakah bisa audio?
A: Belum, saat ini hanya video. Audio akan ditambahkan nanti.

### Q: Browser apa yang support?
A: Chrome, Firefox, Edge, Safari (versi terbaru).

### Q: Apakah bisa di production?
A: Bisa, tapi gunakan HTTPS dan tambahkan authentication.

## Keamanan

### Saat Development:
- ✅ Gunakan localhost
- ✅ Session ID random
- ✅ No external server

### Saat Production:
- ⚠️ WAJIB gunakan HTTPS
- ⚠️ Tambahkan authentication
- ⚠️ Implement session expiry
- ⚠️ Add rate limiting
- ⚠️ Encrypt sensitive data

## Support

Jika mengalami masalah:
1. Check console browser untuk error
2. Baca dokumentasi ARCHITECTURE.md
3. Check INSTALLATION.md untuk setup
4. Lihat ERROR_SOLUTIONS.md untuk solusi

## Roadmap

### Version 1.0 (Current)
- ✅ QR Code pairing
- ✅ Camera permission
- ✅ Session management
- ✅ Heartbeat monitoring
- ✅ Manual stop

### Version 2.0 (Planned)
- [ ] WebRTC streaming
- [ ] Video display di PC
- [ ] Audio support
- [ ] Recording feature

### Version 3.0 (Future)
- [ ] Multiple camera
- [ ] Zoom control
- [ ] Flash control
- [ ] Screenshot feature
- [ ] Cloud storage
