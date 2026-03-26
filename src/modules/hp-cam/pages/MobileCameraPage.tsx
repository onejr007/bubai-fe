import { useState, useEffect, useRef } from 'react';
import { useParams } from '@core/Router';
import { sessionManager } from '../utils/sessionManager';
import { WebRTCPeer } from '../utils/webrtcPeer';

export default function MobileCameraPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [status, setStatus] = useState<string>('Initializing...');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const webrtcRef = useRef<WebRTCPeer | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID tidak ditemukan di URL');
      return;
    }

    let session = sessionManager.getSession(sessionId);
    
    if (!session) {
      session = {
        sessionId: sessionId,
        createdAt: Date.now(),
        approved: false
      };
      sessionManager.saveSession(session);
      setStatus('Session dibuat, meminta izin kamera...');
    }

    if (session.approved) {
      setStatus('Session sudah approved, memulai streaming...');
      startStreaming();
    } else {
      setStatus('Meminta izin kamera...');
      requestCameraPermission();
    }

    return () => {
      cleanup();
    };
  }, [sessionId]);

  const requestCameraPermission = async () => {
    setStatus('Meminta izin kamera...');
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak support camera API. Gunakan Chrome atau Safari terbaru.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      const deviceInfo = navigator.userAgent;
      sessionManager.approveSession(sessionId!, deviceInfo);
      
      setStatus('Kamera disetujui, memulai streaming ke PC...');
      setIsStreaming(true);
      
      await startWebRTC(stream);

    } catch (err: any) {
      let errorMessage = 'Gagal mengakses kamera';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Izin kamera ditolak. Silakan izinkan akses kamera di browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Kamera tidak ditemukan. Pastikan device memiliki kamera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain dan coba lagi.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Kamera tidak support resolusi yang diminta. Mencoba dengan resolusi default...';
        retryWithLowerConstraints();
        return;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStatus('Error');
    }
  };

  const retryWithLowerConstraints = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;

      const deviceInfo = navigator.userAgent;
      sessionManager.approveSession(sessionId!, deviceInfo);
      
      setStatus('Kamera disetujui (resolusi default), streaming ke PC...');
      setIsStreaming(true);
      setError('');
      
      await startWebRTC(stream);

    } catch (err: any) {
      setError(`Gagal mengakses kamera: ${err.message || 'Unknown error'}`);
      setStatus('Error');
    }
  };

  const startStreaming = async () => {
    setStatus('Memulai streaming...');
    await requestCameraPermission();
  };

  const startWebRTC = async (stream: MediaStream) => {
    try {
      webrtcRef.current = new WebRTCPeer(
        sessionId!,
        true,
        undefined,
        (state) => {
          if (state === 'connected') {
            setStatus('Streaming aktif ke PC');
          } else if (state === 'disconnected' || state === 'failed') {
            setStatus('Koneksi terputus');
            setIsStreaming(false);
          }
        }
      );

      await webrtcRef.current.initialize(stream);
      await webrtcRef.current.createOffer();
      
      setStatus('Streaming aktif ke PC');
    } catch (err: any) {
      setError(`Gagal memulai streaming: ${err.message}`);
      setStatus('Error');
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
  };

  const stopStreaming = () => {
    cleanup();
    setIsStreaming(false);
    setStatus('Streaming dihentikan');
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
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Kamera HP Anda sedang streaming ke PC
              </p>
              
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
