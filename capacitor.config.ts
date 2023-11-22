import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.antPinot.sumit',
  appName: 'sum-it',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    SplashScreen:{
      launchShowDuration:2000,
      launchAutoHide:true,
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999"
    }
  }
};

export default config;
