/**
 * Firebase Configuration
 * 
 * TODO: Replace with your Firebase project config from:
 * Firebase Console → Project Settings → Your apps → Config
 */

import { Platform } from 'react-native';

// Firebase Web Config (for reference)
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

/**
 * Note: For React Native Firebase, configuration is done via:
 * - Android: google-services.json in android/app/
 * - iOS: GoogleService-Info.plist in ios/
 * 
 * Download these files from Firebase Console.
 */

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
