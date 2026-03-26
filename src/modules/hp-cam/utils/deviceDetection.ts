// Device Detection Utility

export const deviceDetection = {
  // Check if device is mobile
  isMobile(): boolean {
    // Check user agent
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    // Check screen size
    const isMobileScreen = window.innerWidth < 768;
    
    // Check touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mobile if any condition is true
    return isMobileUA || (isMobileScreen && hasTouch);
  },

  // Check if device is tablet
  isTablet(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTabletUA = userAgent.includes('ipad') || 
                       (userAgent.includes('android') && !userAgent.includes('mobile'));
    const isTabletScreen = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    return isTabletUA || isTabletScreen;
  },

  // Check if device is desktop
  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  },

  // Get device type
  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  },

  // Get screen size category
  getScreenSize(): 'small' | 'medium' | 'large' {
    const width = window.innerWidth;
    if (width < 768) return 'small';
    if (width < 1024) return 'medium';
    return 'large';
  },

  // Check if device has camera
  async hasCamera(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  },

  // Get device info
  getDeviceInfo(): {
    type: 'mobile' | 'tablet' | 'desktop';
    screenSize: 'small' | 'medium' | 'large';
    userAgent: string;
    platform: string;
    width: number;
    height: number;
  } {
    return {
      type: this.getDeviceType(),
      screenSize: this.getScreenSize(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
};
