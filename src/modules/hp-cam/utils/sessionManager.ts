// Session Manager for HP Camera Pairing
export interface CameraSession {
  sessionId: string;
  createdAt: number;
  approved: boolean;
  deviceInfo?: string;
}

const STORAGE_KEY = 'hp_cam_sessions';

export const sessionManager = {
  // Generate unique session ID
  generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Save session to localStorage
  saveSession(session: CameraSession): void {
    const sessions = this.getAllSessions();
    sessions[session.sessionId] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  // Get session by ID
  getSession(sessionId: string): CameraSession | null {
    const sessions = this.getAllSessions();
    return sessions[sessionId] || null;
  },

  // Get all sessions
  getAllSessions(): Record<string, CameraSession> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Check if session is approved
  isSessionApproved(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    return session?.approved || false;
  },

  // Mark session as approved
  approveSession(sessionId: string, deviceInfo?: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.approved = true;
      session.deviceInfo = deviceInfo;
      this.saveSession(session);
      
      // Set approval signal for PC to detect
      localStorage.setItem(`hp_cam_approval_${sessionId}`, Date.now().toString());
    }
  },

  // Check approval signal (for cross-device detection)
  checkApprovalSignal(sessionId: string): boolean {
    const signal = localStorage.getItem(`hp_cam_approval_${sessionId}`);
    return signal !== null;
  },

  // Clear approval signal
  clearApprovalSignal(sessionId: string): void {
    localStorage.removeItem(`hp_cam_approval_${sessionId}`);
  },

  // Delete session
  deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions();
    delete sessions[sessionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
};
