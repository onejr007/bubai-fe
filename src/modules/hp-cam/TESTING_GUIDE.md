# Testing Guide - HP Camera Module

## 🧪 Panduan Testing Lengkap

### Prerequisites
```bash
cd FE
npm install
npm run dev
```

## 1️⃣ Basic Flow Testing

### Test 1: QR Code Generation
**Steps:**
1. Buka `http://localhost:5173/hp-cam` di PC
2. Tunggu QR Code muncul

**Expected:**
- ✅ QR Code muncul dalam 1-2 detik
- ✅ Status: "Scan QR Code dengan HP Anda"
- ✅ Session ID muncul di bawah
- ✅ Instruksi pairing terlihat

**Debug:**
```javascript
// Check localStorage
localStorage.getItem('hp_cam_sessions')
```

### Test 2: QR Code Scanning
**Steps:**
1. Scan QR Code dengan HP
2. Browser HP akan terbuka

**Expected:**
- ✅ URL format: `/hp-cam/mobile/{sessionId}`
- ✅ Page loading di HP
- ✅ Status: "Initializing..."

### Test 3: Camera Permission
**Steps:**
1. Browser HP meminta izin kamera
2. Klik "Allow"

**Expected:**
- ✅ Permission dialog muncul
- ✅ Setelah allow, kamera aktif
- ✅ Video preview muncul di HP
- ✅ Status: "Kamera aktif"
- ✅ Green dot + "Streaming Active"

**Debug:**
```javascript
// Check camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera OK', stream))
  .catch(err => console.error('Camera Error', err))
```

### Test 4: Auto Redirect PC
**Steps:**
1. Setelah HP approve camera
2. Tunggu di PC

**Expected:**
- ✅ PC auto-redirect dalam 1-2 detik
- ✅ URL berubah ke `/hp-cam/viewer/{sessionId}`
- ✅ Status: "HP terhubung dan streaming"
- ✅ Green dot + pulse animation

**Debug:**
```javascript
// Check session approval
const sessions = JSON.parse(localStorage.getItem('hp_cam_sessions'))
console.log(sessions)
// Should show approved: true
```

### Test 5: Heartbeat Monitoring
**Steps:**
1. Biarkan koneksi aktif 30 detik
2. Monitor status di PC

**Expected:**
- ✅ Status tetap "Streaming aktif"
- ✅ Green dot tetap pulse
- ✅ Last Heartbeat update setiap 3 detik
- ✅ Tidak ada disconnect

**Debug:**
```javascript
// Check signals
Object.keys(localStorage)
  .filter(k => k.startsWith('hp_cam_signal'))
  .forEach(k => console.log(k, localStorage.getItem(k)))
```

## 2️⃣ Stop Mechanism Testing

### Test 6: Stop dari PC
**Steps:**
1. Klik "Stop Streaming" di PC
2. Check HP

**Expected:**
- ✅ PC: Status "Streaming dihentikan"
- ✅ PC: Redirect ke `/hp-cam` dalam 2 detik
- ✅ HP: Status "Koneksi dihentikan dari PC"
- ✅ HP: Kamera berhenti
- ✅ HP: Video preview hitam

### Test 7: Stop dari HP
**Steps:**
1. Klik "Stop Streaming" di HP
2. Check PC

**Expected:**
- ✅ HP: Status "Streaming dihentikan"
- ✅ HP: Kamera berhenti
- ✅ PC: Status "HP menghentikan streaming"
- ✅ PC: Red dot (disconnected)

### Test 8: Auto Disconnect (HP Mati)
**Steps:**
1. Tutup browser HP atau matikan HP
2. Tunggu di PC

**Expected:**
- ✅ PC detect disconnect dalam 10 detik
- ✅ Status: "HP terputus atau mati"
- ✅ Red dot (disconnected)
- ✅ Last heartbeat tidak update

**Debug:**
```javascript
// Monitor heartbeat
setInterval(() => {
  const now = Date.now()
  const lastHB = /* get from state */
  console.log('Time since last HB:', now - lastHB, 'ms')
}, 1000)
```

## 3️⃣ Session Persistence Testing

