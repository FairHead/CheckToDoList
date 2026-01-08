/**
 * List Service
 * 
 * Handles all list operations with Firebase Realtime Database:
 * - CRUD operations for lists
 * - Real-time subscriptions
 * - Member management
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md for full API specification
 * @see web/app.js for reference implementation (localStorage based)
 */

import database from '@react-native-firebase/database';
import { List, CreateListInput, UpdateListInput, UserList } from '../types';

export type Unsubscribe = () => void;

/**
 * Create a new list
 * 
 * Reference: web/app.js - createNewList()
 */
export const createList = async (input: CreateListInput): Promise<List> => {
  // TODO: Implement
  // 1. Generate new list ID
  // 2. Create list in /lists/{listId}
  // 3. Add to /userLists/{userId}/{listId}
  // 4. Set current user as owner in members
  throw new Error('Not implemented - Issue #3');
};

/**
 * Update an existing list
 * 
 * Reference: web/app.js - renameList()
 */
export const updateList = async (
  listId: string,
  updates: UpdateListInput
): Promise<void> => {
  // TODO: Implement
  throw new Error('Not implemented - Issue #3');
};

/**
 * Delete a list
 * 
 * Reference: web/app.js - confirmDelete() with deleteType === 'list'
 */
export const deleteList = async (listId: string): Promise<void> => {
  // TODO: Implement
  // 1. Remove from /lists/{listId}
  // 2. Remove from /userLists for all members
  // 3. Remove related invitations
  throw new Error('Not implemented - Issue #3');
};

/**
 * Get a single list by ID
 */
export const getListById = async (listId: string): Promise<List | null> => {
  // TODO: Implement
  throw new Error('Not implemented - Issue #3');
};

/**
 * Subscribe to user's own lists (real-time)
 * 
 * Reference: web/app.js - renderLists() but with Firebase instead of localStorage
 */
export const subscribeToMyLists = (
  userId: string,
  callback: (lists: List[]) => void
): Unsubscribe => {
  // TODO: Implement
  // Listen to /userLists/{userId} where role === 'owner'
  // Then fetch full list data from /lists/{listId}
  console.warn('Not implemented - Issue #3');
  return () => {};
};

/**
 * Subscribe to lists shared with user (real-time)
 */
export const subscribeToSharedLists = (
  userId: string,
  callback: (lists: List[]) => void
): Unsubscribe => {
  // TODO: Implement
  // Listen to /userLists/{userId} where role === 'editor'
  console.warn('Not implemented - Issue #3');
  return () => {};
};

/**
 * Subscribe to a single list (real-time)
 */
export const subscribeToList = (
  listId: string,
  callback: (list: List | null) => void
): Unsubscribe => {
  // TODO: Implement
  console.warn('Not implemented - Issue #3');
  return () => {};
};

/**
 * Leave a shared list (for non-owners)
 */
export const leaveList = async (
  listId: string,
  userId: string
): Promise<void> => {
  // TODO: Implement
  throw new Error('Not implemented - Issue #7');
};

/**
 * Remove a member from list (owner only)
 */
export const removeMember = async (
  listId: string,
  memberId: string
): Promise<void> => {
  // TODO: Implement
  throw new Error('Not implemented - Issue #7');
};

export default {
  createList,
  updateList,
  deleteList,
  getListById,
  subscribeToMyLists,
  subscribeToSharedLists,
  subscribeToList,
  leaveList,
  removeMember,
};
