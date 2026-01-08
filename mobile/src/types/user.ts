export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string | null;
  photoURL: string | null;
  fcmTokens: Record<string, FCMToken>;
  settings: UserSettings;
  createdAt: number;
  updatedAt: number;
}

export interface FCMToken {
  token: string;
  device: string;
  updatedAt: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string | null;
}
