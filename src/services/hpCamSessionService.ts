import { apiClient, API_ENDPOINTS } from '@/config/api';

// Types
export interface CreateSessionResponse {
  sessionId: string;
  pairingCode: string;
  expiresAt: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  status: string;
  pairedAt?: string;
}

export interface SessionStatus {
  sessionId: string;
  status: string;
  hasViewer: boolean;
  createdAt: string;
  pairedAt?: string;
}

export interface WebRTCSignal {
  type: string;
  from: string;
  data: any;
  timestamp: string;
}

export interface SignalsResponse {
  signals: WebRTCSignal[];
}

// HP Camera Session Service
export class HpCamSessionService {
  async createSession(deviceId: string): Promise<CreateSessionResponse> {
    return apiClient.post<CreateSessionResponse>(
      API_ENDPOINTS.hpCamCreateSession,
      { deviceId }
    );
  }

  async joinSession(pairingCode: string, deviceId: string): Promise<JoinSessionResponse> {
    return apiClient.post<JoinSessionResponse>(
      API_ENDPOINTS.hpCamJoinSession,
      { pairingCode, deviceId }
    );
  }

  async getSessionStatus(sessionId: string): Promise<SessionStatus> {
    return apiClient.get<SessionStatus>(
      API_ENDPOINTS.hpCamSessionStatus(sessionId)
    );
  }

  async sendSignal(
    sessionId: string,
    type: string,
    from: string,
    data: any
  ): Promise<void> {
    await apiClient.post(API_ENDPOINTS.hpCamSendSignal, {
      sessionId,
      type,
      from,
      data,
    });
  }

  async getSignals(
    sessionId: string,
    forDevice: string,
    since?: Date
  ): Promise<SignalsResponse> {
    const params = new URLSearchParams({
      forDevice,
    });
    
    if (since) {
      params.append('since', since.toISOString());
    }

    const endpoint = `${API_ENDPOINTS.hpCamGetSignals(sessionId)}?${params.toString()}`;
    return apiClient.get<SignalsResponse>(endpoint);
  }

  async endSession(sessionId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.hpCamEndSession, { sessionId });
  }

  // Helper: Poll for signals
  startSignalPolling(
    sessionId: string,
    forDevice: string,
    onSignal: (signal: WebRTCSignal) => void,
    intervalMs: number = 1000
  ): () => void {
    let lastCheck = new Date();
    let isRunning = true;

    const poll = async () => {
      if (!isRunning) return;

      try {
        const response = await this.getSignals(sessionId, forDevice, lastCheck);
        
        response.signals.forEach(signal => {
          onSignal(signal);
        });

        lastCheck = new Date();
      } catch (error) {
        console.error('Signal polling error:', error);
      }

      if (isRunning) {
        setTimeout(poll, intervalMs);
      }
    };

    poll();

    // Return stop function
    return () => {
      isRunning = false;
    };
  }
}

export const hpCamSessionService = new HpCamSessionService();
