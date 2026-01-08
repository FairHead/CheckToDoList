# Issue #6: Contacts Integration

## Priority: 🟢 Medium

## Dependencies
- Issue #2 (Phone Authentication)

## Description
Integrate with device contacts to allow easy selection of people to invite to share lists.

## Acceptance Criteria
- [ ] App requests contacts permission on first use
- [ ] Shows explanation of why contacts access is needed
- [ ] Can load all contacts from device
- [ ] Contacts display with name and phone number
- [ ] Can search/filter contacts by name or number
- [ ] Shows badge for contacts who are app users
- [ ] Handles permission denied gracefully

## Implementation Steps

### 1. Install react-native-contacts
Already in package.json, but may need native linking:
```bash
cd ios && pod install
```

### 2. Configure Permissions

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

**iOS** (`ios/CheckToDoList/Info.plist`):
```xml
<key>NSContactsUsageDescription</key>
<string>We need access to your contacts to help you invite friends to share lists.</string>
```

### 3. Complete contactsService.ts
Implement all functions in `mobile/src/services/contactsService.ts`:

```typescript
export const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'CheckToDoList needs access to your contacts to help you invite friends.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const permission = await Contacts.requestPermission();
    return permission === 'authorized';
  }
};

export const getAllContacts = async (): Promise<AppContact[]> => {
  const hasPermission = await checkContactsPermission();
  if (!hasPermission) {
    const granted = await requestContactsPermission();
    if (!granted) return [];
  }

  const contacts = await Contacts.getAll();
  
  return contacts
    .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
    .map(c => ({
      id: c.recordID,
      name: `${c.givenName || ''} ${c.familyName || ''}`.trim() || 'Unknown',
      phoneNumber: normalizePhoneNumber(c.phoneNumbers[0].number),
      isAppUser: false, // Will be updated by getAppUserContacts
      thumbnailPath: c.thumbnailPath,
    }));
};

export const getAppUserContacts = async (): Promise<AppContact[]> => {
  const contacts = await getAllContacts();
  
  // Get all registered phone numbers from Firebase
  const usersSnapshot = await database().ref('users').once('value');
  const users = usersSnapshot.val() || {};
  
  const registeredPhones = new Map<string, string>();
  Object.entries(users).forEach(([uid, user]: [string, any]) => {
    if (user.phoneNumber) {
      registeredPhones.set(normalizePhoneNumber(user.phoneNumber), uid);
    }
  });

  return contacts.map(contact => ({
    ...contact,
    isAppUser: registeredPhones.has(contact.phoneNumber),
    userId: registeredPhones.get(contact.phoneNumber),
  }));
};
```

### 4. Create useContacts Hook
```typescript
// mobile/src/hooks/useContacts.ts
export const useContacts = () => {
  const [contacts, setContacts] = useState<AppContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const allContacts = await contactsService.getAppUserContacts();
      setContacts(allContacts);
      setPermissionDenied(false);
    } catch (error) {
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return { contacts, loading, permissionDenied, refresh: loadContacts };
};
```

### 5. Update InviteMembersScreen
Use the useContacts hook in `mobile/src/screens/lists/InviteMembersScreen.tsx`

## Files to Modify
- `mobile/src/services/contactsService.ts` - Complete all functions
- `mobile/src/hooks/useContacts.ts` - Create new file
- `mobile/src/screens/lists/InviteMembersScreen.tsx` - Use useContacts hook
- `android/app/src/main/AndroidManifest.xml` - Add permission
- `ios/CheckToDoList/Info.plist` - Add usage description

## Testing
- [ ] Permission dialog appears on first load
- [ ] Contacts load after permission granted
- [ ] Search filters contacts correctly
- [ ] App users show badge
- [ ] Permission denied shows helpful message
- [ ] Refresh reloads contacts

## References
- [react-native-contacts](https://github.com/morenoh149/react-native-contacts)
- `mobile/src/services/contactsService.ts` - Service stub
