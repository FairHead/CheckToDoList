/**
 * Authentication Service
 * 
 * Handles all Firebase Authentication operations:
 * - Email/Password registration and login
 * - Phone number verification
 * - Password reset
 * - Session management
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md for full API specification
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { User } from '../types';

export type Unsubscribe = () => void;

/**
 * Register a new user with email and password
 */
export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseAuthTypes.User> => {
  try {
    // Erstelle User mit Email/Password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update Profil mit displayName
    await user.updateProfile({ displayName });

    // Erstelle User-Dokument in der Database
    await createUserProfile(user, displayName);

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Login with email and password
 */
export const login = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Send phone verification SMS
 */
export const sendPhoneVerification = async (
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Confirm phone verification code
 */
export const confirmPhoneCode = async (
  confirmationResult: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Create or update user profile in database
 */
export const createUserProfile = async (
  user: FirebaseAuthTypes.User,
  displayName?: string
): Promise<void> => {
  try {
    const userRef = database().ref(`users/${user.uid}`);
    const snapshot = await userRef.once('value');
    
    // Prüfe ob User bereits existiert
    if (!snapshot.exists()) {
      // Neuer User - erstelle vollständiges Profil
      await userRef.set({
        displayName: displayName || user.displayName || 'Unbekannt',
        phoneNumber: user.phoneNumber || null,
        createdAt: database.ServerValue.TIMESTAMP,
        ownedLists: {},
        sharedLists: {},
        pendingInvitations: {},
      });
    } else {
      // Existierender User - aktualisiere nur falls nötig
      const updates: { [key: string]: any } = {};
      
      if (displayName && displayName !== snapshot.val().displayName) {
        updates.displayName = displayName;
      }
      
      if (Object.keys(updates).length > 0) {
        await userRef.update(updates);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Kein User eingeloggt');
    }

    // Update Firebase Auth Profil
    await user.updateProfile(updates);

    // Update Database
    if (updates.displayName) {
      await database().ref(`users/${user.uid}`).update({
        displayName: updates.displayName,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw error;
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
): Unsubscribe => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Convert Firebase error codes to German error messages
 */
const getFirebaseErrorMessage = (error: Error): string => {
  // Type guard für Firebase-Fehler mit Code
  const errorCode = (error as { code?: string }).code;
  
  switch (errorCode) {
    case 'auth/invalid-phone-number':
      return 'Ungültige Telefonnummer. Bitte im Format +49... eingeben.';
    case 'auth/missing-phone-number':
      return 'Bitte geben Sie eine Telefonnummer ein.';
    case 'auth/quota-exceeded':
      return 'SMS-Limit überschritten. Bitte später erneut versuchen.';
    case 'auth/invalid-verification-code':
      return 'Ungültiger Verifizierungscode. Bitte erneut versuchen.';
    case 'auth/code-expired':
      return 'Verifizierungscode abgelaufen. Bitte neuen Code anfordern.';
    case 'auth/email-already-in-use':
      return 'Diese E-Mail-Adresse wird bereits verwendet.';
    case 'auth/invalid-email':
      return 'Ungültige E-Mail-Adresse.';
    case 'auth/weak-password':
      return 'Passwort zu schwach. Mindestens 6 Zeichen erforderlich.';
    case 'auth/user-not-found':
      return 'Kein Benutzer mit dieser E-Mail-Adresse gefunden.';
    case 'auth/wrong-password':
      return 'Falsches Passwort.';
    case 'auth/too-many-requests':
      return 'Zu viele Anfragen. Bitte später erneut versuchen.';
    case 'auth/network-request-failed':
      return 'Netzwerkfehler. Bitte Internetverbindung prüfen.';
    default:
      return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
  }
};

export default {
  register,
  login,
  logout,
  resetPassword,
  sendPhoneVerification,
  confirmPhoneCode,
  createUserProfile,
  updateUserProfile,
  onAuthStateChanged,
  getCurrentUser,
};