### Test 9: Session Saved
**Steps:**
1. Complete pairing pertama kali
2. Copy URL dari browser HP
3. Tutup browser HP
4. Buka URL yang sama lagi

**Expected:**
- ✅ Tidak ada permission dialog
- ✅ Kamera langsung aktif
- ✅ Tidak perlu scan QR lagi
- ✅ PC detect connection

**Debug:**
```javascript
// Check session
const sessions = JSON.parse(localStorage.getItem('hp_cam_sessions'))
console.log('Approved:', sessions[sessionId].approved)
// Should be true
```

### Test 10: Multiple Sessions
**Steps:**
1. Buka `/hp-cam` di PC (Tab 1)
2. Scan dengan HP 1
3. Buka `/hp-cam` di PC (Tab 2)
4. Scan dengan HP 2

**Expected:**
- ✅ 2 session berbeda dibuat
- ✅ Setiap HP punya session sendiri
- ✅ Tidak ada conflict
- ✅ Bisa monitor keduanya

**Debug:**
```javascript
// Check all sessions
const sessions = JSON.parse(localStorage.getItem('hp_cam_sessions'))
console.log('Total sessions:', Object.keys(sessions).length)
```

### Test 11: Page Refresh
**Steps:**
1. Saat streaming aktif
2. Refresh page PC
3. Refresh page HP

**Expected:**
- ✅ PC: Session tetap ada
- ✅ HP: Kamera restart otomatis
- ✅ Connection re-establish
- ✅ Tidak perlu pairing ulang

## 4️⃣ Error Handling Testing

### Test 12: Camera Permission Denied
**Steps:**
1. Scan QR Code
2. Klik "Block" saat permission dialog

**Expected:**
- ✅ Error message muncul
- ✅ "Gagal mengakses kamera: ..."
- ✅ Status: "Error"
- ✅ Tidak crash

### Test 13: Invalid Session
**Steps:**
1. Buka URL manual: `/hp-cam/viewer/invalid-session-id`

**Expected:**
- ✅ Error: "Session tidak ditemukan"
- ✅ Auto-redirect ke `/hp-cam` dalam 2 detik
- ✅ Tidak crash

### Test 14: Network Disconnect
**Steps:**
1. Streaming aktif
2. Matikan WiFi HP
3. Tunggu 10 detik

**Expected:**
- ✅ PC detect disconnect
- ✅ Status: "HP terputus atau mati"
- ✅ Red dot

### Test 15: Battery Saver Mode
**Steps:**
1. Streaming aktif
2. Enable battery saver di HP
3. Monitor connection

**Expected:**
- ⚠️ Mungkin disconnect (depends on device)
- ✅ PC detect jika disconnect
- ✅ Bisa reconnect dengan buka URL lagi

## 5️⃣ Browser Compatibility Testing

### Test 16: Chrome Desktop
- [ ] QR generation
- [ ] Viewer page
- [ ] All features work

### Test 17: Firefox Desktop
- [ ] QR generation
- [ ] Viewer page
- [ ] All features work

### Test 18: Edge Desktop
- [ ] QR generation
- [ ] Viewer page
- [ ] All features work

### Test 19: Chrome Mobile
- [ ] QR scanning
- [ ] Camera permission
- [ ] Video streaming
- [ ] All features work

### Test 20: Safari iOS
- [ ] QR scanning
- [ ] Camera permission
- [ ] Video streaming
- [ ] All features work

### Test 21: Samsung Internet
- [ ] QR scanning
- [ ] Camera permission
- [ ] Video streaming
- [ ] All features work

## 6️⃣ Performance Testing

### Test 22: CPU Usage
**Steps:**
1. Open DevTools → Performance
2. Start streaming
3. Record for 30 seconds

**Expected:**
- ✅ CPU usage < 20%
- ✅ No memory leaks
- ✅ Smooth operation

### Test 23: Battery Usage (HP)
**Steps:**
1. Check battery level
2. Stream for 10 minutes
3. Check battery level again

**Expected:**
- ✅ Battery drain reasonable
- ✅ HP tidak overheat
- ✅ Comparable to video recording

### Test 24: localStorage Size
**Steps:**
1. Stream for 5 minutes
2. Check localStorage size

