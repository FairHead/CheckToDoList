# Issue Workflow Instructions

## Issue-Struktur verstehen

Alle Issues liegen in `.github/issues/` und folgen diesem Schema:

```
ISSUE_XXX_<name>.md
```

## Bearbeitungs-Workflow

### Phase 1: Issue analysieren

1. **Issue-Datei lesen**
   ```
   Öffne: .github/issues/ISSUE_XXX_*.md
   ```

2. **Prüfen**:
   - [ ] Beschreibung verstanden
   - [ ] Akzeptanzkriterien klar
   - [ ] Abhängigkeiten erfüllt
   - [ ] Zu ändernde Dateien identifiziert

### Phase 2: Implementation

#### Reihenfolge für jedes Feature:

```
1. Types       → mobile/src/types/
2. Services    → mobile/src/services/
3. Hooks       → mobile/src/hooks/
4. Screens     → mobile/src/screens/
5. Tests       → mobile/__tests__/
```

#### Bei Service-Implementation:

```typescript
// 1. Öffne bestehenden Stub
// mobile/src/services/listService.ts

// 2. Finde TODO mit Issue-Nummer
// TODO: Implement - Issue #3

// 3. Ersetze throw new Error() mit Implementation

// 4. Nutze web/app.js als Referenz für Logik
```

### Phase 3: Testing

1. **Unit Test erstellen**
   ```
   mobile/__tests__/services/<service>.test.ts
   ```

2. **Manuell testen**
   - iOS Simulator
   - Android Emulator
   - Echtes Gerät (wenn möglich)

### Phase 4: Commit & PR

1. **Änderungen committen**
   ```bash
   git add -A
   git commit -m "feat(<scope>): <beschreibung> #<issue>"
   ```

2. **Branch pushen**
   ```bash
   git push origin feature/<issue>-<name>
   ```

3. **PR erstellen** auf GitHub

---

## Issue-spezifische Workflows

### Issue #1: Project Setup
```
Workflow:
1. React Native Projekt erstellen (außerhalb des Repos)
2. Firebase Projekt in Console anlegen
3. Config-Werte in mobile/src/config/firebase.ts eintragen
4. Dependencies installieren
5. Build testen (iOS + Android)

Erfolgskriterium:
- App startet ohne Fehler
- Firebase initialisiert korrekt
```

### Issue #2: Phone Authentication
```
Workflow:
1. mobile/src/services/authService.ts implementieren
2. mobile/src/hooks/useAuth.ts erstellen
3. Auth Screens vervollständigen:
   - LoginScreen.tsx
   - RegisterScreen.tsx
   - PhoneVerificationScreen.tsx
4. Tests schreiben

Referenz: Firebase Phone Auth Docs
```

### Issue #3: List Management
```
Workflow:
1. mobile/src/services/listService.ts implementieren
2. mobile/src/hooks/useLists.ts erstellen
3. Screens aktualisieren:
   - MyListsScreen.tsx
   - CreateListScreen.tsx
   - ListDetailScreen.tsx

Referenz: web/app.js → createNewList(), renderLists()
```

### Issue #4: Item Management
```
Workflow:
1. mobile/src/services/itemService.ts implementieren
2. mobile/src/hooks/useListItems.ts erstellen
3. ListDetailScreen.tsx erweitern

Referenz: web/app.js → addItemToList(), toggleItem()
```

### Issue #5: Invitation System
```
Workflow:
1. mobile/src/services/inviteService.ts implementieren
2. mobile/src/hooks/useInvitations.ts erstellen
3. InviteMembersScreen.tsx vervollständigen
4. InvitationsScreen.tsx erstellen (neu)

Abhängig von: Issue #3 (Lists müssen existieren)
```

### Issue #6: Contacts Integration
```
Workflow:
1. Native Permissions konfigurieren (iOS + Android)
2. mobile/src/services/contactsService.ts implementieren
3. mobile/src/hooks/useContacts.ts erstellen
4. InviteMembersScreen.tsx integrieren

Besonderheit: Benötigt echtes Gerät zum Testen
```

### Issue #7: Push Notifications
```
Workflow:
1. FCM in Firebase Console aktivieren
2. mobile/src/services/notificationService.ts implementieren
3. Cloud Functions erstellen (functions/ Ordner)
4. App.tsx: Notification Handler einbauen

Abhängig von: Issue #5 (für Invitation Notifications)
```

### Issue #8: Navigation
```
Workflow:
1. mobile/src/navigation/ Ordner erstellen
2. Navigators implementieren:
   - AuthNavigator.tsx
   - MainNavigator.tsx (Tabs)
   - Stack Navigators für jeden Tab
3. App.tsx mit RootNavigator verbinden

Abhängig von: Issue #2 (Auth State für Conditional Rendering)
```

---

## Fehlerbehebung

### "TODO not found"
→ Datei wurde bereits bearbeitet, suche nach der Funktion

### "Type error"
→ Prüfe mobile/src/types/ ob alle Interfaces definiert sind

### "Firebase error"
→ Prüfe mobile/src/config/firebase.ts Konfiguration

### "Build failed"
→ `cd ios && pod install` bzw. Android Gradle Sync

---

## Qualitätschecks vor Commit

```bash
# TypeScript Kompilierung
npm run typescript

# Linting
npm run lint

# Tests
npm test

# iOS Build
npx react-native run-ios

# Android Build
npx react-native run-android
```
