import { useState, useEffect, useCallback } from 'react';
import { 
  hpCamSessionService, 
  CreateSessionResponse, 
  JoinSessionResponse,
  SessionStatusResponse,
  WebRTCSignal 
} from '@/services/hpCamSession';

export interface UseHpCamSessionOptions {
  deviceType: 'mobile' | 'viewer';
  deviceId: string;
  onSignal?: (signal: WebRTCSignal) => void;
  onError?: (error: Error) => void;
  pollingInterval?: number;
}

export function useHpCamSession(options: UseHpCamSessionOptions) {
  const { deviceType, deviceId, onSignal, onError, pollingInterval = 1000 } = options;

  const [session, setSession] = useState<CreateSessionResponse | JoinSessionResponse | null>(null);
  const [status, setStatus] = useState<SessionStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Create session (mobile)
  const createSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await hpCamSessionService.createSession(deviceId);
      setSession(newSession);
      return newSession;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create session';
      setError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deviceId, onError]);

  // Join session (viewer)
  const joinSession = useCallback(async (pairingCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const joinedSession = await hpCamSessionService.joinSession(pairingCode, deviceId);
      setSession(joinedSession);
      return joinedSession;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to join session';
      setError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deviceId, onError]);

  // Get session status
  const refreshStatus = useCallback(async () => {
    if (!session) return;
    
    try {
      const sessionStatus = await hpCamSessionService.getSessionStatus(session.sessionId);
      setStatus(sessionStatus);
      return sessionStatus;
    } catch (err: any) {
      console.error('Failed to refresh status:', err);
      if (onError) onError(err);
    }
  }, [session, onError]);

  // Send signal
  const sendSignal = useCallback(async (
    type: 'offer' | 'answer' | 'ice-candidate',
    data: any
  ) => {
    if (!session) {
      throw new Error('No active session');
    }

    try {
      await hpCamSessionService.sendSignal(
        session.sessionId,
        type,
        deviceType,
        data
      );
    } catch (err: any) {
      console.error('Failed to send signal:', err);
      if (onError) onError(err);
      throw err;
    }
  }, [session, deviceType, onError]);

  // End session
  const endSession = useCallback(async () => {
    if (!session) return;
    
    try {
      await hpCamSessionService.endSession(session.sessionId);
      setSession(null);
      setStatus(null);
      setIsPolling(false);
    } catch (err: any) {
      console.error('Failed to end session:', err);
      if (onError) onError(err);
    }
  }, [session, onError]);

  // Start polling for signals
  const startPolling = useCallback(() => {
    if (!session || isPolling) return;

    setIsPolling(true);
    
    const stopPolling = hpCamSessionService.startSignalPolling(
      session.sessionId,
      deviceType,
      (signal) => {
        if (onSignal) onSignal(signal);
      },
      (err) => {
        console.error('Polling error:', err);
        if (onError) onError(err);
      },
      pollingInterval
    );

    return stopPolling;
  }, [session, deviceType, isPolling, onSignal, onError, pollingInterval]);

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      if (session) {
        hpCamSessionService.endSession(session.sessionId).catch(console.error);
      }
    };
  }, [session]);

  return {
    session,
    status,
    loading,
    error,
    isPolling,
    createSession,
    joinSession,
    refreshStatus,
    sendSignal,
    endSession,
    startPolling,
  };
}
