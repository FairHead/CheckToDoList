export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneVerified: boolean;
  profile: UserProfileData;
  settings: UserSettings;
  fcmTokens: Record<string, FCMToken>;
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number;
}

export interface UserProfileData {
  firstName: string;
  lastName: string;
  displayName: string;
  username?: string;
  photoURL: string | null;
  birthDate: string; // ISO date format: YYYY-MM-DD
  bio?: string;
}

export interface FCMToken {
  token: string;
  device: string;
  updatedAt: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  language: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string | null;
}

// Registration data structure
export interface RegistrationData {
  // Step 1
  photoURL?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Step 2
  birthDate: string;
  phoneNumber: string;
  username?: string;
  bio?: string;
  acceptedTerms: boolean;
}
