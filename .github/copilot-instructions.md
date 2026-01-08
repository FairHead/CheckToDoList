# Copilot Instructions für CheckToDoList

## 🎯 Projektübersicht

CheckToDoList ist eine kollaborative ToDo-Listen App mit zwei Komponenten:
- **Web App** (`web/`): Vanilla HTML/CSS/JavaScript mit Material Design Lite
- **Mobile App** (`mobile/`): React Native mit TypeScript und Firebase Backend

## 📁 Projektstruktur verstehen

```
CheckToDoList/
├── web/                    # Bestehende Web-App (Referenz-Implementation)
│   ├── index.html          # UI-Struktur
│   ├── app.js              # Logik (CRUD, localStorage)
│   └── styles.css          # Styling
│
├── mobile/                 # React Native App (in Entwicklung)
│   └── src/
│       ├── config/         # Firebase Konfiguration
│       ├── constants/      # Farben, Routen
│       ├── hooks/          # Custom React Hooks
│       ├── screens/        # Screen-Komponenten
│       ├── services/       # Firebase Service Layer
│       └── types/          # TypeScript Interfaces
│
├── docs/                   # Dokumentation
│   └── MOBILE_APP_SPECIFICATION.md
│
└── .github/issues/         # Issue-Dokumentation
```

## 🔧 Technologie-Stack

### Mobile App
- **Framework**: React Native 0.73+ mit TypeScript
- **Backend**: Firebase (NICHT Firestore, sondern Realtime Database)
- **Auth**: Firebase Phone Authentication
- **Navigation**: React Navigation 6.x
- **State**: React Context API + Custom Hooks

### Wichtige Abhängigkeiten
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/database`
- `@react-native-firebase/messaging`
- `react-native-contacts`

## 📝 Code-Stil Regeln

### TypeScript
```typescript
// ✅ RICHTIG: Explizite Typen, keine any
const addItem = async (listId: string, text: string): Promise<Item> => {
  // ...
};

// ❌ FALSCH: any vermeiden
const addItem = async (listId: any, text: any): Promise<any> => {
  // ...
};
```

### React Komponenten
```typescript
// ✅ RICHTIG: Funktionale Komponenten mit Props-Interface
interface Props {
  listId: string;
  onItemAdded: (item: Item) => void;
}

const AddItemForm: React.FC<Props> = ({ listId, onItemAdded }) => {
  // ...
};

// ❌ FALSCH: Keine inline Props-Definition
const AddItemForm = ({ listId, onItemAdded }: { listId: string; onItemAdded: any }) => {
  // ...
};
```

### Error Handling
```typescript
// ✅ RICHTIG: Immer try/catch mit spezifischem Error Handling
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  if (error instanceof FirebaseError) {
    // Firebase-spezifischer Fehler
    console.error('Firebase Error:', error.code, error.message);
  }
  throw error; // Re-throw für UI-Handling
}
```

### Kommentare
- **Deutsch** für erklärende Kommentare
- **Englisch** für JSDoc und technische Dokumentation
- Kommentiere WARUM, nicht WAS

```typescript
// Prüfe ob der Nutzer Eigentümer ist, um Löschen zu erlauben
if (list.ownerId === currentUser.uid) {
  // ...
}
```

## 🎨 Design System

### Farben (aus web/styles.css übernommen)
| Variable | Hex | Verwendung |
|----------|-----|------------|
| `primary` | `#0288D1` | Header, Buttons, aktive Elemente |
| `background` | `#29B6F6` | Hintergrund |
| `contentBackground` | `#81D4FA` | Karten, Inputs |
| `text` | `#333333` | Primärer Text |
| `textSecondary` | `#757575` | Sekundärer Text |
| `white` | `#FFFFFF` | Weißer Text/Hintergrund |
| `success` | `#4CAF50` | Erfolg, App-User Badge |
| `danger` | `#F44336` | Löschen, Fehler |

### Styling-Regeln
- StyleSheet.create() verwenden, keine Inline-Styles
- Responsive Design mit Flexbox
- Konsistente Abstände: 8, 12, 16, 20, 24px

## 🗄️ Firebase Datenbank-Schema

### Wichtig: Realtime Database Struktur
```
/users/{userId}
  displayName: string
  phoneNumber: string
  createdAt: timestamp
  ownedLists: { [listId]: true }
  sharedLists: { [listId]: true }
  pendingInvitations: { [invitationId]: true }
  fcmToken: string

/lists/{listId}
  id: string
  name: string
  ownerId: string
  members: { [userId]: { joinedAt, canEdit } }
  items: { [itemId]: Item }
  itemCount: number
  completedCount: number
  createdAt: timestamp
  updatedAt: timestamp

/invitations/{invitationId}
  id: string
  listId: string
  inviterId: string
  inviterName: string
  inviteeId: string | null
  inviteePhone: string
  status: 'pending' | 'accepted' | 'declined' | 'cancelled'
  createdAt: timestamp
```

## 🔄 Workflow für Issue-Bearbeitung

### Schritt 1: Issue verstehen
1. Lies die Issue-Datei in `.github/issues/ISSUE_XXX_*.md`
2. Prüfe Acceptance Criteria
3. Identifiziere zu ändernde Dateien

### Schritt 2: Implementation
1. Beginne mit Service-Layer (`mobile/src/services/`)
2. Erstelle/aktualisiere Types (`mobile/src/types/`)
3. Implementiere Hook (`mobile/src/hooks/`)
4. Verbinde mit Screen (`mobile/src/screens/`)

### Schritt 3: Referenz nutzen
- `web/app.js` enthält die Original-Logik
- Übertrage Konzepte von localStorage zu Firebase
- Behalte gleiche Funktionsnamen wenn sinnvoll

### Schritt 4: Testing
- Jede Service-Funktion muss testbar sein
- Mock Firebase für Unit Tests
- Teste Error-Cases

## ⚠️ Wichtige Hinweise

### DOs ✅
- Firebase Realtime Database verwenden
- TypeScript strict mode beachten
- Offline-Fähigkeit berücksichtigen
- Real-time Subscriptions mit cleanup (unsubscribe)
- Atomic updates mit `database().ref().update()`

### DON'Ts ❌
- KEIN Firestore verwenden
- KEINE `any` Types
- KEINE direkten State-Mutationen
- KEINE Passwörter/API-Keys im Code
- KEINE console.log in Production-Code

## 📋 Issue-Abhängigkeiten

```
Issue #1 (Setup) ──────────────────────────────────┐
                                                   ↓
Issue #2 (Auth) ────────────────────────────────→ Issue #8 (Navigation)
                                                   ↓
Issue #3 (Lists) ←─────────────────────────────────┘
     ↓
Issue #4 (Items)
     ↓
Issue #5 (Invitations) ←── Issue #6 (Contacts)
     ↓
Issue #7 (Notifications)
```

## 🧪 Test-Konventionen

```typescript
// Dateiname: serviceFile.test.ts
describe('listService', () => {
  describe('createList', () => {
    it('should create a new list with given name', async () => {
      // Arrange
      const input = { name: 'Einkaufsliste' };
      
      // Act
      const result = await createList(input);
      
      // Assert
      expect(result.name).toBe('Einkaufsliste');
      expect(result.ownerId).toBe(mockUserId);
    });

    it('should throw error when user not authenticated', async () => {
      // ...
    });
  });
});
```
