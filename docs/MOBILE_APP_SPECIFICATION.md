# 📱 CheckToDoList - Mobile App Spezifikation

## 🎯 Projektziel

Transformation der bestehenden Web-App (`web/`) in eine native Mobile-App mit:
- **Echtzeit-Synchronisation** zwischen mehreren Nutzern
- **Einladungssystem** für geteilte Listen
- **Push-Benachrichtigungen** bei Änderungen
- **Offline-Fähigkeit**

---

## 📂 Bestehendes Projekt (Web-App)

**Speicherort:** `web/`

**Aktuelle Features:**
- Listen erstellen, umbenennen, löschen
- Items hinzufügen, bearbeiten, löschen, als erledigt markieren
- 3-Spalten Grid Layout
- Scrollbare Listen bei vielen Items
- Daten werden im localStorage gespeichert

**Design-Farben (beibehalten für Mobile):**
| Element | Farbe |
|---------|-------|
| Header | `#0288D1` (Dunkelblau) |
| Hintergrund | `#29B6F6` (Hellblau) |
| Listen-Border | `#0288D1` |
| Text dunkel | `#333` |
| Placeholder | `#b0b0b0` |

---

## 🛠️ Technologie-Stack

### Mobile App (Frontend)

| Technologie | Version | Zweck |
|-------------|---------|-------|
| **React Native** | 0.73+ | Cross-Platform Framework |
| **TypeScript** | 5.0+ | Type-Safety |
| **React Navigation** | 6.x | Screen-Navigation |
| **@react-native-firebase/app** | 18.x | Firebase SDK |
| **@react-native-firebase/auth** | 18.x | Authentication |
| **@react-native-firebase/database** | 18.x | Realtime Database |
| **@react-native-firebase/messaging** | 18.x | Push Notifications |
| **react-native-contacts** | 7.x | Kontakt-Zugriff |
| **@react-native-async-storage** | 1.x | Offline-Cache |

### Backend (Firebase)

| Service | Zweck |
|---------|-------|
| **Firebase Authentication** | User Login/Register mit Email + Telefon |
| **Firebase Realtime Database** | Echtzeit-Datensynchronisation |
| **Firebase Cloud Functions** | Server-Logik & Push-Trigger |
| **Firebase Cloud Messaging** | Push-Benachrichtigungen |

---

## 📊 Datenbank-Schema (Firebase Realtime Database)

```json
{
  "users": {
    "$userId": {
      "email": "string",
      "displayName": "string",
      "phoneNumber": "string (E.164 Format: +491234567890)",
      "fcmTokens": {
        "$tokenId": {
          "token": "string",
          "device": "string",
          "updatedAt": "number (timestamp)"
        }
      },
      "settings": {
        "notificationsEnabled": "boolean",
        "soundEnabled": "boolean"
      },
      "createdAt": "number (timestamp)"
    }
  },

  "lists": {
    "$listId": {
      "name": "string",
      "ownerId": "string (userId)",
      "ownerName": "string",
      "createdAt": "number (timestamp)",
      
      "members": {
        "$userId": {
          "role": "owner | editor",
          "displayName": "string",
          "joinedAt": "number (timestamp)"
        }
      },
      
      "items": {
        "$itemId": {
          "text": "string",
          "completed": "boolean",
          "completedAt": "number (timestamp) | null",
          "completedBy": "string (userId) | null",
          "addedBy": "string (userId)",
          "addedByName": "string",
          "createdAt": "number (timestamp)"
        }
      }
    }
  },

  "userLists": {
    "$userId": {
      "$listId": {
        "listName": "string",
        "role": "owner | editor",
        "isShared": "boolean"
      }
    }
  },

  "invitations": {
    "$invitationId": {
      "listId": "string",
      "listName": "string",
      "fromUserId": "string",
      "fromUserName": "string",
      "toUserId": "string",
      "toPhoneNumber": "string",
      "status": "pending | accepted | declined",
      "createdAt": "number (timestamp)"
    }
  },

  "userInvitations": {
    "$userId": {
      "pending": {
        "$invitationId": "boolean (true)"
      }
    }
  },

  "phoneToUser": {
    "$phoneNumberNormalized": "string (userId)"
  }
}
```

---

## 🎨 Feature-Spezifikationen

### Feature 1: Account & Authentifizierung

**Screens:**
1. `WelcomeScreen` - App-Logo, "Anmelden" & "Registrieren" Buttons
2. `LoginScreen` - Email + Passwort Input
3. `RegisterScreen` - Name, Email, Passwort
4. `PhoneVerificationScreen` - Telefonnummer + SMS-Code

