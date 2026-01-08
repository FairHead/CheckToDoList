# Issue #5: Invitation System

## Priority: 🟡 High

## Dependencies
- Issue #3 (List Management)
- Issue #6 (Contacts Integration) - Optional but recommended

## Description
Implement the invitation system for sharing lists with other users. Users can invite contacts, invitees must confirm to join, and list ownership remains with the creator.

## Acceptance Criteria
- [ ] User can invite contacts to share a list
- [ ] Invitee receives invitation (visible in app)
- [ ] Invitee can accept or decline invitation
- [ ] Accepted invitation adds user to list members
- [ ] List appears in invitee's "Shared Lists"
- [ ] List owner can remove members
- [ ] Members can leave a shared list
- [ ] Owner can cancel pending invitations
- [ ] Invitation shows sender name and list name

## Implementation Steps

### 1. Complete inviteService.ts
Implement all functions in `mobile/src/services/inviteService.ts`:

```typescript
export const sendInvitation = async (
  listId: string,
  inviteePhone: string
): Promise<Invitation> => {
  const inviter = auth().currentUser;
  if (!inviter) throw new Error('Not authenticated');

  // Find invitee by phone number
  const usersSnapshot = await database()
    .ref('users')
    .orderByChild('phoneNumber')
    .equalTo(inviteePhone)
    .once('value');

  const users = usersSnapshot.val();
  const inviteeId = users ? Object.keys(users)[0] : null;

  const invitationRef = database().ref('invitations').push();
  const invitationId = invitationRef.key!;

  const invitation: Invitation = {
    id: invitationId,
    listId,
    inviterId: inviter.uid,
    inviterName: inviter.displayName || 'Unknown',
    inviteeId,
    inviteePhone,
    status: 'pending',
    createdAt: Date.now(),
  };

  await invitationRef.set(invitation);

  // If invitee exists, add to their pending invitations
  if (inviteeId) {
    await database()
      .ref(`users/${inviteeId}/pendingInvitations/${invitationId}`)
      .set(true);
  }

  return invitation;
};

export const acceptInvitation = async (invitationId: string): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');

  const invitationSnapshot = await database()
    .ref(`invitations/${invitationId}`)
    .once('value');
  const invitation = invitationSnapshot.val() as Invitation;

  if (!invitation || invitation.inviteeId !== userId) {
    throw new Error('Invalid invitation');
  }

  // Transaction to update multiple nodes atomically
  const updates: Record<string, any> = {};
  
  // Update invitation status
  updates[`invitations/${invitationId}/status`] = 'accepted';
  updates[`invitations/${invitationId}/respondedAt`] = Date.now();
  
  // Add user to list members
  updates[`lists/${invitation.listId}/members/${userId}`] = {
    joinedAt: Date.now(),
    canEdit: true,
  };
  
  // Add list to user's shared lists
  updates[`users/${userId}/sharedLists/${invitation.listId}`] = true;
  
  // Remove from pending invitations
  updates[`users/${userId}/pendingInvitations/${invitationId}`] = null;

  await database().ref().update(updates);
};
```

### 2. Create useInvitations Hook
```typescript
// mobile/src/hooks/useInvitations.ts
export const useInvitations = () => {
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = inviteService.subscribeToPendingInvitations((invitations) => {
      setPendingInvitations(invitations);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  return { pendingInvitations, loading };
};
```

### 3. Create InvitationsScreen
```typescript
// mobile/src/screens/InvitationsScreen.tsx
// Screen showing pending invitations with accept/decline buttons
```

### 4. Update InviteMembersScreen
Complete `mobile/src/screens/lists/InviteMembersScreen.tsx`:
- Load contacts and identify app users
- Allow selecting multiple contacts
- Send invitations on submit

## Database Structure
```
invitations/
  {invitationId}/
    id: "invitationId"
    listId: "listId"
    inviterId: "userId"
    inviterName: "John Doe"
    inviteeId: "userId" (or null if not app user yet)
    inviteePhone: "+491234567890"
    status: "pending" | "accepted" | "declined" | "cancelled"
    createdAt: timestamp
    respondedAt: timestamp (when accepted/declined)
    listName: "Groceries" (denormalized for display)
```

## Files to Modify
- `mobile/src/services/inviteService.ts` - Complete all functions
- `mobile/src/hooks/useInvitations.ts` - Create new file
- `mobile/src/screens/lists/InviteMembersScreen.tsx` - Complete implementation
- `mobile/src/screens/InvitationsScreen.tsx` - Create new file

## Testing
- [ ] Can send invitation to contact
- [ ] Invitee sees pending invitation
- [ ] Accept adds user to list
- [ ] Decline removes invitation
- [ ] Owner can remove member
- [ ] Member can leave list
- [ ] List appears in "Shared Lists" after accepting

## References
- `docs/MOBILE_APP_SPECIFICATION.md` - Invitation flow section
- `mobile/src/services/inviteService.ts` - Service stub
