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
  // TODO: Implement registration
  // 1. Create user with email/password
  // 2. Update profile with displayName
  // 3. Create user document in database
  throw new Error('Not implemented - Issue #2');
};

/**
 * Login with email and password
 */
export const login = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> => {
  // TODO: Implement login
  throw new Error('Not implemented - Issue #2');
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  // TODO: Implement logout
  throw new Error('Not implemented - Issue #2');
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  // TODO: Implement password reset
  throw new Error('Not implemented - Issue #2');
};

/**
 * Send phone verification SMS
 */
export const sendPhoneVerification = async (
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  // TODO: Implement phone verification
  throw new Error('Not implemented - Issue #2');
};

/**
 * Confirm phone verification code
 */
export const confirmPhoneCode = async (
  confirmationResult: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<void> => {
  // TODO: Implement code confirmation
  throw new Error('Not implemented - Issue #2');
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

export default {
  register,
  login,
  logout,
  resetPassword,
  sendPhoneVerification,
  confirmPhoneCode,
  onAuthStateChanged,
  getCurrentUser,
};
