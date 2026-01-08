# Issue #8: Navigation & Tab Structure

## Priority: 🟡 High

## Dependencies
- Issue #2 (Phone Authentication)
- Issue #3 (List Management) - For content

## Description
Implement the app navigation structure with bottom tab bar and stack navigators for each section.

## Acceptance Criteria
- [ ] Auth flow (Welcome → Login/Register → Verification)
- [ ] Main app has bottom tab bar
- [ ] "My Lists" tab shows owned lists
- [ ] "Shared" tab shows shared lists
- [ ] "Invitations" tab shows pending invitations with badge count
- [ ] "Profile" tab shows user profile and settings
- [ ] Each tab has its own stack navigator
- [ ] Proper back navigation
- [ ] Deep linking for notifications

## Navigation Structure

```
RootNavigator
├── AuthStack (when not logged in)
│   ├── WelcomeScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── PhoneVerificationScreen
│
└── MainTabs (when logged in)
    ├── MyListsStack
    │   ├── MyListsScreen
    │   ├── CreateListScreen
    │   ├── ListDetailScreen
    │   └── InviteMembersScreen
    │
    ├── SharedListsStack
    │   ├── SharedListsScreen
    │   └── ListDetailScreen
    │
    ├── InvitationsStack
    │   └── InvitationsScreen
    │
    └── ProfileStack
        ├── ProfileScreen
        └── SettingsScreen
```

## Implementation Steps

### 1. Create Navigation Types
```typescript
// mobile/src/navigation/types.ts
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  PhoneVerification: {
    confirmation: any;
    phoneNumber: string;
    displayName?: string;
    isNewUser?: boolean;
  };
};

export type MainTabParamList = {
  MyListsTab: undefined;
  SharedTab: undefined;
  InvitationsTab: undefined;
  ProfileTab: undefined;
};

export type MyListsStackParamList = {
  MyLists: undefined;
  CreateList: undefined;
  ListDetail: { listId: string };
  InviteMembers: { listId: string };
};
```

### 2. Create Auth Navigator
```typescript
// mobile/src/navigation/AuthNavigator.tsx
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
  </AuthStack.Navigator>
);
```

### 3. Create Main Tab Navigator
```typescript
// mobile/src/navigation/MainNavigator.tsx
const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  const { pendingInvitations } = useInvitations();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: COLORS.primary },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="MyListsTab" 
        component={MyListsNavigator}
        options={{
          tabBarLabel: 'My Lists',
          tabBarIcon: ({ color }) => <Icon name="list" color={color} />,
        }}
      />
      <Tab.Screen 
        name="SharedTab" 
        component={SharedNavigator}
        options={{
          tabBarLabel: 'Shared',
          tabBarIcon: ({ color }) => <Icon name="people" color={color} />,
        }}
      />
      <Tab.Screen 
        name="InvitationsTab" 
        component={InvitationsNavigator}
        options={{
          tabBarLabel: 'Invitations',
          tabBarIcon: ({ color }) => <Icon name="mail" color={color} />,
          tabBarBadge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
```

### 4. Create Root Navigator
```typescript
// mobile/src/navigation/RootNavigator.tsx
export const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
```

### 5. Update App.tsx
```typescript
// mobile/App.tsx
const App = () => {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
};
```

## Files to Create
- `mobile/src/navigation/types.ts`
- `mobile/src/navigation/AuthNavigator.tsx`
- `mobile/src/navigation/MainNavigator.tsx`
- `mobile/src/navigation/MyListsNavigator.tsx`
- `mobile/src/navigation/SharedNavigator.tsx`
- `mobile/src/navigation/InvitationsNavigator.tsx`
- `mobile/src/navigation/ProfileNavigator.tsx`
- `mobile/src/navigation/RootNavigator.tsx`
- `mobile/src/navigation/index.ts`
- `mobile/App.tsx`

## Testing
- [ ] Unauthenticated user sees auth screens
- [ ] Authenticated user sees tabs
- [ ] Each tab navigates correctly
- [ ] Back button works properly
- [ ] Deep links navigate to correct screen
- [ ] Badge shows on invitations tab

## References
- [React Navigation](https://reactnavigation.org/)
- `mobile/src/constants/routes.ts` - Route constants
- `mobile/src/screens/` - Screen components
