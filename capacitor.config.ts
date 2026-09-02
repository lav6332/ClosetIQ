import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.closetiq.app',
  appName: 'ClosetIQ',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
