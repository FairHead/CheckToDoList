# Issue #2: Phone Authentication

## Status: 🟡 READY TO START

## Priority: 🔴 Critical

## Dependencies

- ✅ Issue #1 (Project Setup) - COMPLETED

## Description

Implement phone number authentication using Firebase Phone Auth. Users should be able to sign up and sign in using their phone number with SMS verification.

## Acceptance Criteria

- [ ] User can enter phone number on login/register screen
- [ ] SMS verification code is sent to phone number
- [ ] User can enter 6-digit verification code
- [ ] New users are created in `/users/{uid}` database node
- [ ] Existing users can sign in
- [ ] User profile is stored with displayName, phoneNumber, createdAt
- [ ] Sign out functionality works
- [ ] Error handling for invalid numbers, wrong codes, rate limits

## Implementation Steps

### 1. Implement authService.ts

Complete all TODO items in `mobile/src/services/authService.ts`:

```typescript
// Sign in with phone - sends SMS
export const signInWithPhone = async (phoneNumber: string) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};

// Verify SMS code
export const verifyCode = async (confirmation: any, code: string) => {
  const userCredential = await confirmation.confirm(code);
  return userCredential;
};

// Create user profile in database
export const createUserProfile = async (
  user: FirebaseAuthTypes.User,
  displayName: string
) => {
  await database().ref(`users/${user.uid}`).set({
    displayName,
    phoneNumber: user.phoneNumber,
    createdAt: database.ServerValue.TIMESTAMP,
    ownedLists: {},
    sharedLists: {},
    pendingInvitations: {},
  });
};
```

### 2. Complete Auth Screens

Update the screen components in `mobile/src/screens/auth/`:

- `LoginScreen.tsx` - Implement handleSendCode
- `RegisterScreen.tsx` - Implement handleRegister
- `PhoneVerificationScreen.tsx` - Implement handleVerifyCode, handleResendCode

### 3. Auth State Listener

Create auth state hook to listen for auth changes:

```typescript
// mobile/src/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
};
```

### 4. Navigation Setup

Configure navigation to show auth screens for unauthenticated users:

```typescript
// App.tsx
const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
```

## Files to Modify

- `mobile/src/services/authService.ts` - Complete all functions
- `mobile/src/screens/auth/LoginScreen.tsx` - Implement auth flow
- `mobile/src/screens/auth/RegisterScreen.tsx` - Implement registration
- `mobile/src/screens/auth/PhoneVerificationScreen.tsx` - Implement verification
- `mobile/src/hooks/useAuth.ts` - Create (new file)
- `mobile/App.tsx` - Create with navigation (new file)

## Database Structure

```
users/
  {userId}/
    displayName: "John Doe"
    phoneNumber: "+491234567890"
    createdAt: 1699000000000
    ownedLists: {}
    sharedLists: {}
    pendingInvitations: {}
```

## Testing

- [ ] Can send SMS to valid phone number
- [ ] Can verify correct 6-digit code
- [ ] Invalid code shows error message
- [ ] New user creates database entry
- [ ] Existing user signs in without creating duplicate
- [ ] Sign out clears auth state
- [ ] App navigates to main screen after auth

## References

- [Firebase Phone Auth](https://rnfirebase.io/auth/phone-auth)
- `mobile/src/screens/auth/` - Screen stubs with UI already created
- `mobile/src/services/authService.ts` - Service stub with TODOs
