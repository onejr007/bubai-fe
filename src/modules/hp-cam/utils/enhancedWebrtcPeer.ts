// Enhanced WebRTC Peer with Simple-Peer for Better Video Streaming
import SimplePeer from 'simple-peer';
import { hpCamSessionService } from '@/services/hpCamSession';

export interface WebRTCConfig {
  video?: {
    width?: { min?: number; ideal?: number; max?: number };
    height?: { min?: number; ideal?: number; max?: number };
    frameRate?: { min?: number; ideal?: number; max?: number };
    facingMode?: 'user' | 'environment';
  };
  audio?: boolean;
}

export class EnhancedWebRTCPeer {
  private peer: SimplePeer.Instance | null = null;
  private sessionId: string;
  private isMobile: boolean;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;
  private onConnectionStateChange?: (state: string) => void;
  private signalPollingCleanup?: () => void;
  private isInitialized: boolean = false;

  constructor(
    sessionId: string,
    isMobile: boolean,
    onRemoteStream?: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: string) => void
  ) {
    this.sessionId = sessionId;
    this.isMobile = isMobile;
    this.onRemoteStream = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
  }

  async initialize(localStream?: MediaStream) {
    if (this.isInitialized) {
      console.warn('⚠️ Peer already initialized');
      return;
    }

    this.localStream = localStream || null;
    this.isInitialized = true;

    console.log(`🚀 Initializing ${this.isMobile ? 'Mobile' : 'Viewer'} peer`);

    // Create SimplePeer instance
    this.peer = new SimplePeer({
      initiator: this.isMobile, // Mobile initiates the connection
      stream: this.localStream || undefined,
      trickle: true, // Enable trickle ICE for faster connection
      config: {
        iceServers: [
          // Google STUN servers
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          // Additional STUN servers for better connectivity
          { urls: 'stun:stun.services.mozilla.com' },
          { urls: 'stun:stun.stunprotocol.org:3478' },
        ],
      },
      // Optimize video codec preferences
      offerOptions: {
        offerToReceiveAudio: false,
        offerToReceiveVideo: true,
      },
    });

    // Handle signaling data (offer/answer/ice-candidates)
    this.peer.on('signal', async (data) => {
      console.log('📤 Sending signal:', data.type || 'ice-candidate');
      try {
        await hpCamSessionService.sendSignal(
          this.sessionId,
          data.type === 'offer' ? 'offer' : data.type === 'answer' ? 'answer' : 'ice-candidate',
          this.isMobile ? 'mobile' : 'viewer',
          data
        );
      } catch (error) {
        console.error('❌ Failed to send signal:', error);
      }
    });

    // Handle incoming stream (PC side)
    this.peer.on('stream', (stream) => {
      console.log('📡 Received remote stream');
      console.log('Stream tracks:', stream.getTracks().map(t => `${t.kind}: ${t.label}`));
      
      if (this.onRemoteStream) {
        this.onRemoteStream(stream);
      }
    });

    // Handle connection events
    this.peer.on('connect', () => {
      console.log('✅ Peer connection established');
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange('connected');
      }
    });

    this.peer.on('close', () => {
      console.log('🔌 Peer connection closed');
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange('disconnected');
      }
    });

    this.peer.on('error', (err) => {
      console.error('❌ Peer error:', err);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange('failed');
      }
    });

    // Start polling for signals from backend
    this.startSignalPolling();
  }

  private startSignalPolling() {
    const forDevice = this.isMobile ? 'mobile' : 'viewer';
    
    console.log(`🔄 Starting signal polling for ${forDevice}`);
    
    this.signalPollingCleanup = hpCamSessionService.startSignalPolling(
      this.sessionId,
      forDevice,
      async (signal) => {
        if (!this.peer) return;

        console.log('📥 Received signal:', signal.type);
        
        try {
          // SimplePeer handles all signal types uniformly
          this.peer.signal(signal.data);
        } catch (error) {
          console.error('❌ Error processing signal:', error);
        }
      },
      (error) => {
        console.error('❌ Signal polling error:', error);
      },
      1000 // Poll every 1 second
    );
  }

  cleanup() {
    console.log('🧹 Cleaning up Enhanced WebRTC peer');
    
    this.isInitialized = false;
    
    // Stop signal polling
    if (this.signalPollingCleanup) {
      this.signalPollingCleanup();
      this.signalPollingCleanup = undefined;
    }
    
    // Destroy peer connection
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Stopped track: ${track.kind}`);
      });
      this.localStream = null;
    }
  }

  // Get connection stats for monitoring
  async getStats(): Promise<RTCStatsReport | null> {
    if (!this.peer || !(this.peer as any)._pc) {
      return null;
    }

    try {
      const pc = (this.peer as any)._pc as RTCPeerConnection;
      return await pc.getStats();
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }
}

// Helper function to get optimal video constraints
export function getOptimalVideoConstraints(isMobile: boolean): MediaStreamConstraints {
  if (isMobile) {
    return {
      video: {
        facingMode: 'environment', // Use back camera
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
        frameRate: { min: 15, ideal: 30, max: 30 },
        aspectRatio: { ideal: 16 / 9 },
      },
      audio: false,
    };
  } else {
    return {
      video: true,
      audio: false,
    };
  }
}

// Helper function to get fallback constraints if optimal fails
export function getFallbackVideoConstraints(): MediaStreamConstraints {
  return {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 24 },
    },
    audio: false,
  };
}

// Helper function to get minimal constraints as last resort
export function getMinimalVideoConstraints(): MediaStreamConstraints {
  return {
    video: true,
    audio: false,
  };
}
