# HP Camera Module - Architecture

## Overview

Sistem pairing kamera HP ke PC menggunakan QR Code dan localStorage sebagai signaling channel.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         PC Browser                          │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │ PairingPage  │─────▶│ ViewerPage   │                   │
│  │              │      │              │                   │
│  │ - Gen QR     │      │ - Monitor    │                   │
│  │ - Gen Session│      │ - Heartbeat  │                   │
│  │ - Wait       │      │ - Stop       │                   │
│  └──────────────┘      └──────────────┘                   │
│         │                      │                           │
│         └──────────┬───────────┘                           │
│                    ▼                                       │
│         ┌─────────────────────┐                           │
│         │  SessionManager     │                           │
│         │  - localStorage     │                           │
│         │  - Session CRUD     │                           │
│         └─────────────────────┘                           │
│                    │                                       │
│                    ▼                                       │
│         ┌─────────────────────┐                           │
│         │  SignalingChannel   │                           │
│         │  - Send/Receive     │                           │
│         │  - Polling          │                           │
│         └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ localStorage
                     │ (Signaling)
                     │
┌─────────────────────────────────────────────────────────────┐
│                      Mobile Browser                         │
│                                                             │
│         ┌─────────────────────┐                           │
│         │ MobileCameraPage    │                           │
│         │                     │                           │
│         │ - Request Camera    │                           │
│         │ - Stream Video      │                           │
│         │ - Send Heartbeat    │                           │
│         │ - Listen Stop       │                           │
│         └─────────────────────┘                           │
│                    │                                       │
│                    ▼                                       │
│         ┌─────────────────────┐                           │
│         │  MediaStream API    │                           │
│         │  - getUserMedia     │                           │
│         │  - Video Track      │                           │
│         └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. PairingPage (PC)
**Responsibility:** Generate QR Code dan session

**Flow:**
1. Generate unique session ID
2. Save session ke localStorage
3. Generate QR Code dengan URL mobile
4. Poll localStorage untuk check approval
5. Redirect ke ViewerPage saat approved

**Key Functions:**
- `initializePairing()` - Setup session
- `checkApprovalStatus()` - Poll approval

### 2. MobileCameraPage (HP)
**Responsibility:** Request camera dan streaming

**Flow:**
1. Parse session ID dari URL
2. Check session validity
3. Check if already approved (skip permission)
4. Request camera permission
5. Start video stream
6. Send heartbeat setiap 3 detik
7. Listen for stop signal

**Key Functions:**
- `requestCameraPermission()` - Get camera access
- `startSignaling()` - Setup communication
- `startHeartbeat()` - Keep-alive signal
- `cleanup()` - Stop stream dan cleanup

### 3. ViewerPage (PC)
**Responsibility:** Monitor koneksi dan control

**Flow:**
1. Verify session
2. Setup signaling channel
3. Listen for heartbeat dari mobile
4. Check heartbeat timeout (10s)
5. Display connection status
6. Handle stop action

**Key Functions:**
- `initializeViewer()` - Setup monitoring
- `startHeartbeatCheck()` - Detect disconnect
- `stopStreaming()` - Send stop signal

## Data Flow

### Pairing Flow
```
PC: Generate Session → Save to localStorage
PC: Generate QR Code → Display
HP: Scan QR → Open URL with sessionId
HP: Request Camera → User Approve
HP: Mark session.approved = true
PC: Detect approved → Redirect to Viewer
```

### Streaming Flow
```
HP: getUserMedia() → MediaStream
HP: Display video locally
HP: Send heartbeat every 3s → localStorage
PC: Poll heartbeat every 2s
PC: Display status based on heartbeat
```

### Stop Flow
```
Option 1 - PC Stop:
PC: Send stop signal → localStorage
HP: Receive stop → cleanup()

Option 2 - HP Stop:
HP: Send stop signal → localStorage
PC: Receive stop → show disconnected

Option 3 - HP Mati:
HP: No heartbeat sent
PC: Timeout after 10s → show disconnected
```

## Storage Schema

### Session Storage
```typescript
Key: 'hp_cam_sessions'
Value: {
  [sessionId]: {
    sessionId: string;
    createdAt: number;
    approved: boolean;
    deviceInfo?: string;
  }
}
```

### Signal Storage
```typescript
Key: 'hp_cam_signal_{sessionId}_{from}_{type}_{timestamp}'
Value: {
  type: 'offer' | 'answer' | 'ice-candidate' | 'heartbeat' | 'stop';
  sessionId: string;
  data: any;
  timestamp: number;
  from: 'mobile' | 'pc';
}
```

## Signaling Mechanism

### Why localStorage?
- Simple implementation
- No server required
- Works on same origin
- Real-time sync across tabs

### Polling Strategy
- Poll every 500ms
- Process signals < 30s old
- Auto-cleanup old signals
- Separate channels for mobile/pc

### Signal Types
1. **offer** - Mobile ready signal
2. **heartbeat** - Keep-alive (every 3s)
3. **stop** - Disconnect signal
4. **answer** - (Reserved for future)
5. **ice-candidate** - (Reserved for WebRTC)

## Session Management

### Session Lifecycle
```
Created → Waiting Approval → Approved → Active → Stopped
```

### Session Persistence
- Saved in localStorage
- Survives page refresh
- Survives browser restart
- Manual cleanup required

### Session Validation
- Check existence
- Check approval status
- Check timestamp (optional expiry)

## Security Considerations

### Current Implementation
- Session ID: timestamp + random
- No authentication
- No encryption
- Same-origin only

### Production Recommendations
1. Add session expiry (24h)
2. Add authentication token
3. Use HTTPS only
4. Implement rate limiting
5. Add session encryption
6. Server-side validation

## Performance

### Optimization Points
1. **Polling Interval**
   - Current: 500ms
   - Adjustable based on needs
   - Trade-off: latency vs CPU

2. **Heartbeat Interval**
   - Current: 3s
   - Adjustable for battery
   - Trade-off: detection speed vs battery

3. **Signal Cleanup**
   - Auto-delete after 30s
   - Prevents localStorage bloat
   - Runs on every poll

4. **Video Resolution**
   - Default: 1280x720
   - Adjustable for bandwidth
   - Trade-off: quality vs performance

## Future Enhancements

### Phase 2
- [ ] WebRTC peer connection
- [ ] Actual video streaming to PC
- [ ] Audio support
- [ ] Multiple camera support

### Phase 3
- [ ] Recording capability
- [ ] Screenshot feature
- [ ] Zoom controls
- [ ] Flash control

### Phase 4
- [ ] Server-side signaling
- [ ] WebSocket for real-time
- [ ] Multi-device support
- [ ] Cloud storage integration
