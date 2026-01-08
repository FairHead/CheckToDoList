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
import storage from '@react-native-firebase/storage';
import { User, RegistrationData } from '../types';

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
    // 1. Create user with email/password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2. Update profile with displayName
    await user.updateProfile({ displayName });

    // 3. Create user document in database
    await createUserDocument(user, { displayName });

    return user;
  } catch (error: any) {
    console.error('Error registering user:', error);
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
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
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
    // Validation: E.164 Format (must start with +)
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must be in E.164 format (e.g., +491234567890)');
    }
    
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error: any) {
    console.error('Error sending phone verification:', error);
    throw error;
  }
};

/**
 * Confirm phone verification code
 * 
 * @returns UserCredential containing the authenticated user
 */
export const confirmPhoneCode = async (
  confirmationResult: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    return userCredential;
  } catch (error: any) {
    console.error('Error confirming phone code:', error);
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
 * Create user document in Firebase Realtime Database
 */
export const createUserDocument = async (
  user: FirebaseAuthTypes.User,
  additionalData?: { displayName?: string }
): Promise<void> => {
  try {
    const userRef = database().ref(`users/${user.uid}`);
    
    const userData: Partial<User> = {
      id: user.uid,
      email: user.email || '',
      displayName: additionalData?.displayName || user.displayName || '',
      phoneNumber: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      fcmTokens: {},
      settings: {
        notificationsEnabled: true,
        soundEnabled: true,
      },
      createdAt: database.ServerValue.TIMESTAMP as unknown as number,
      updatedAt: database.ServerValue.TIMESTAMP as unknown as number,
    };

    await userRef.set(userData);
  } catch (error: any) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Update user profile in Firebase Realtime Database
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    const userRef = database().ref(`users/${userId}`);
    
    await userRef.update({
      ...data,
      updatedAt: database.ServerValue.TIMESTAMP,
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firebase Realtime Database
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = database().ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    
    if (snapshot.exists()) {
      return snapshot.val() as User;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Link phone number to existing account
 */
export const linkPhoneNumber = async (
  confirmationResult: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<void> => {
  try {
    const credential = auth.PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code
    );
    
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    await currentUser.linkWithCredential(credential);
  } catch (error: any) {
    console.error('Error linking phone number:', error);
    throw error;
  }
};

/**
 * Register a new user with email and password (comprehensive registration)
 * 
 * @param data - Complete registration data
 * @returns Firebase auth user
 */
export const registerWithEmail = async (
  data: RegistrationData
): Promise<FirebaseAuthTypes.User> => {
  try {
    // 1. Create user with email/password
    const userCredential = await auth().createUserWithEmailAndPassword(
      data.email,
      data.password
    );
    const user = userCredential.user;

    // 2. Send email verification
    await user.sendEmailVerification();

    // 3. Update profile with display name
    const displayName = `${data.firstName} ${data.lastName}`;
    await user.updateProfile({ displayName });

    return user;
  } catch (error: any) {
    console.error('Error registering with email:', error);
    throw error;
  }
};

/**
 * Send email verification to current user
 * 
 * @returns Promise<void>
 */
export const sendEmailVerification = async (): Promise<void> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    await user.sendEmailVerification();
  } catch (error: any) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

/**
 * Check if current user's email is verified
 * 
 * @returns boolean
 */
export const isEmailVerified = async (): Promise<boolean> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return false;
    }

    // Reload user to get latest email verification status
    await user.reload();
    return user.emailVerified;
  } catch (error: any) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

/**
 * Upload profile picture to Firebase Storage
 * 
 * @param userId - User ID
 * @param imageUri - Local image URI
 * @returns Download URL of uploaded image
 */
export const uploadProfilePicture = async (
  userId: string,
  imageUri: string
): Promise<string> => {
  try {
    const filename = `${userId}_${Date.now()}.jpg`;
    const reference = storage().ref(`profile_pictures/${filename}`);

    await reference.putFile(imageUri);
    const downloadURL = await reference.getDownloadURL();

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Create complete user profile in database (comprehensive version)
 * 
 * @param user - Firebase auth user
 * @param data - Registration data
 * @param photoURL - Profile picture URL (optional)
 * @returns Promise<void>
 */
export const createCompleteUserProfile = async (
  user: FirebaseAuthTypes.User,
  data: RegistrationData,
  photoURL?: string
): Promise<void> => {
  try {
    const userRef = database().ref(`users/${user.uid}`);
    
    const userData: Partial<User> = {
      id: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      phoneNumber: data.phoneNumber || null,
      phoneVerified: false,
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
        username: data.username,
        photoURL: photoURL || null,
        birthDate: data.birthDate,
        bio: data.bio,
      },
      settings: {
        notificationsEnabled: true,
        soundEnabled: true,
        language: 'de',
      },
      fcmTokens: {},
      createdAt: database.ServerValue.TIMESTAMP as unknown as number,
      updatedAt: database.ServerValue.TIMESTAMP as unknown as number,
      lastLoginAt: database.ServerValue.TIMESTAMP as unknown as number,
    };

    await userRef.set(userData);
  } catch (error: any) {
    console.error('Error creating complete user profile:', error);
    throw error;
  }
};

/**
 * Update last login timestamp
 * 
 * @param userId - User ID
 * @returns Promise<void>
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    const userRef = database().ref(`users/${userId}`);
    await userRef.update({
      lastLoginAt: database.ServerValue.TIMESTAMP,
      updatedAt: database.ServerValue.TIMESTAMP,
    });
  } catch (error: any) {
    console.error('Error updating last login:', error);
    throw error;
  }
};

/**
 * Mark phone as verified
 * 
 * @param userId - User ID
 * @returns Promise<void>
 */
export const markPhoneAsVerified = async (userId: string): Promise<void> => {
  try {
    const userRef = database().ref(`users/${userId}`);
    await userRef.update({
      phoneVerified: true,
      updatedAt: database.ServerValue.TIMESTAMP,
    });
  } catch (error: any) {
    console.error('Error marking phone as verified:', error);
    throw error;
  }
};

/**
 * Check if username is available
 * 
 * @param username - Username to check
 * @returns boolean - true if available
 */
export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    if (!username) {
      return true; // Username is optional
    }

    const usersRef = database().ref('users');
    const snapshot = await usersRef
      .orderByChild('profile/username')
      .equalTo(username)
      .once('value');

    return !snapshot.exists();
  } catch (error: any) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  resetPassword,
  sendPhoneVerification,
  confirmPhoneCode,
  onAuthStateChanged,
  getCurrentUser,
  createUserDocument,
  updateUserProfile,
  getUserProfile,
  linkPhoneNumber,
  registerWithEmail,
  sendEmailVerification,
  isEmailVerified,
  uploadProfilePicture,
  createCompleteUserProfile,
  updateLastLogin,
  markPhoneAsVerified,
  checkUsernameAvailability,
};
