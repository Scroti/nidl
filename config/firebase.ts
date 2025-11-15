import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Note: Analytics requires additional setup and may not work in Expo Go
// import { getAnalytics, Analytics } from 'firebase/analytics';

// Your Firebase configuration
// Using environment variables for security (recommended)
// Fallback to direct values for quick testing in Expo Go
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBle_Z7_gCFct9pJhwcerBCWZMmAqixKnM',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'sunlit-apricot-321318.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'sunlit-apricot-321318',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sunlit-apricot-321318.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '791374053737',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:791374053737:web:597658bb50e2063b6a3df8',
  // measurementId is optional and only needed for Analytics
  // measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-10956MJ2VR',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with AsyncStorage persistence for React Native
// This ensures auth state persists between app sessions
let authInstance: Auth;
try {
  // Try to initialize auth with persistence
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    authInstance = getAuth(app);
  } else {
    throw error;
  }
}

export const auth: Auth = authInstance;
export const db: Firestore = getFirestore(app);
export default app;