**Expected:**
- ✅ Size < 1MB
- ✅ Old signals cleaned up
- ✅ No bloat

**Debug:**
```javascript
// Check localStorage size
let total = 0
for (let key in localStorage) {
  total += localStorage[key].length + key.length
}
console.log('localStorage size:', total, 'bytes')
```

## 7️⃣ Edge Cases Testing

### Test 25: Rapid Stop/Start
**Steps:**
1. Start streaming
2. Stop immediately
3. Start again
4. Repeat 5 times

**Expected:**
- ✅ No errors
- ✅ Cleanup proper
- ✅ No memory leaks

### Test 26: Multiple Tabs
**Steps:**
1. Open `/hp-cam` in 3 tabs
2. Generate 3 QR codes
3. Scan all with same HP

**Expected:**
- ✅ Only last scan works
- ✅ Previous sessions inactive
- ✅ No conflicts

### Test 27: Long Session
**Steps:**
1. Start streaming
2. Leave for 1 hour
3. Check status

**Expected:**
- ✅ Still connected
- ✅ Heartbeat still working
- ✅ No timeout

### Test 28: Incognito Mode
**Steps:**
1. Open in incognito/private mode
2. Complete full flow

**Expected:**
- ✅ Works normally
- ⚠️ Session lost after close
- ✅ No errors

## 🐛 Common Issues & Solutions

### Issue 1: QR Code tidak muncul
**Solution:**
```bash
npm install qrcode @types/qrcode
npm run dev
```

### Issue 2: Camera permission error
**Solution:**
- Check HTTPS or localhost
- Check browser permissions
- Try different browser

### Issue 3: Connection timeout
**Solution:**
- Check WiFi connection
- Disable battery saver
- Keep screen on

### Issue 4: Session tidak saved
**Solution:**
- Check localStorage enabled
- Not in incognito mode
- Clear cache and retry

## 📊 Testing Checklist

### Core Features
- [ ] QR Code generation
- [ ] QR Code scanning
- [ ] Camera permission
- [ ] Video streaming
- [ ] Session management
- [ ] Heartbeat monitoring
- [ ] Auto-disconnect
- [ ] Manual stop (PC)
- [ ] Manual stop (HP)
- [ ] Session persistence

### Error Handling
- [ ] Permission denied
- [ ] Invalid session
- [ ] Network disconnect
- [ ] Battery saver mode

### Browser Support
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

### Performance
- [ ] CPU usage OK
- [ ] Battery usage OK
- [ ] localStorage size OK
- [ ] No memory leaks

### Edge Cases
- [ ] Rapid stop/start
- [ ] Multiple tabs
- [ ] Long session
- [ ] Incognito mode

## 🎯 Test Results Template

```markdown
## Test Results - [Date]

### Environment
- PC Browser: Chrome 120
- Mobile Browser: Chrome Mobile 120
- PC OS: Windows 11
- Mobile OS: Android 13

### Test Results
| Test | Status | Notes |
|------|--------|-------|
| QR Generation | ✅ Pass | - |
| Camera Permission | ✅ Pass | - |
| Heartbeat | ✅ Pass | - |
| Stop from PC | ✅ Pass | - |
| Stop from HP | ✅ Pass | - |
| Auto Disconnect | ✅ Pass | 10s timeout |
| Session Persistence | ✅ Pass | - |
| Multiple Sessions | ✅ Pass | - |

### Issues Found
1. None

### Recommendations
1. All tests passed
2. Ready for production
```

## 🚀 Automated Testing (Future)

### Unit Tests
```typescript
// sessionManager.test.ts
describe('SessionManager', () => {
  test('generates unique session ID', () => {
    const id1 = sessionManager.generateSessionId()
    const id2 = sessionManager.generateSessionId()
    expect(id1).not.toBe(id2)
  })
})
```

### Integration Tests
```typescript
// pairing.test.ts
describe('Pairing Flow', () => {
  test('complete pairing flow', async () => {
    // Test full flow
  })
})
```

---

**Happy Testing!** 🧪

Jika menemukan bug atau issue, catat di test results dan report untuk perbaikan.
