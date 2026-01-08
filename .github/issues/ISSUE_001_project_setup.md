# Issue #1: Project Setup & Firebase Configuration

## Status: ✅ COMPLETED (2026-01-08)

## Priority: 🔴 Critical (Must be done first)

## Description

Initialize the React Native project with all required dependencies and configure Firebase services.

## Acceptance Criteria

- [x] React Native project initialized with TypeScript
- [x] All dependencies from package.json installed
- [x] Firebase project created in Firebase Console
- [x] Firebase config populated in `mobile/src/config/firebase.ts`
- [x] Firebase services enabled:
  - [x] Authentication (Phone provider)
  - [x] Realtime Database
  - [x] Cloud Messaging
  - [ ] Cloud Functions (not needed for MVP)
- [x] Android configuration complete (google-services.json)
- [x] iOS configuration complete (GoogleService-Info.plist)
- [x] App builds and runs on Android (iOS pending CocoaPods install)

## Completion Notes

- Firebase Project ID: `checktodolist-dbfed`
- Package/Bundle ID: `com.checktodolist`
- React Native Version: 0.73.0
- Fixed JDK compatibility issue (requires JDK 17, configured in gradle.properties)
- Fixed react-native-screens version (3.29.0 for RN 0.73 compatibility)

## Implementation Steps

### 1. Create React Native Project

```bash
npx react-native@latest init CheckToDoList --template react-native-template-typescript
```

### 2. Install Dependencies

```bash
cd mobile
npm install
# Install pods for iOS
cd ios && pod install && cd ..
```

### 3. Firebase Console Setup

1. Go to https://console.firebase.google.com
2. Create new project "CheckToDoList"
3. Enable Authentication > Phone provider
4. Create Realtime Database (start in test mode initially)
5. Download configuration files

### 4. Update Firebase Config

Update `mobile/src/config/firebase.ts` with your actual Firebase config values.

### 5. Database Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "lists": {
      "$listId": {
        ".read": "data.child('ownerId').val() === auth.uid || data.child('members').child(auth.uid).exists()",
        ".write": "!data.exists() || data.child('ownerId').val() === auth.uid || data.child('members').child(auth.uid).exists()"
      }
    },
    "invitations": {
      "$invitationId": {
        ".read": "data.child('inviterId').val() === auth.uid || data.child('inviteeId').val() === auth.uid",
        ".write": "!data.exists() || data.child('inviterId').val() === auth.uid || data.child('inviteeId').val() === auth.uid"
      }
    }
  }
}
```

## Files to Modify

- `mobile/src/config/firebase.ts` - Add actual Firebase config
- `mobile/android/app/google-services.json` - Add Android config
- `mobile/ios/GoogleService-Info.plist` - Add iOS config

## Testing

- [ ] App compiles without errors
- [ ] Firebase initialization successful (no console errors)
- [ ] Can see Firebase project in Firebase Console

## References

- [React Native Firebase Setup](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com)
- [Realtime Database Security Rules](https://firebase.google.com/docs/database/security)
