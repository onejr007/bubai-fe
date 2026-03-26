// WebRTC Peer Connection for Video Streaming with Backend Signaling
import { hpCamSessionService, WebRTCSignal } from '@/services/hpCamSession';

export class WebRTCPeer {
  private peerConnection: RTCPeerConnection | null = null;
  private sessionId: string;
  private isMobile: boolean;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;
  private onConnectionStateChange?: (state: string) => void;
  private signalPollingCleanup?: () => void;

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
    this.localStream = localStream || null;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
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
        console.log('✅ Received remote stream');
        if (this.onRemoteStream) {
          this.onRemoteStream(event.streams[0]);
        }
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('📤 Sending ICE candidate');
        try {
          await hpCamSessionService.sendSignal(
            this.sessionId,
            'ice-candidate',
            this.isMobile ? 'mobile' : 'viewer',
            { candidate: event.candidate.toJSON() }
          );
        } catch (error) {
          console.error('Failed to send ICE candidate:', error);
        }
      }
    };

    // Handle connection state
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState || 'unknown';
      console.log('🔗 Connection state:', state);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
    };

    // Start polling for signals from backend
    this.startSignalPolling();
  }

  private startSignalPolling() {
    const forDevice = this.isMobile ? 'mobile' : 'viewer';
    
    this.signalPollingCleanup = hpCamSessionService.startSignalPolling(
      this.sessionId,
      forDevice,
      (signal: WebRTCSignal) => this.handleSignal(signal),
      (error: Error) => {
        console.error('Signal polling error:', error);
      },
      1000 // Poll every 1 second
    );
  }

  private async handleSignal(signal: WebRTCSignal) {
    if (!this.peerConnection) return;

    try {
      switch (signal.type) {
        case 'offer':
          // PC receives offer from mobile
          if (!this.isMobile) {
            console.log('📥 Received offer from mobile');
            await this.peerConnection.setRemoteDescription(
              new RTCSessionDescription(signal.data.offer)
            );
            
            // Create and send answer
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            console.log('📤 Sending answer to mobile');
            await hpCamSessionService.sendSignal(
              this.sessionId,
              'answer',
              'viewer',
              { answer: answer }
            );
          }
          break;

        case 'answer':
          // Mobile receives answer from PC
          if (this.isMobile) {
            console.log('📥 Received answer from PC');
            await this.peerConnection.setRemoteDescription(
              new RTCSessionDescription(signal.data.answer)
            );
          }
          break;

        case 'ice-candidate':
          // Both sides receive ICE candidates
          if (signal.data.candidate) {
            console.log('📥 Received ICE candidate');
            await this.peerConnection.addIceCandidate(
              new RTCIceCandidate(signal.data.candidate)
            );
          }
          break;
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }

  async createOffer() {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    console.log('📤 Creating and sending offer');
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    await hpCamSessionService.sendSignal(
      this.sessionId,
      'offer',
      'mobile',
      { offer: offer }
    );
  }

  cleanup() {
    console.log('🧹 Cleaning up WebRTC peer');
    
    // Stop signal polling
    if (this.signalPollingCleanup) {
      this.signalPollingCleanup();
      this.signalPollingCleanup = undefined;
    }
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
