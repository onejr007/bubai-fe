import { useState, useEffect, useRef } from 'react';
import { useParams } from '@core/Router';
import { hpCamSessionService } from '@/services/hpCamSession';
import { 
  EnhancedWebRTCPeer, 
  getOptimalVideoConstraints, 
  getFallbackVideoConstraints, 
  getMinimalVideoConstraints 
} from '../utils/enhancedWebrtcPeer';

export default function MobileCameraPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [status, setStatus] = useState<string>('Initializing...');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [videoQuality, setVideoQuality] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const webrtcRef = useRef<EnhancedWebRTCPeer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isInitializingRef = useRef(false);
  const isJoinedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID tidak ditemukan di URL');
      return;
    }

    if (isInitializingRef.current || isJoinedRef.current) {
      console.log('Skipping redundant initialization for session:', sessionId);
      return;
    }

    initializeSession();

    return () => {
      cleanup();
    };
  }, [sessionId]);

  const initializeSession = async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;
    
    try {
      console.log('🚀 Initializing mobile session:', sessionId);
      setStatus('Checking session...');
      
      // Check if session exists on backend
      const session = await hpCamSessionService.getSessionStatus(sessionId);
      console.log('📦 Session status received:', session.status);
      
      if (session.status === 'ended') {
        setError('Session sudah berakhir');
        isInitializingRef.current = false;
        return;
      }
      
      // Generate device ID for mobile
      const deviceId = `mobile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Join session (pair with PC)
      setStatus('Pairing with PC...');
      console.log('🔗 Sending join request...');
      await hpCamSessionService.joinSession({ 
        sessionId: session.sessionId, 
        deviceId 
      });
      
      isJoinedRef.current = true;
      setStatus('Paired! Requesting camera...');
      console.log('✅ Paired successfully!');
      
      // Request camera permission
      await requestCameraPermission();
      
    } catch (error: any) {
      console.error('❌ Failed to initialize session:', error);
      setError(error.message || 'Failed to connect to session');
      setStatus('Error');
    } finally {
      isInitializingRef.current = false;
    }
  };

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestCameraPermission = async () => {
    setStatus('Meminta izin kamera...');
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak support camera API. Gunakan Chrome atau Safari terbaru.');
      }

      // Try optimal constraints first
      let stream: MediaStream | null = null;
      let quality = '';

      try {
        console.log('📹 Trying optimal video constraints (1080p)...');
        const constraints = getOptimalVideoConstraints(true);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        quality = 'Full HD (1080p)';
        console.log('✅ Got optimal quality stream');
      } catch (err) {
        console.warn('⚠️ Optimal constraints failed, trying fallback (720p)...');
        try {
          const constraints = getFallbackVideoConstraints();
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          quality = 'HD (720p)';
          console.log('✅ Got fallback quality stream');
        } catch (err2) {
          console.warn('⚠️ Fallback constraints failed, trying minimal...');
          const constraints = getMinimalVideoConstraints();
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          quality = 'Standard';
          console.log('✅ Got minimal quality stream');
        }
      }

      if (!stream) {
        throw new Error('Failed to get camera stream');
      }

      streamRef.current = stream;
      
      // Display video quality info
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const actualQuality = `${settings.width}x${settings.height} @ ${settings.frameRate}fps`;
      setVideoQuality(`${quality} (${actualQuality})`);
      console.log('📊 Video settings:', settings);
      
      // Show preview on mobile
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStatus('Kamera disetujui, memulai streaming ke PC...');
      setIsStreaming(true);
      
      // Start WebRTC with backend signaling
      await startWebRTC(stream);
      
      // Start heartbeat to keep session alive
      startHeartbeat();

    } catch (err: any) {
      let errorMessage = 'Gagal mengakses kamera';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Izin kamera ditolak. Silakan izinkan akses kamera di browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Kamera tidak ditemukan. Pastikan device memiliki kamera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain dan coba lagi.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStatus('Error');
    }
  };

  const startHeartbeat = () => {
    // Send heartbeat every 3 seconds to keep session alive
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        await hpCamSessionService.getSessionStatus(sessionId);
      } catch (error) {
        console.error('Heartbeat failed:', error);
        // If session not found, stop streaming
        stopStreaming();
      }
    }, 3000);
  };



  const startWebRTC = async (stream: MediaStream) => {
    try {
      console.log('🚀 Starting Enhanced WebRTC...');
      
      webrtcRef.current = new EnhancedWebRTCPeer(
        sessionId!,
        true, // isMobile
        undefined, // onRemoteStream (mobile doesn't receive stream)
        (state) => {
          console.log('🔗 Connection state changed:', state);
          if (state === 'connected') {
            setStatus('✅ Streaming aktif ke PC');
          } else if (state === 'disconnected' || state === 'failed') {
            setStatus('⚠️ Koneksi terputus');
            setIsStreaming(false);
          }
        }
      );

      await webrtcRef.current.initialize(stream);
      
      setStatus('📡 Menunggu koneksi dari PC...');
    } catch (err: any) {
      console.error('❌ WebRTC initialization failed:', err);
      setError(`Gagal memulai streaming: ${err.message}`);
      setStatus('Error');
    }
  };

  const cleanup = () => {
    // Stop heartbeat
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Cleanup WebRTC
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
  };

  const stopStreaming = async () => {
    cleanup();
    setIsStreaming(false);
    setStatus('Streaming dihentikan');
    
    // End session on backend
    try {
      await hpCamSessionService.endSession(sessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const S = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex' as const, flexDirection: 'column' as const },
    header: { background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    content: { flex: 1, display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, padding: '1.5rem' },
    card: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' },
    errorCard: { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' },
    iconCircle: { width: '100px', height: '100px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)', animation: 'pulse 2s infinite' },
    footer: { background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', padding: '1.5rem' }
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>📱 HP Camera</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{status}</p>
      </div>

      <div style={S.content}>
        {error ? (
          <div style={S.errorCard}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem' }}>⚠️</span>
              </div>
              <p style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Error</p>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{error}</p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
              <p style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Troubleshooting:</p>
              <ul style={{ fontSize: '0.75rem', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                <li>Pastikan browser support camera</li>
                <li>Check browser permissions</li>
                <li>Coba browser lain (Chrome/Safari)</li>
                <li>Pastikan HTTPS aktif</li>
              </ul>
            </div>
          </div>
        ) : isStreaming ? (
          <div style={S.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={S.iconCircle}>
                <span style={{ fontSize: '3rem' }}>📹</span>
              </div>
              
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                Streaming Aktif
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1rem' }}>
                Kamera HP Anda sedang streaming ke PC
              </p>

              {/* Video Preview */}
              {streamRef.current && (
                <div style={{ marginBottom: '1.5rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '300px', objectFit: 'cover', background: '#000' }}
                  />
                </div>
              )}

              {videoQuality && (
                <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📊</span>
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>{videoQuality}</span>
                  </div>
                </div>
              )}
              
              <div style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                  <span style={{ color: '#065f46', fontSize: '0.875rem', fontWeight: '600' }}>LIVE</span>
                </div>
              </div>

              <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1rem' }}>✓</span>
                  <span style={{ color: '#475569', fontSize: '0.875rem' }}>Kamera aktif</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1rem' }}>✓</span>
                  <span style={{ color: '#475569', fontSize: '0.875rem' }}>Streaming ke PC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1rem' }}>✓</span>
                  <span style={{ color: '#475569', fontSize: '0.875rem' }}>Koneksi stabil</span>
                </div>
              </div>

              <button
                onClick={stopStreaming}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  fontWeight: '700',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                🛑 Stop Streaming
              </button>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
                Kamera akan berhenti streaming ke PC
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'white', fontSize: '1.1rem' }}>{status}</p>
          </div>
        )}
      </div>

      <div style={S.footer}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
          Session: {sessionId?.slice(0, 16)}...
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textAlign: 'center', marginTop: '0.25rem' }}>
          HP Camera Module v2.0
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
