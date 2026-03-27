# Video Streaming Guide - HP Camera Module

> **v2.2 - Enhanced WebRTC Implementation**

## 📹 Overview

HP Camera Module menggunakan WebRTC (Web Real-Time Communication) untuk streaming video dari HP ke PC secara peer-to-peer dengan signaling melalui backend.

## 🏗️ Architecture

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   Mobile    │                    │   Backend   │                    │     PC      │
│   Camera    │                    │  Signaling  │                    │   Viewer    │
└─────────────┘                    └─────────────┘                    └─────────────┘
       │                                  │                                  │
       │ 1. Create Session                │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │ 2. Get Session ID & QR           │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │                                  │ 3. Scan QR & Join Session        │
       │                                  │<─────────────────────────────────│
       │                                  │                                  │
       │ 4. Start Camera & Create Peer    │                                  │
       │ (initiator=true)                 │                                  │
       │                                  │                                  │
       │ 5. Send Offer                    │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │ 6. Poll & Get Offer              │
       │                                  │<─────────────────────────────────│
       │                                  │                                  │
       │                                  │ 7. Send Answer                   │
       │ 8. Poll & Get Answer             │<─────────────────────────────────│
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │ 9. Exchange ICE Candidates       │                                  │
       │<────────────────────────────────>│<────────────────────────────────>│
       │                                  │                                  │
       │ 10. P2P Connection Established   │                                  │
       │<═══════════════════════════════════════════════════════════════════>│
       │                                  │                                  │
       │ 11. Video Stream (Direct P2P)    │                                  │
       │═════════════════════════════════════════════════════════════════════>│
```

## 🎥 Video Quality Tiers

### Tier 1: Full HD (Optimal)
- Resolution: 1920x1080
- Frame Rate: 30fps
- Aspect Ratio: 16:9
- Use Case: High-quality streaming on good network

### Tier 2: HD (Fallback)
- Resolution: 1280x720
- Frame Rate: 24fps
- Use Case: Medium-quality streaming, moderate network

### Tier 3: Standard (Minimal)
- Resolution: Browser default
- Frame Rate: Browser default
- Use Case: Low-end devices or poor network

## 🔧 Implementation Details

### Simple-Peer Library

We use `simple-peer` for WebRTC implementation because:
- ✅ Handles complex WebRTC signaling automatically
- ✅ Unified API for offer/answer/ICE candidates
- ✅ Better error handling
- ✅ Trickle ICE support
- ✅ Cross-browser compatibility
- ✅ Active maintenance and community support

### STUN Servers

Multiple STUN servers for better connectivity:
```javascript
[
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun.services.mozilla.com' },
  { urls: 'stun:stun.stunprotocol.org:3478' },
]
```

### Video Constraints

```typescript
// Optimal (Mobile)
{
  video: {
    facingMode: 'environment',
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
    frameRate: { min: 15, ideal: 30, max: 30 },
    aspectRatio: { ideal: 16/9 }
  },
  audio: false
}
```

## 🐛 Troubleshooting

### Black Screen on Viewer

**Symptoms**: Viewer shows black screen instead of video

**Causes**:
1. Stream not properly attached to video element
2. WebRTC connection not established
3. ICE candidates not exchanged
4. Firewall blocking WebRTC

**Solutions**:
1. Check browser console for errors
2. Verify both devices are on same network (or TURN server configured)
3. Check video element `srcObject` is set
4. Verify `autoPlay` and `playsInline` attributes
5. Check mobile camera permissions granted

### No Video Track Received

**Symptoms**: Connection established but no video

**Causes**:
1. Mobile didn't add video track to peer
2. Video track stopped before connection
3. Browser doesn't support video codec

**Solutions**:
1. Verify `stream.getTracks()` on mobile has video track
2. Check track `readyState` is 'live'
3. Try different browser (Chrome recommended)
4. Check camera not used by another app

### Connection Failed

**Symptoms**: Peer connection state shows 'failed'

**Causes**:
1. Network firewall blocking WebRTC
2. NAT traversal failed
3. STUN servers unreachable
4. Signaling errors

**Solutions**:
1. Use HTTPS (required for WebRTC)
2. Configure TURN server for NAT traversal
3. Check network allows UDP traffic
4. Verify backend signaling working

### Poor Video Quality

**Symptoms**: Video is pixelated or laggy

**Causes**:
1. Network bandwidth insufficient
2. CPU overload on mobile
3. Wrong video constraints
4. Codec not optimized

**Solutions**:
1. Reduce video resolution (use fallback tier)
2. Lower frame rate
3. Close other apps on mobile
4. Use better network connection
5. Check CPU usage

## 📊 Monitoring & Debugging

### Browser Console Logs

Look for these key logs:
```
🚀 Initializing Mobile/Viewer peer
📤 Sending signal: offer/answer/ice-candidate
📥 Received signal: offer/answer/ice-candidate
📡 Received remote stream
✅ Peer connection established
🔗 Connection state: connected
```

### Video Element Inspection

Check video element in DevTools:
```javascript
// In browser console
const video = document.querySelector('video');
console.log('srcObject:', video.srcObject);
console.log('Tracks:', video.srcObject?.getTracks());
console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
console.log('Ready state:', video.readyState);
```

### WebRTC Stats

Get connection statistics:
```javascript
// In browser console (if peer exposed)
const stats = await webrtcRef.current.getStats();
stats.forEach(report => {
  if (report.type === 'inbound-rtp' && report.kind === 'video') {
    console.log('Bytes received:', report.bytesReceived);
    console.log('Packets lost:', report.packetsLost);
    console.log('Frame rate:', report.framesPerSecond);
  }
});
```

## 🔒 Security Considerations

### HTTPS Required

WebRTC requires HTTPS in production:
- Camera access requires secure context
- getUserMedia() blocked on HTTP
- Use localhost for development only

### Permissions

Required browser permissions:
- Camera access (mobile)
- Microphone access (if audio enabled)

### Network Security

- WebRTC uses DTLS-SRTP for encryption
- Signaling should use HTTPS/WSS
- Consider authentication for sessions
- Implement session expiry

## 🚀 Performance Optimization

### Mobile Side

1. **Use back camera**: `facingMode: 'environment'`
2. **Optimize resolution**: Start with 720p, upgrade if network allows
3. **Limit frame rate**: 24-30fps is sufficient
4. **Close other apps**: Free up CPU and memory
5. **Good lighting**: Reduces encoding complexity

### Viewer Side

1. **Hardware acceleration**: Enable in browser settings
2. **Close unused tabs**: Free up resources
3. **Wired connection**: Better than WiFi for stability
4. **Modern browser**: Chrome/Edge recommended

### Network

1. **Same network**: Reduces latency
2. **5GHz WiFi**: Better than 2.4GHz
3. **Wired connection**: Best for PC
4. **QoS settings**: Prioritize WebRTC traffic

## 📈 Future Enhancements

### Phase 2
- [ ] Adaptive bitrate based on network conditions
- [ ] Audio support
- [ ] Multiple camera support (front/back switch)
- [ ] Zoom and focus controls

### Phase 3
- [ ] TURN server for NAT traversal
- [ ] Recording on server side
- [ ] Multiple viewers support
- [ ] Screen sharing from mobile

### Phase 4
- [ ] AI-powered video enhancement
- [ ] Object detection overlay
- [ ] Augmented reality features
- [ ] Cloud storage integration

## 📚 References

- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Simple-Peer Documentation](https://github.com/feross/simple-peer)
- [getUserMedia Constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [WebRTC Samples](https://webrtc.github.io/samples/)

---

**Version**: 2.2
**Last Updated**: 2024-03-28
