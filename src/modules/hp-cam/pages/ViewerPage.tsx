import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@core/Router';
import { hpCamSessionService } from '@/services/hpCamSession';
import { EnhancedWebRTCPeer } from '../utils/enhancedWebrtcPeer';

export default function ViewerPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Menunggu HP...');
  const [isConnected, setIsConnected] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoQuality, setVideoQuality] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webrtcRef = useRef<EnhancedWebRTCPeer | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/hp-cam');
      return;
    }

    initializeViewer();

    return () => {
      cleanup();
    };
  }, [sessionId]);

  const initializeViewer = async () => {
    try {
      setStatus('Checking session...');
      
      // Check session status on backend
      const session = await hpCamSessionService.getSessionStatus(sessionId);
      
      if (session.status === 'ended') {
        setStatus('Session ended');
        setTimeout(() => navigate('/hp-cam'), 3000);
        return;
      }
      
      if (session.status === 'paired' && session.hasViewer) {
        setStatus('Mobile paired! Initializing connection...');
        await initializeWebRTC();
      } else {
        setStatus('Waiting for mobile to scan QR...');
        startSessionPolling();
      }
      
    } catch (error: any) {
      console.error('Failed to initialize viewer:', error);
      setStatus(`Error: ${error.message || 'Failed to connect'}`);
    }
  };

  const startSessionPolling = () => {
    // Poll backend every 2 seconds to check if mobile has paired
    sessionCheckIntervalRef.current = setInterval(async () => {
      try {
        const session = await hpCamSessionService.getSessionStatus(sessionId);
        
        if (session.status === 'paired' && session.hasViewer) {
          if (sessionCheckIntervalRef.current) {
            clearInterval(sessionCheckIntervalRef.current);
            sessionCheckIntervalRef.current = null;
          }
          setStatus('Mobile paired! Initializing connection...');
          await initializeWebRTC();
        }
      } catch (error: any) {
        console.error('Session polling error:', error);
        if (error.message?.includes('not found') || error.message?.includes('expired')) {
          if (sessionCheckIntervalRef.current) {
            clearInterval(sessionCheckIntervalRef.current);
            sessionCheckIntervalRef.current = null;
          }
          setStatus('Session expired');
          setTimeout(() => navigate('/hp-cam'), 3000);
        }
      }
    }, 2000);
  };

  const initializeWebRTC = async () => {
    try {
      setStatus('Memulai koneksi WebRTC...');
      
      console.log('🚀 Initializing Enhanced WebRTC for viewer...');
      
      webrtcRef.current = new EnhancedWebRTCPeer(
        sessionId!,
        false, // isViewer (not mobile)
        (stream) => {
          console.log('📡 Received stream from mobile');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasVideo(true);
            setStatus('✅ Video streaming dari HP');
            
            // Get video quality info
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
              const settings = videoTrack.getSettings();
              const quality = `${settings.width}x${settings.height} @ ${settings.frameRate}fps`;
              setVideoQuality(quality);
              console.log('📊 Video quality:', quality);
            }
          }
        },
        (state) => {
          console.log('🔗 Connection state changed:', state);
          if (state === 'connected') {
            setIsConnected(true);
            setStatus('✅ Terhubung dengan HP');
            startHeartbeat();
          } else if (state === 'connecting') {
            setStatus('🔄 Menghubungkan...');
          } else if (state === 'disconnected' || state === 'failed') {
            setIsConnected(false);
            setHasVideo(false);
            setStatus('⚠️ Koneksi terputus');
            setVideoQuality('');
            stopHeartbeat();
          }
        }
      );

      await webrtcRef.current.initialize();
      setStatus('⏳ Menunggu stream dari HP...');
      
    } catch (err: any) {
      console.error('❌ WebRTC initialization failed:', err);
      setStatus(`Error: ${err.message}`);
    }
  };

  const startHeartbeat = () => {
    // Check session status every 5 seconds to detect if mobile disconnected
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const session = await hpCamSessionService.getSessionStatus(sessionId);
        
        if (session.status === 'ended') {
          stopStreaming();
        }
      } catch (error) {
        console.error('Heartbeat failed:', error);
        // If session not found, stop streaming
        stopStreaming();
      }
    }, 5000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const cleanup = () => {
    // Stop heartbeat
    stopHeartbeat();
    
    // Stop session polling
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
      sessionCheckIntervalRef.current = null;
    }
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    
    // Cleanup WebRTC
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
    
    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const stopStreaming = async () => {
    cleanup();
    setStatus('Streaming dihentikan');
    setIsConnected(false);
    setHasVideo(false);
    
    // End session on backend
    try {
      await hpCamSessionService.endSession(sessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
    
    navigate('/hp-cam');
  };

  const takeScreenshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `screenshot-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    recordedChunksRef.current = [];

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const S = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex' as const, flexDirection: 'column' as const },
    header: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    content: { flex: 1, padding: '2rem', display: 'flex' as const, flexDirection: 'column' as const, gap: '1.5rem' },
    videoContainer: { position: 'relative' as const, background: '#000', borderRadius: '24px', overflow: 'hidden' as const, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
    video: { width: '100%', height: 'auto', display: 'block' as const, minHeight: '400px', maxHeight: '70vh', objectFit: 'contain' as const },
    controls: { display: 'flex' as const, gap: '1rem', flexWrap: 'wrap' as const, justifyContent: 'center' as const },
    btn: { padding: '1rem 2rem', borderRadius: '12px', border: 'none', fontWeight: '700' as const, fontSize: '1rem', cursor: 'pointer' as const, transition: 'all 0.3s', display: 'flex' as const, alignItems: 'center' as const, gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
    badge: { position: 'absolute' as const, top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex' as const, alignItems: 'center' as const, gap: '0.5rem' }
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' }}>
              <span style={{ fontSize: '1.5rem' }}>🖥️</span>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>PC Viewer</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', background: isConnected ? '#10b981' : '#fbbf24', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{status}</span>
              </div>
            </div>
          </div>
          {hasVideo && (
            <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'pulse 2s infinite' }}>
              <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div style={S.content}>
        <div style={S.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={S.video}
          />
          
          {!hasVideo && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                {isConnected ? (
                  <div>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2.5rem' }}>📹</span>
                    </div>
                    <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Waiting for video stream...</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Camera is connecting</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                    <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{status}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Please scan QR code with your phone</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {hasVideo && isRecording && (
            <div style={S.badge}>
              <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>REC {formatRecordingTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {hasVideo && (
          <div style={S.controls}>
            <button
              onClick={takeScreenshot}
              style={{ ...S.btn, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '1.25rem' }}>📸</span>
              <span>Screenshot</span>
            </button>

            {!isRecording ? (
              <button
                onClick={startRecording}
                style={{ ...S.btn, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '1.25rem' }}>⏺️</span>
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                style={{ ...S.btn, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '1.25rem' }}>⏹️</span>
                <span>Stop Recording</span>
              </button>
            )}

            <button
              onClick={stopStreaming}
              style={{ ...S.btn, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '1.25rem' }}>🔌</span>
              <span>Disconnect</span>
            </button>

            <button
              onClick={() => navigate('/hp-cam')}
              style={{ ...S.btn, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '1.25rem' }}>🔄</span>
              <span>New Pairing</span>
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: isConnected ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem' }}>⚡</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: 0 }}>Connection</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 }}>
              {isConnected ? 'Connected' : 'Waiting'}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #a855f7, #9333ea)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem' }}>📊</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: 0 }}>Quality</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0, fontFamily: 'monospace' }}>
              {videoQuality || 'N/A'}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem' }}>🔑</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: 0 }}>Session</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontFamily: 'monospace', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sessionId?.slice(0, 12)}...
            </p>
          </div>
        </div>
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
