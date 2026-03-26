// WebRTC Peer Connection for Video Streaming
import { SignalingChannel } from './webrtc';

export class WebRTCPeer {
  private peerConnection: RTCPeerConnection | null = null;
  private signaling: SignalingChannel;
  private isMobile: boolean;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;
  private onConnectionStateChange?: (state: string) => void;

  constructor(
    sessionId: string,
    isMobile: boolean,
    onRemoteStream?: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: string) => void
  ) {
    this.signaling = new SignalingChannel(sessionId);
    this.isMobile = isMobile;
    this.onRemoteStream = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
  }

  async initialize(localStream?: MediaStream) {
    this.localStream = localStream || null;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks if mobile
    if (this.isMobile && this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream (PC side)
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        console.log('Received remote stream');
        if (this.onRemoteStream) {
          this.onRemoteStream(event.streams[0]);
        }
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send('ice-candidate', {
          candidate: event.candidate
        }, this.isMobile ? 'mobile' : 'pc');
      }
    };

    // Handle connection state
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState || 'unknown';
      console.log('Connection state:', state);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
    };

    // Start signaling
    this.signaling.startPolling(this.isMobile ? 'mobile' : 'pc');

    // Listen for signaling messages
    this.setupSignalingListeners();
  }

  private setupSignalingListeners() {
    // Listen for offer (PC side)
    this.signaling.on('offer', async (data) => {
      if (!this.isMobile && this.peerConnection) {
        console.log('Received offer');
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.signaling.send('answer', { answer }, 'pc');
      }
    });

    // Listen for answer (Mobile side)
    this.signaling.on('answer', async (data) => {
      if (this.isMobile && this.peerConnection) {
        console.log('Received answer');
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    // Listen for ICE candidates
    this.signaling.on('ice-candidate', async (data) => {
      if (this.peerConnection && data.candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });
  }

  async createOffer() {
    if (!this.peerConnection) return;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.signaling.send('offer', { offer }, 'mobile');
  }

  cleanup() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.signaling) {
      this.signaling.cleanup();
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
