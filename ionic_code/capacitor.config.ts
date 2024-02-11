import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.technyks.razorpayTestApp',
  appName: 'razorpay-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
