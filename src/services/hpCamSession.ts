import { apiClient } from '@/config/api';

export interface HpCamSession {
  sessionId: string;
  pairingCode: string;
  status: 'waiting' | 'paired' | 'ended';
  hasViewer: boolean;
  createdAt: string;
  expiresAt: string;
  pairedAt?: string;
  deviceId: string;
  viewerDeviceId?: string;
  lastActivity: string;
}

export interface WebRTCSignal {
  id: string;
  sessionId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  from: 'mobile' | 'viewer';
  to: 'mobile' | 'viewer';
  data: any;
  timestamp: string;
  delivered: boolean;
}

export interface CreateSessionResponse {
  sessionId: string;
  pairingCode: string;
  expiresAt: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  status: string;
  pairedAt: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  status: 'waiting' | 'paired' | 'ended';
  hasViewer: boolean;
  createdAt: string;
  pairedAt?: string;
}

export interface SignalsResponse {
  signals: WebRTCSignal[];
}

class HpCamSessionService {
  private baseUrl = '/api/v1/hp-cam-session';

  /**
   * Create new session (mobile device)
   */
  async createSession(deviceId: string): Promise<CreateSessionResponse> {
    const response = await apiClient.post<CreateSessionResponse>(`${this.baseUrl}/create`, {
      deviceId,
    });
    return response;
  }

  /**
   * Join session with pairing code (viewer)
   */
  async joinSession(pairingCode: string, deviceId: string): Promise<JoinSessionResponse> {
    const response = await apiClient.post<JoinSessionResponse>(`${this.baseUrl}/join`, {
      pairingCode,
      deviceId,
    });
    return response;
  }

  /**
   * Get session status
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const response = await apiClient.get<SessionStatusResponse>(`${this.baseUrl}/${sessionId}/status`);
    return response;
  }

  /**
   * Send WebRTC signal
   */
  async sendSignal(
    sessionId: string,
    type: 'offer' | 'answer' | 'ice-candidate',
    from: 'mobile' | 'viewer',
    data: any
  ): Promise<void> {
    await apiClient.post<{ message: string }>(`${this.baseUrl}/signal`, {
      sessionId,
      type,
      from,
      data,
    });
  }

  /**
   * Get pending signals
   */
  async getSignals(
    sessionId: string,
    forDevice: 'mobile' | 'viewer',
    since?: Date
  ): Promise<WebRTCSignal[]> {
    let url = `${this.baseUrl}/signal/${sessionId}?forDevice=${forDevice}`;
    if (since) {
      url += `&since=${since.toISOString()}`;
    }

    const response = await apiClient.get<SignalsResponse>(url);
    return response.signals;
  }

  /**
   * End session
   */
  async endSession(sessionId: string): Promise<void> {
    await apiClient.post<{ message: string }>(`${this.baseUrl}/end`, {
      sessionId,
    });
  }

  /**
   * Poll for signals (helper method)
   * Returns cleanup function to stop polling
   */
  startSignalPolling(
    sessionId: string,
    forDevice: 'mobile' | 'viewer',
    onSignal: (signal: WebRTCSignal) => void,
    onError?: (error: Error) => void,
    intervalMs: number = 1000
  ): () => void {
    let lastCheck = new Date();
    let isActive = true;
    
    const poll = async () => {
      if (!isActive) return;

      try {
        const signals = await this.getSignals(sessionId, forDevice, lastCheck);
        signals.forEach(onSignal);
        lastCheck = new Date();
      } catch (error) {
        console.error('Failed to poll signals:', error);
        if (onError) {
          onError(error as Error);
        }
      }

      if (isActive) {
        setTimeout(poll, intervalMs);
      }
    };

    // Start polling
    poll();

    // Return cleanup function
    return () => {
      isActive = false;
    };
  }

  /**
   * Get storage stats (for monitoring)
   */
  async getStats(): Promise<any> {
    const response = await apiClient.get<any>(`${this.baseUrl}/stats`);
    return response;
  }
}

export const hpCamSessionService = new HpCamSessionService();
