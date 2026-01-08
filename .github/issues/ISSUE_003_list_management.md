# Issue #3: List Management (CRUD)

## Priority: 🟡 High

## Dependencies
- Issue #1 (Project Setup)
- Issue #2 (Phone Authentication)

## Description
Implement list creation, reading, updating, and deletion with real-time synchronization using Firebase Realtime Database.

## Reference Implementation
See `web/app.js` for the original web implementation:
- `createNewList()` - Creates a new list with name
- `renderLists()` - Displays all lists in grid
- `deleteList()` - Removes a list
- `saveEditedList()` - Updates list name

## Acceptance Criteria
- [ ] User can create a new list with custom name
- [ ] Lists appear in real-time (no refresh needed)
- [ ] User sees own lists on "My Lists" screen
- [ ] User sees shared lists on "Shared Lists" tab
- [ ] User can rename a list they own
- [ ] User can delete a list they own
- [ ] List shows item count and completion progress
- [ ] Lists display in 2-column grid layout

## Implementation Steps

### 1. Complete listService.ts
Implement all functions in `mobile/src/services/listService.ts`:

```typescript
export const createList = async (input: CreateListInput): Promise<List> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const listRef = database().ref('lists').push();
  const listId = listRef.key!;
  
  const newList: List = {
    id: listId,
    name: input.name,
    ownerId: userId,
    members: {},
    itemCount: 0,
    completedCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await listRef.set(newList);
  
  // Add to user's ownedLists
  await database().ref(`users/${userId}/ownedLists/${listId}`).set(true);
  
  return newList;
};

export const subscribeToMyLists = (callback: (lists: List[]) => void): Unsubscribe => {
  const userId = auth().currentUser?.uid;
  if (!userId) return () => {};

  // First get user's owned list IDs
  const userListsRef = database().ref(`users/${userId}/ownedLists`);
  
  // Then subscribe to each list
  // ... implementation
};
```

### 2. Create useLists Hook
```typescript
// mobile/src/hooks/useLists.ts
export const useLists = () => {
  const [myLists, setMyLists] = useState<List[]>([]);
  const [sharedLists, setSharedLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeMy = listService.subscribeToMyLists(setMyLists);
    const unsubscribeShared = listService.subscribeToSharedLists(setSharedLists);
    setLoading(false);
    
    return () => {
      unsubscribeMy();
      unsubscribeShared();
    };
  }, []);

  return { myLists, sharedLists, loading };
};
```

### 3. Update Screen Components
Complete the TODO items in:
- `mobile/src/screens/lists/MyListsScreen.tsx` - Use useLists hook
- `mobile/src/screens/lists/CreateListScreen.tsx` - Call createList
- `mobile/src/screens/lists/ListDetailScreen.tsx` - Subscribe to single list

## Database Structure
```
lists/
  {listId}/
    id: "listId"
    name: "Groceries"
    ownerId: "userId"
    members:
      {memberId}: { joinedAt: timestamp, canEdit: true }
    items:
      {itemId}: { text: "Milk", completed: false, ... }
    itemCount: 5
    completedCount: 2
    createdAt: timestamp
    updatedAt: timestamp
```

## Files to Modify
- `mobile/src/services/listService.ts` - Complete all functions
- `mobile/src/hooks/useLists.ts` - Create new file
- `mobile/src/screens/lists/MyListsScreen.tsx` - Integrate service
- `mobile/src/screens/lists/CreateListScreen.tsx` - Integrate service
- `mobile/src/screens/lists/ListDetailScreen.tsx` - Integrate service

## Testing
- [ ] Create list appears immediately in UI
- [ ] List persists after app restart
- [ ] Multiple users see same list data
- [ ] Delete removes list from all views
- [ ] Rename updates everywhere
- [ ] Item counts are accurate

## References
- `web/app.js` - Original implementation
- `docs/MOBILE_APP_SPECIFICATION.md` - Full specification
- [Firebase Realtime Database](https://rnfirebase.io/database/usage)
