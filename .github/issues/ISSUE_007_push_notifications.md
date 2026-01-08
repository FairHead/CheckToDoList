# Issue #7: Push Notifications

## Priority: 🟢 Medium

## Dependencies
- Issue #1 (Project Setup)
- Issue #2 (Phone Authentication)
- Issue #5 (Invitation System)

## Description
Implement push notifications using Firebase Cloud Messaging (FCM) to notify users about:
- New list invitations
- Invitation responses (accepted/declined)
- New items added to shared lists
- Items marked as complete

## Acceptance Criteria
- [ ] App requests notification permission on login
- [ ] FCM token stored in user profile
- [ ] User receives push when invited to a list
- [ ] User receives push when invitation is accepted
- [ ] User receives push when item added to shared list
- [ ] User receives push when item is completed
- [ ] Tapping notification opens relevant screen
- [ ] Token refresh handled properly
- [ ] Token removed on logout

## Implementation Steps

### 1. Configure FCM

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

**iOS**: Requires Apple Push Notification service (APNs) configuration in Apple Developer Portal.

### 2. Complete notificationService.ts
Implement all functions in `mobile/src/services/notificationService.ts`:

```typescript
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  } else if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const registerForPushNotifications = async (): Promise<string | null> => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  const token = await messaging().getToken();
  const userId = auth().currentUser?.uid;
  
  if (userId && token) {
    await database().ref(`users/${userId}/fcmToken`).set(token);
  }
  
  return token;
};

export const setupForegroundHandler = (
  onNotification: (notification: PushNotification) => void
): (() => void) => {
  return messaging().onMessage(async remoteMessage => {
    const notification: PushNotification = {
      type: remoteMessage.data?.type as NotificationType,
      title: remoteMessage.notification?.title || '',
      body: remoteMessage.notification?.body || '',
      data: {
        listId: remoteMessage.data?.listId,
        itemId: remoteMessage.data?.itemId,
        invitationId: remoteMessage.data?.invitationId,
      },
    };
    onNotification(notification);
  });
};
```

### 3. Create Cloud Functions for Sending Notifications
```typescript
// functions/src/triggers/onInvitationCreated.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onInvitationCreated = functions.database
  .ref('/invitations/{invitationId}')
  .onCreate(async (snapshot, context) => {
    const invitation = snapshot.val();
    
    if (!invitation.inviteeId) return; // User not registered yet
    
    // Get invitee's FCM token
    const userSnapshot = await admin.database()
      .ref(`users/${invitation.inviteeId}/fcmToken`)
      .once('value');
    const token = userSnapshot.val();
    
    if (!token) return;

    // Get list name
    const listSnapshot = await admin.database()
      .ref(`lists/${invitation.listId}/name`)
      .once('value');
    const listName = listSnapshot.val() || 'a list';

    await admin.messaging().send({
      token,
      notification: {
        title: 'New List Invitation',
        body: `${invitation.inviterName} invited you to "${listName}"`,
      },
      data: {
        type: 'invitation_received',
        invitationId: context.params.invitationId,
        listId: invitation.listId,
      },
    });
  });
```

### 4. Handle Notification Taps
```typescript
// In App.tsx or navigation setup
useEffect(() => {
  // Handle notification opened app from background
  const unsubscribe = notificationService.setupNotificationOpenedHandler((notification) => {
    if (notification.data.listId) {
      navigation.navigate('ListDetail', { listId: notification.data.listId });
    } else if (notification.data.invitationId) {
      navigation.navigate('Invitations');
    }
  });

  // Check if app was opened from notification (cold start)
  notificationService.getInitialNotification().then((notification) => {
    if (notification) {
      // Navigate based on notification type
    }
  });

  return unsubscribe;
}, []);
```

## Files to Modify
- `mobile/src/services/notificationService.ts` - Complete all functions
- `functions/src/triggers/onInvitationCreated.ts` - Create
- `functions/src/triggers/onItemCreated.ts` - Create
- `functions/src/triggers/onItemCompleted.ts` - Create
- `mobile/App.tsx` - Add notification handlers

## Cloud Functions Structure
```
functions/
  src/
    index.ts           # Export all functions
    triggers/
      onInvitationCreated.ts
      onItemCreated.ts
      onItemCompleted.ts
```

## Testing
- [ ] Permission dialog appears (iOS always, Android 13+)
- [ ] FCM token saved to user profile
- [ ] Receive push when invited
- [ ] Receive push when item added (by other user)
- [ ] Tapping notification navigates correctly
- [ ] No notifications for own actions
- [ ] Token updates on refresh

## References
- [Firebase Cloud Messaging RN](https://rnfirebase.io/messaging/usage)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- `mobile/src/services/notificationService.ts` - Service stub
