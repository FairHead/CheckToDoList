/**
 * Contacts Service
 * 
 * Handles phone contacts integration:
 * - Request contacts permission
 * - Fetch contacts from device
 * - Filter contacts that are already app users
 * 
 * Uses react-native-contacts library
 * @see docs/MOBILE_APP_SPECIFICATION.md
 */

import { PermissionsAndroid, Platform } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import database from '@react-native-firebase/database';

export interface AppContact {
  id: string;
  name: string;
  phoneNumber: string;
  isAppUser: boolean;
  userId?: string; // Firebase user ID if they're an app user
  thumbnailPath?: string;
}

/**
 * Request permission to access contacts
 * 
 * @returns Promise<boolean> - Whether permission was granted
 */
export const requestContactsPermission = async (): Promise<boolean> => {
  // TODO: Implement - Issue #6
  // Android: Use PermissionsAndroid.request(READ_CONTACTS)
  // iOS: Contacts.requestPermission()
  throw new Error('Not implemented - Issue #6');
};

/**
 * Check if contacts permission is granted
 */
export const checkContactsPermission = async (): Promise<boolean> => {
  // TODO: Implement - Issue #6
  throw new Error('Not implemented - Issue #6');
};

/**
 * Get all contacts from device
 * 
 * @returns Promise<AppContact[]> - Formatted contacts
 */
export const getAllContacts = async (): Promise<AppContact[]> => {
  // TODO: Implement - Issue #6
  // 1. Request permission if needed
  // 2. Fetch contacts using Contacts.getAll()
  // 3. Normalize phone numbers
  // 4. Format to AppContact structure
  throw new Error('Not implemented - Issue #6');
};

/**
 * Get contacts that are app users
 * 
 * Checks which contacts have registered accounts
 * 
 * @returns Promise<AppContact[]> - Contacts who are app users
 */
export const getAppUserContacts = async (): Promise<AppContact[]> => {
  // TODO: Implement - Issue #6
  // 1. Get all contacts
  // 2. Query /users by phoneNumber
  // 3. Match and return with userId
  throw new Error('Not implemented - Issue #6');
};

/**
 * Search contacts by name or phone number
 * 
 * @param query - Search string
 * @returns Promise<AppContact[]> - Matching contacts
 */
export const searchContacts = async (
  query: string
): Promise<AppContact[]> => {
  // TODO: Implement - Issue #6
  throw new Error('Not implemented - Issue #6');
};

/**
 * Normalize phone number to E.164 format
 * 
 * @param phoneNumber - Raw phone number
 * @param countryCode - Default country code (e.g., 'DE')
 * @returns string - Normalized phone number
 */
export const normalizePhoneNumber = (
  phoneNumber: string,
  countryCode: string = 'DE'
): string => {
  // TODO: Implement - Issue #6
  // Use libphonenumber-js or similar
  // Remove spaces, dashes, parentheses
  // Add country code if missing
  return phoneNumber.replace(/\D/g, '');
};

export default {
  requestContactsPermission,
  checkContactsPermission,
  getAllContacts,
  getAppUserContacts,
  searchContacts,
  normalizePhoneNumber,
};
