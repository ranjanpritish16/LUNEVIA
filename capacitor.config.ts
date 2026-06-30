import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunevia.app',
  appName: 'LUNEVIA',
  webDir: 'public',
  server: {
    url: 'https://luneviaa.vercel.app',
    cleartext: true
  },
  android: {
    zoomEnabled: false
  }
};

export default config;