**Service:** `authService.ts`
```typescript
interface AuthService {
  register(email: string, password: string, displayName: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  sendPhoneVerification(phoneNumber: string): Promise<ConfirmationResult>;
  confirmPhoneCode(confirmationResult: ConfirmationResult, code: string): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
  getCurrentUser(): User | null;
}
```

### Feature 2: Listen-Management

**Screens:**
1. `MyListsScreen` - Grid mit eigenen Listen
2. `SharedListsScreen` - Grid mit geteilten Listen
3. `ListDetailScreen` - Items einer Liste
4. `CreateListScreen` - Modal für neue Liste

**Service:** `listService.ts`
```typescript
interface ListService {
  createList(name: string): Promise<List>;
  updateList(listId: string, updates: Partial<List>): Promise<void>;
  deleteList(listId: string): Promise<void>;
  getMyLists(userId: string): Promise<List[]>;
  getSharedLists(userId: string): Promise<List[]>;
  subscribeToMyLists(userId: string, callback: (lists: List[]) => void): Unsubscribe;
  subscribeToList(listId: string, callback: (list: List) => void): Unsubscribe;
}
```

### Feature 3: Item-Management

**Service:** `itemService.ts`
```typescript
interface ItemService {
  addItem(listId: string, text: string): Promise<Item>;
  updateItem(listId: string, itemId: string, updates: Partial<Item>): Promise<void>;
  deleteItem(listId: string, itemId: string): Promise<void>;
  toggleItemCompleted(listId: string, itemId: string): Promise<void>;
  subscribeToItems(listId: string, callback: (items: Item[]) => void): Unsubscribe;
}
```

### Feature 4: Einladungs-System

**User Flow:**
1. Owner öffnet Liste → "Einladen"
2. Kontakt auswählen
3. Einladung wird erstellt
4. Eingeladener bekommt Push
5. Eingeladener nimmt an/lehnt ab
6. Bei Annahme: Liste erscheint unter "Geteilt"

**Service:** `inviteService.ts`
```typescript
interface InviteService {
  sendInvitation(listId: string, toUserId: string): Promise<Invitation>;
  acceptInvitation(invitationId: string): Promise<void>;
  declineInvitation(invitationId: string): Promise<void>;
  getPendingInvitations(userId: string): Promise<Invitation[]>;
  subscribeToPendingInvitations(userId: string, callback: (invitations: Invitation[]) => void): Unsubscribe;
}
```

### Feature 5: Kontakt-Integration

**Service:** `contactsService.ts`
```typescript
interface ContactsService {
  requestPermission(): Promise<boolean>;
  getContacts(): Promise<Contact[]>;
  matchContactsWithUsers(contacts: Contact[]): Promise<MatchedContact[]>;
  sendSMSInvite(phoneNumber: string, listName: string): Promise<void>;
}
```

### Feature 6: Push-Benachrichtigungen

**Events:**
| Event | Nachricht |
|-------|-----------|
| Neue Einladung | "{name} hat dich zu '{liste}' eingeladen" |
| Einladung angenommen | "{name} hat deine Einladung angenommen" |
| Neues Item | "{name} hat '{item}' zu '{liste}' hinzugefügt" |
| Item erledigt | "{name} hat '{item}' als erledigt markiert" |

---

## 📱 Navigation-Struktur

```
App Start
    │
    ├── Nicht eingeloggt ──► AuthNavigator
    │                            ├── WelcomeScreen
    │                            ├── LoginScreen
    │                            ├── RegisterScreen
    │                            └── PhoneVerificationScreen
    │
    └── Eingeloggt ──► MainNavigator (Tab-Navigation)
                           ├── Tab: Meine Listen
                           │       └── MyListsStack
                           │             ├── MyListsScreen
                           │             ├── ListDetailScreen
                           │             └── InviteMembersScreen
                           │
                           ├── Tab: Geteilt
                           │       └── SharedListsStack
                           │             ├── SharedListsScreen
                           │             └── ListDetailScreen
                           │
                           ├── Tab: Einladungen
                           │       └── InvitationsScreen
                           │
                           └── Tab: Profil
                                   └── ProfileStack
                                         ├── ProfileScreen
                                         └── SettingsScreen
```

---

## 📋 Entwicklungs-Reihenfolge

1. **Issue #1:** Projekt-Setup (React Native + Firebase)
2. **Issue #2:** Authentication
3. **Issue #3:** Listen-Management
4. **Issue #4:** Item-Management
5. **Issue #5:** Einladungs-System
6. **Issue #6:** Kontakt-Integration
7. **Issue #7:** Push-Benachrichtigungen
8. **Issue #8:** Offline-Support & Polish

---

## 🔗 Referenzen

- Bestehende Web-App: `web/`
- TypeScript Interfaces: `mobile/src/types/`
- Service-Implementierungen: `mobile/src/services/`
- Cloud Functions: `functions/src/triggers/`
