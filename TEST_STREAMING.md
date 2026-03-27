# Test Streaming - Quick Guide

> **Quick test guide untuk memverifikasi video streaming berfungsi**

## 🚀 Quick Test (5 Minutes)

### Step 1: Start Backend
```bash
cd BE
npm run dev
```
**Verify**: Backend running di http://localhost:3000

### Step 2: Start Frontend
```bash
cd FE
npm run dev
```
**Verify**: Frontend running di http://localhost:5173

### Step 3: Open PC Browser
1. Buka http://localhost:5173/hp-cam
2. Klik "Start Pairing"
3. QR Code akan muncul
4. **Jangan tutup tab ini**

### Step 4: Open Mobile Browser
1. Scan QR Code dengan kamera HP
2. Atau manual: Buka URL yang ditampilkan di bawah QR
3. Klik "Allow" saat diminta izin kamera
4. **Tunggu 3-5 detik**

### Step 5: Verify on PC
✅ **Expected Result:**
- Video dari kamera HP muncul di PC
- Status: "✅ Video streaming dari HP"
- Quality indicator menunjukkan resolusi (e.g., "1920x1080 @ 30fps")
- Video TIDAK hitam/blank

❌ **If Black Screen:**
- Check browser console (F12)
- Look for errors
- See troubleshooting below

## 🔍 Troubleshooting

### Black Screen on PC

**Check 1: Console Logs**
```
Expected logs:
✅ 📡 Received remote stream
✅ ✅ Peer connection established
✅ 🔗 Connection state: connected
```

**Check 2: Video Element**
```javascript
// In browser console (PC)
const video = document.querySelector('video');
console.log('Has stream:', !!video.srcObject);
console.log('Tracks:', video.srcObject?.getTracks());
console.log('Video size:', video.videoWidth, 'x', video.videoHeight);
```

**Check 3: Network**
- Both devices on same WiFi?
- Firewall disabled?
- Using localhost (not production)?

### Camera Permission Denied

**Mobile shows error:**
- Go to browser settings
- Allow camera permission
- Refresh page
- Try again

### Connection Failed

**Possible causes:**
1. Backend not running
2. Wrong API URL in .env
3. CORS issue
4. Session expired

**Solution:**
```bash
# Restart backend
cd BE
npm run dev

# Check .env
cat .env | grep CORS_ORIGIN
# Should be: CORS_ORIGIN=http://localhost:5173
```

## 📊 Success Indicators

### Mobile Side
- ✅ "Streaming Aktif" message
- ✅ Video preview showing
- ✅ Quality indicator (e.g., "Full HD (1920x1080 @ 30fps)")
- ✅ Green "LIVE" badge
- ✅ Checkmarks: Kamera aktif, Streaming ke PC, Koneksi stabil

### PC Side
- ✅ Video playing (NOT black)
- ✅ "✅ Video streaming dari HP" status
- ✅ Red "LIVE" badge pulsing
- ✅ Quality shows resolution
- ✅ Connection: Connected
- ✅ Screenshot button enabled
- ✅ Recording button enabled

## 🧪 Feature Tests

### Test Screenshot
1. Click "📸 Screenshot" button
2. Image should download
3. Open image - should show current frame

### Test Recording
1. Click "⏺️ Start Recording"
2. Wait 5-10 seconds
3. Click "⏹️ Stop Recording"
4. Video file should download
5. Play video - should show recorded stream

### Test Disconnect
1. Click "🔌 Disconnect" on PC
2. Mobile should show "Streaming dihentikan"
3. PC should redirect to pairing page

### Test Stop from Mobile
1. Click "🛑 Stop Streaming" on mobile
2. PC should show "⚠️ Koneksi terputus"
3. Both should cleanup properly

## 📱 Browser Compatibility

### Recommended
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop)
- ✅ Safari (iOS)

### Supported
- ⚠️ Firefox (Desktop & Mobile) - may have issues
- ⚠️ Samsung Internet - may have issues

### Not Supported
- ❌ Internet Explorer
- ❌ Old browsers without WebRTC

## 🔧 Development Tips

### Enable Verbose Logging
```javascript
// In browser console
localStorage.setItem('debug', 'simple-peer');
// Reload page
```

### Check WebRTC Stats
```javascript
// In browser console (PC)
const peer = webrtcRef.current;
const stats = await peer.getStats();
stats.forEach(report => {
  if (report.type === 'inbound-rtp' && report.kind === 'video') {
    console.log('Video stats:', report);
  }
});
```

### Monitor Network
```javascript
// In browser console
const pc = peer._pc; // Access underlying RTCPeerConnection
pc.getStats().then(stats => {
  stats.forEach(report => {
    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
      console.log('Connection type:', report.currentRoundTripTime);
    }
  });
});
```

## 📈 Performance Expectations

### Good Performance
- Connection time: < 5 seconds
- First frame: < 1 second after connection
- Latency: 100-300ms
- Frame rate: 24-30fps
- No dropped frames

### Acceptable Performance
- Connection time: 5-10 seconds
- First frame: 1-3 seconds
- Latency: 300-500ms
- Frame rate: 15-24fps
- Occasional dropped frames

### Poor Performance
- Connection time: > 10 seconds
- First frame: > 3 seconds
- Latency: > 500ms
- Frame rate: < 15fps
- Frequent dropped frames

**If poor performance:**
- Check network bandwidth
- Close other apps
- Reduce video quality
- Use wired connection

## ✅ Final Checklist

Before reporting issue:
- [ ] Backend running
- [ ] Frontend running
- [ ] Both on same network
- [ ] Camera permission granted
- [ ] HTTPS (or localhost)
- [ ] Modern browser
- [ ] Console checked for errors
- [ ] Video element has srcObject
- [ ] Tracks present in stream

If all checked and still black screen:
- See [VIDEO_STREAMING_GUIDE.md](./src/modules/hp-cam/VIDEO_STREAMING_GUIDE.md)
- See [STREAMING_FIX_NOTES.md](./src/modules/hp-cam/STREAMING_FIX_NOTES.md)
- Check GitHub issues
- Contact support

---

**Version**: 2.2.0  
**Last Updated**: 2024-03-28
