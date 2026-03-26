# 📹 WebRTC Video Streaming Guide

## ✅ Fitur Baru: Video Streaming HP ke PC

Sekarang video dari kamera HP akan muncul di PC browser, bukan di HP!

### 🎯 Cara Kerja

1. **PC**: Generate QR Code dan tampilkan viewer
2. **HP**: Scan QR → Approve camera → Streaming dimulai
3. **PC**: Menerima video stream dari HP dan menampilkan
4. **HP**: Hanya menampilkan status "Streaming Aktif"

### 📱 User Experience

#### Di HP:
- ✅ Scan QR Code
- ✅ Approve camera permission
- ✅ Lihat status "Streaming Aktif ke PC"
- ✅ Tidak ada video preview (hemat battery)
- ✅ Tombol Stop untuk menghentikan

#### Di PC:
- ✅ Generate QR Code
- ✅ Auto-redirect ke viewer
- ✅ Lihat video stream dari HP
- ✅ Monitor connection status
- ✅ Tombol Stop untuk menghentikan

## 🔧 Teknologi

### WebRTC
- Peer-to-peer video streaming
- Low latency
- High quality
- Secure (HTTPS required)

### STUN Servers
```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun1.l.google.com:19302' }
  ]
}
```

### Signaling
- LocalStorage-based signaling
- Offer/Answer exchange
- ICE candidate exchange
- Connection state monitoring

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                         PC                              │
│                                                         │
│  1. Generate QR Code                                    │
│  2. Show Viewer Page                                    │
│  3. Initialize WebRTC (PC side)                         │
│  4. Wait for offer from HP                              │
│  5. Receive offer → Create answer                       │
│  6. Exchange ICE candidates                             │
│  7. Receive video stream                                │
│  8. Display video in <video> element                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         ↕
              LocalStorage Signaling
                         ↕
┌─────────────────────────────────────────────────────────┐
│                         HP                              │
│                                                         │
│  1. Scan QR Code                                        │
│  2. Request camera permission                           │
│  3. Get MediaStream                                     │
│  4. Initialize WebRTC (Mobile side)                     │
│  5. Add video track to peer connection                  │
│  6. Create offer                                        │
│  7. Wait for answer from PC                             │
│  8. Exchange ICE candidates                             │
│  9. Stream video to PC                                  │
│  10. Show "Streaming Aktif" status                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Test Flow:
```
1. PC: Open https://bub-ai.web.app/hp-cam
2. PC: QR Code muncul
3. HP: Scan QR Code
4. HP: Klik "Allow" untuk camera
5. HP: Lihat "Streaming Aktif ke PC"
6. PC: Video dari HP muncul
7. PC/HP: Klik Stop untuk menghentikan
```

### Expected Results:
- ✅ HP tidak menampilkan video preview
- ✅ PC menampilkan video dari HP
- ✅ Video quality bagus (720p atau default)
- ✅ Latency rendah (< 1 second)
- ✅ Connection stable

## 🐛 Troubleshooting

### Video tidak muncul di PC

**Check 1: Connection State**
```
F12 → Console
Look for: "Connection state: connected"
```

**Check 2: ICE Candidates**
```
F12 → Console
Look for: "Received remote stream"
```

**Check 3: STUN Server**
```
Check if STUN servers accessible
Try different network
```

**Solution:**
- Refresh both PC and HP
- Clear localStorage
- Try again

### Video lag atau stuttering

**Penyebab:**
- Network slow
- CPU overload
- Resolution too high

**Solution:**
- Use WiFi instead of mobile data
- Close other apps
- Lower resolution (auto-fallback)

### Connection failed

**Penyebab:**
- Firewall blocking WebRTC
- NAT traversal failed
- STUN server unreachable

**Solution:**
- Check firewall settings
- Try different network
- Use VPN if needed

## 🔐 Security

### HTTPS Required
- ✅ WebRTC requires secure context
- ✅ Firebase Hosting provides HTTPS
- ✅ Camera API requires HTTPS

### Peer-to-Peer
- Video streams directly between devices
- No server in the middle (after signaling)
- Low latency, high privacy

### Signaling Security
- LocalStorage-based (same origin)
- Session ID required
- No external signaling server

## 📈 Performance

### Video Quality
- Default: 1280x720 (720p)
- Fallback: Browser default
- Bitrate: Auto-adjusted by WebRTC

### Latency
- Typical: 200-500ms
- Best case: < 200ms
- Worst case: 1-2s

### Battery Usage (HP)
- Camera: High
- Streaming: Medium
- Total: Similar to video recording

### Network Usage
- Bitrate: ~1-3 Mbps (depends on quality)
- Protocol: UDP (WebRTC)
- Recommended: WiFi

## 💡 Best Practices

### For Users:
1. Use WiFi for both devices
2. Keep HP plugged in (battery drain)
3. Close other apps on HP
4. Use stable network
5. Keep screen on during streaming

### For Developers:
1. Handle all connection states
2. Implement reconnection logic
3. Monitor connection quality
4. Provide clear status messages
5. Test on multiple devices

## 🔄 Connection States

### States:
- `new` - Initial state
- `connecting` - Establishing connection
- `connected` - ✅ Streaming active
- `disconnected` - Connection lost
- `failed` - Connection failed
- `closed` - Connection closed

### Handling:
```typescript
onConnectionStateChange: (state) => {
  if (state === 'connected') {
    // Show video
  } else if (state === 'failed') {
    // Show error, retry
  }
}
```

## 📚 API Reference

### WebRTCPeer Class

```typescript
class WebRTCPeer {
  constructor(
    sessionId: string,
    isMobile: boolean,
    onRemoteStream?: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: string) => void
  )
  
  async initialize(localStream?: MediaStream): Promise<void>
  async createOffer(): Promise<void>
  cleanup(): void
}
```

### Usage (Mobile):
```typescript
const peer = new WebRTCPeer(
  sessionId,
  true, // isMobile
  undefined, // no remote stream on mobile
  (state) => console.log('State:', state)
);

await peer.initialize(cameraStream);
await peer.createOffer();
```

### Usage (PC):
```typescript
const peer = new WebRTCPeer(
  sessionId,
  false, // PC
  (stream) => {
    videoElement.srcObject = stream;
  },
  (state) => console.log('State:', state)
);

await peer.initialize();
```

## ✅ Success Indicators

Everything working if:
- ✅ HP shows "Streaming Aktif ke PC"
- ✅ PC shows video from HP
- ✅ Video quality good
- ✅ Latency low
- ✅ Connection stable
- ✅ Can stop from PC or HP

## 🎉 Features

- ✅ WebRTC peer-to-peer streaming
- ✅ Video only on PC (not on HP)
- ✅ Auto-resolution fallback
- ✅ Connection state monitoring
- ✅ ICE candidate exchange
- ✅ STUN server support
- ✅ Clean UI on both sides
- ✅ Stop from PC or HP

---

**Version:** 1.2.0
**Last Updated:** 2026-03-26
**Status:** ✅ WebRTC Implemented
