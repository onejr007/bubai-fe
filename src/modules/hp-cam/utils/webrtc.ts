// WebRTC Signaling using localStorage for simple peer connection
export type SignalType = 'offer' | 'answer' | 'ice-candidate' | 'heartbeat' | 'stop';

export interface Signal {
  type: SignalType;
  sessionId: string;
  data?: any;
  timestamp: number;
  from: 'mobile' | 'pc';
}

const SIGNAL_KEY_PREFIX = 'hp_cam_signal_';

export class SignalingChannel {
  private sessionId: string;
  private listeners: Map<SignalType, ((data: any) => void)[]> = new Map();
  private pollInterval?: number;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  // Send signal
  send(type: SignalType, data: any, from: 'mobile' | 'pc'): void {
    const signal: Signal = {
      type,
      sessionId: this.sessionId,
      data,
      timestamp: Date.now(),
      from
    };
    const key = `${SIGNAL_KEY_PREFIX}${this.sessionId}_${from}_${type}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(signal));
  }

  // Listen for signals
  on(type: SignalType, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  // Start polling for signals
  startPolling(from: 'mobile' | 'pc'): void {
    const targetFrom = from === 'mobile' ? 'pc' : 'mobile';
    
    this.pollInterval = window.setInterval(() => {
      const keys = Object.keys(localStorage);
      const signalKeys = keys.filter(k => 
        k.startsWith(`${SIGNAL_KEY_PREFIX}${this.sessionId}_${targetFrom}`)
      );

      signalKeys.forEach(key => {
        const signalData = localStorage.getItem(key);
        if (signalData) {
          const signal: Signal = JSON.parse(signalData);
          
          // Process signal if it's recent (within 30 seconds)
          if (Date.now() - signal.timestamp < 30000) {
            const callbacks = this.listeners.get(signal.type);
            if (callbacks) {
              callbacks.forEach(cb => cb(signal.data));
            }
          }
          
          // Clean up old signals
          localStorage.removeItem(key);
        }
      });
    }, 500);
  }

  // Stop polling
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  // Clean up all signals for this session
  cleanup(): void {
    this.stopPolling();
    const keys = Object.keys(localStorage);
    keys.filter(k => k.startsWith(`${SIGNAL_KEY_PREFIX}${this.sessionId}`))
      .forEach(k => localStorage.removeItem(k));
  }
}
