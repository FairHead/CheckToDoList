/**
 * Item Service
 * 
 * Handles all item operations within lists:
 * - CRUD operations for items
 * - Toggle completion status
 * - Real-time subscriptions
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md for full API specification
 * @see web/app.js for reference implementation
 */

import database from '@react-native-firebase/database';
import { Item, CreateItemInput, UpdateItemInput } from '../types';

export type Unsubscribe = () => void;

/**
 * Add a new item to a list
 * 
 * Reference: web/app.js - addItemToList()
 */
export const addItem = async (
  listId: string,
  input: CreateItemInput
): Promise<Item> => {
  // TODO: Implement
  // 1. Generate item ID
  // 2. Create item in /lists/{listId}/items/{itemId}
  // 3. Increment itemCount
  // 4. Trigger push notification to other members (via Cloud Function)
  throw new Error('Not implemented - Issue #4');
};

/**
 * Update an existing item
 * 
 * Reference: web/app.js - saveEditedItem()
 */
export const updateItem = async (
  listId: string,
  itemId: string,
  updates: UpdateItemInput
): Promise<void> => {
  // TODO: Implement
  throw new Error('Not implemented - Issue #4');
};

/**
 * Delete an item from a list
 * 
 * Reference: web/app.js - confirmDelete() with deleteType === 'item'
 */
export const deleteItem = async (
  listId: string,
  itemId: string
): Promise<void> => {
  // TODO: Implement
  // 1. Remove from /lists/{listId}/items/{itemId}
  // 2. Decrement itemCount
  // 3. If was completed, decrement completedCount
  throw new Error('Not implemented - Issue #4');
};

/**
 * Toggle item completion status
 * 
 * Reference: web/app.js - toggleItem()
 */
export const toggleItemCompleted = async (
  listId: string,
  itemId: string
): Promise<void> => {
  // TODO: Implement
  // 1. Get current completed status
  // 2. Update completed, completedAt, completedBy
  // 3. Update completedCount on list
  // 4. Trigger push notification (via Cloud Function)
  throw new Error('Not implemented - Issue #4');
};

/**
 * Subscribe to items of a list (real-time)
 * 
 * Reference: web/app.js - renderLists() items section
 */
export const subscribeToItems = (
  listId: string,
  callback: (items: Item[]) => void
): Unsubscribe => {
  // TODO: Implement
  // Listen to /lists/{listId}/items
  // Convert object to array and sort by createdAt
  console.warn('Not implemented - Issue #4');
  return () => {};
};

export default {
  addItem,
  updateItem,
  deleteItem,
  toggleItemCompleted,
  subscribeToItems,
};
