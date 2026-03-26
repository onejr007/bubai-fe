import { useState, useEffect } from 'react';
import { useNavigate } from '@core/Router';
import QRCode from 'qrcode';
import { deviceDetection } from '../utils/deviceDetection';
import { hpCamSessionService } from '@/services/hpCamSession';

export default function PairingPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [status, setStatus] = useState<string>('Generating QR Code...');
  const [isWaiting, setIsWaiting] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const navigate = useNavigate();

  useEffect(() => {
    const type = deviceDetection.getDeviceType();
    setDeviceType(type);
    if (type === 'mobile' || type === 'tablet') {
      setStatus('Please open this page on a PC');
      return;
    }
    initializePairing();
  }, []);

  useEffect(() => {
    if (!isWaiting || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          regenerateQRCode();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaiting, timeRemaining]);

  const initializePairing = async () => {
    try {
      setStatus('Creating session on server...');
      
      // Generate device ID for PC
      const deviceId = `pc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create session on backend
      const response = await hpCamSessionService.createSession(deviceId);
      
      setPairingCode(response.pairingCode);
      
      // Generate QR code with session ID
      const mobileUrl = `${window.location.origin}/hp-cam/mobile/${response.sessionId}`;
      const qrUrl = await QRCode.toDataURL(mobileUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' }
      });
      
      setQrCodeUrl(qrUrl);
      setStatus('Ready to scan');
      setIsWaiting(true);
      setTimeRemaining(300);
      
      // Start polling backend for session status
      checkSessionStatus(response.sessionId);
    } catch (error: any) {
      console.error('Failed to create session:', error);
      setStatus(`Error: ${error.message || 'Failed to create session'}`);
    }
  };

  const regenerateQRCode = async () => {
    setStatus('Regenerating...');
    await initializePairing();
  };

  const checkSessionStatus = (sessionId: string) => {
    let checkCount = 0;
    const maxChecks = 300; // 5 minutes (300 seconds)
    
    const interval = setInterval(async () => {
      checkCount++;
      
      try {
        // Poll backend for session status
        const session = await hpCamSessionService.getSessionStatus(sessionId);
        
        // Check if mobile has paired
        if (session.status === 'paired' && session.hasViewer) {
          clearInterval(interval);
          setStatus('Mobile connected! Redirecting...');
          setTimeout(() => navigate(`/hp-cam/viewer/${sessionId}`), 1500);
          return;
        }
      } catch (error: any) {
        console.error('Failed to check session status:', error);
        // If session not found or expired, stop polling
        if (error.message?.includes('not found') || error.message?.includes('expired')) {
          clearInterval(interval);
          setStatus('Session expired - Please refresh');
        }
      }
      
      // Timeout after max checks
      if (checkCount >= maxChecks) {
        clearInterval(interval);
        setStatus('Timeout - Please refresh and try again');
      }
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const S = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, padding: '2rem', position: 'relative' as const, overflow: 'hidden' as const },
    blob1: { position: 'absolute' as const, top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 20s infinite' },
    blob2: { position: 'absolute' as const, bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 25s infinite reverse' },
    card: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '32px', overflow: 'hidden' as const, boxShadow: '0 25px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' },
    flex2col: { display: 'flex' as const, flexWrap: 'wrap' as const, minHeight: '600px' },
    leftCol: { flex: '1 1 450px', display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center' as const, justifyContent: 'center' as const, padding: '3rem', background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', borderRight: '1px solid rgba(0,0,0,0.05)', position: 'relative' as const },
    rightCol: { flex: '1 1 450px', display: 'flex' as const, flexDirection: 'column' as const, justifyContent: 'center' as const, padding: '3rem', background: 'white' },
    qrBox: { display: 'inline-block' as const, padding: '1.5rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' },
    timer: { fontSize: '2.5rem', fontWeight: '700' as const, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' },
    title: { fontSize: '2.5rem', fontWeight: '800' as const, background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' },
    infoCard: { display: 'flex' as const, alignItems: 'flex-start' as const, gap: '1rem', padding: '1.25rem', borderRadius: '16px', transition: 'transform 0.2s', cursor: 'pointer' as const },
    steps: { padding: '2.5rem 3rem', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderTop: '1px solid rgba(0,0,0,0.05)' },
    stepCard: { display: 'flex' as const, alignItems: 'flex-start' as const, gap: '1rem', padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s', cursor: 'pointer' as const }
  };

  return (
    <div style={S.container}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, overflow: 'hidden' }}>
        <div style={S.blob1}></div>
        <div style={S.blob2}></div>
      </div>

      <div style={{ width: '100%', maxWidth: '1200px', position: 'relative', zIndex: 10 }}>
        {(deviceType === 'mobile' || deviceType === 'tablet') ? (
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '3rem', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(251,191,36,0.3)' }}>
              <span style={{ fontSize: '2.5rem' }}>⚠️</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>Mobile Device Detected</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Please open this page on a desktop computer.</p>
          </div>
        ) : (
          <div style={S.card}>
            <div style={S.flex2col}>
              <div style={S.leftCol}>
                <div style={{ position: 'absolute', top: '20px', left: '20px', width: '100px', height: '100px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', opacity: 0.1, filter: 'blur(40px)' }}></div>
                {qrCodeUrl ? (
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={S.qrBox}>
                      <img src={qrCodeUrl} alt="QR" style={{ width: '280px', height: '280px', display: 'block' }} />
                    </div>
                    {isWaiting && (
                      <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.9)', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '0.75rem' }}>
                          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                          <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Waiting for scan...</span>
                        </div>
                        <div style={S.timer}>{formatTime(timeRemaining)}</div>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>QR Code will refresh automatically</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', border: '4px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                    <p style={{ color: '#64748b' }}>Generating...</p>
                  </div>
                )}
              </div>

              <div style={S.rightCol}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h1 style={S.title}>HP Camera Web</h1>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Use your phone camera to scan the QR code</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { icon: '🔑', title: 'Pairing Code', value: pairingCode || 'Generating...', bg: '#dbeafe', color: '#1e40af' },
                    { icon: '⏱️', title: 'QR Expires In', value: `${formatTime(timeRemaining)} - Auto refresh`, bg: '#d1fae5', color: '#065f46' },
                    { icon: '✨', title: 'Status', value: status, bg: '#e9d5ff', color: '#581c87' }
                  ].map((card, i) => (
                    <div key={i} style={{ ...S.infoCard, background: card.bg }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{card.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: card.color, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: card.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={S.steps}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>HOW TO CONNECT</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {[
                  { num: 1, title: 'Open Camera', desc: 'Open WhatsApp - Menu - WhatsApp Web' },
                  { num: 2, title: 'Scan QR', desc: 'Point phone to screen' },
                  { num: 3, title: 'Allow Camera', desc: 'Grant permission' },
                  { num: 4, title: 'Start Streaming', desc: 'Video appears on PC' }
                ].map((step) => (
                  <div key={step.num} style={S.stepCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.1rem', flexShrink: 0 }}>{step.num}</div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{step.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>🔒 Secure end-to-end connection • No data stored</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(30px, -30px); } 66% { transform: translate(-20px, 20px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
