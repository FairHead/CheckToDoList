# Issue #4: Item Management

## Priority: 🟡 High

## Dependencies
- Issue #3 (List Management)

## Description
Implement item CRUD operations within lists - add, edit, delete, and toggle completion status with real-time sync.

## Reference Implementation
See `web/app.js`:
- `addItemToList()` - Adds new item to list
- `toggleItem()` - Toggles completion checkbox
- `saveEditedItem()` - Updates item text
- `confirmDelete()` with `deleteType === 'item'` - Deletes item

## Acceptance Criteria
- [ ] User can add new item to a list
- [ ] Items appear in real-time for all list members
- [ ] User can toggle item completion with checkbox
- [ ] Completed items show strikethrough styling
- [ ] User can edit item text
- [ ] User can delete an item
- [ ] Item shows who completed it and when
- [ ] List's itemCount and completedCount update automatically

## Implementation Steps

### 1. Complete itemService.ts
Implement all functions in `mobile/src/services/itemService.ts`:

```typescript
export const addItem = async (listId: string, input: CreateItemInput): Promise<Item> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const itemRef = database().ref(`lists/${listId}/items`).push();
  const itemId = itemRef.key!;
  
  const newItem: Item = {
    id: itemId,
    text: input.text,
    completed: false,
    createdAt: Date.now(),
    createdBy: userId,
  };

  // Use transaction to update item count atomically
  await database().ref(`lists/${listId}`).transaction((list) => {
    if (list) {
      list.itemCount = (list.itemCount || 0) + 1;
      list.items = list.items || {};
      list.items[itemId] = newItem;
      list.updatedAt = Date.now();
    }
    return list;
  });
  
  return newItem;
};

export const toggleItemCompleted = async (listId: string, itemId: string): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  await database().ref(`lists/${listId}`).transaction((list) => {
    if (list && list.items && list.items[itemId]) {
      const item = list.items[itemId];
      const wasCompleted = item.completed;
      
      item.completed = !wasCompleted;
      item.completedAt = item.completed ? Date.now() : null;
      item.completedBy = item.completed ? userId : null;
      
      list.completedCount = (list.completedCount || 0) + (item.completed ? 1 : -1);
      list.updatedAt = Date.now();
    }
    return list;
  });
};
```

### 2. Create useListItems Hook
```typescript
// mobile/src/hooks/useListItems.ts
export const useListItems = (listId: string) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = itemService.subscribeToItems(listId, (items) => {
      setItems(items.sort((a, b) => a.createdAt - b.createdAt));
      setLoading(false);
    });
    
    return unsubscribe;
  }, [listId]);

  return { items, loading };
};
```

### 3. Update ListDetailScreen
Complete the item-related functionality in `mobile/src/screens/lists/ListDetailScreen.tsx`:
- Integrate useListItems hook
- Implement handleAddItem
- Implement handleToggleItem  
- Implement handleDeleteItem
- Add edit item dialog

## Database Structure
```
lists/{listId}/items/
  {itemId}/
    id: "itemId"
    text: "Buy milk"
    completed: false
    createdAt: timestamp
    createdBy: "userId"
    completedAt: null (or timestamp when completed)
    completedBy: null (or userId who completed)
```

## Files to Modify
- `mobile/src/services/itemService.ts` - Complete all functions
- `mobile/src/hooks/useListItems.ts` - Create new file
- `mobile/src/screens/lists/ListDetailScreen.tsx` - Integrate service

## Testing
- [ ] Add item appears immediately
- [ ] Toggle updates checkbox and styling
- [ ] Multiple users see toggles in real-time
- [ ] Delete removes item
- [ ] Item counts update correctly
- [ ] Edit saves new text

## References
- `web/app.js` - Original implementation (look for addItemToList, toggleItem)
- `mobile/src/services/itemService.ts` - Service stub
- `mobile/src/screens/lists/ListDetailScreen.tsx` - Screen stub
