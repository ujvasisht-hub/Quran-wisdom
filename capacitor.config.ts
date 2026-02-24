import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evrydaysolutions.wisdom',
  appName: 'Quran Wisdom',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      '*.razorpay.com',
      'razorpay.com',
      '*.razorpay.in',
      'api.razorpay.com'
    ],
  },
};

export default config;