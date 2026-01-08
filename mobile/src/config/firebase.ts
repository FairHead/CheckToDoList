/**
 * Firebase Configuration
 *
 * Firebase Project: CheckToDoList
 * Project ID: checktodolist-dbfed
 *
 * Native config files are located at:
 * - Android: android/app/google-services.json
 * - iOS: ios/GoogleService-Info.plist
 */

import { Platform } from "react-native";

// Firebase Config (für Referenz und eventuelle Web-Nutzung)
export const firebaseConfig = {
  apiKey: Platform.select({
    ios: "AIzaSyAOOuWddSTg6KX6eR26uY2-5vioqK4SZEs",
    android: "AIzaSyDK512mkCAWoZ_PxDVwZEHn93HhYVyXWLc",
  }),
  authDomain: "checktodolist-dbfed.firebaseapp.com",
  databaseURL:
    "https://checktodolist-dbfed-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "checktodolist-dbfed",
  storageBucket: "checktodolist-dbfed.firebasestorage.app",
  messagingSenderId: "583061680780",
  appId: Platform.select({
    ios: "1:583061680780:ios:60cc585f35ce7105e701a9",
    android: "1:583061680780:android:c8b69d60b11c315ee701a9",
  }),
};

/**
 * React Native Firebase nutzt die nativen Config-Dateien automatisch:
 * - google-services.json für Android
 * - GoogleService-Info.plist für iOS
 *
 * Die obige firebaseConfig ist nur für Referenz/Debugging.
 */

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

// Firebase Project IDs für einfachen Zugriff
export const FIREBASE_PROJECT_ID = "checktodolist-dbfed";
export const FIREBASE_MESSAGING_SENDER_ID = "583061680780";
