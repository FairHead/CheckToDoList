# Code Review Instructions

## Prüfkriterien

### 1. TypeScript Qualität
- [ ] Keine `any` Types verwendet
- [ ] Alle Funktionen haben Rückgabetypen
- [ ] Interfaces für Props definiert
- [ ] Strict Mode kompatibel

### 2. React Best Practices
- [ ] Funktionale Komponenten mit Hooks
- [ ] useEffect hat korrektes Dependency Array
- [ ] Cleanup-Funktionen für Subscriptions vorhanden
- [ ] Keine unnötigen Re-Renders (useMemo/useCallback wo nötig)
- [ ] Keys bei Listen-Rendering

### 3. Firebase Regeln
- [ ] Realtime Database verwendet (nicht Firestore)
- [ ] Security Rules berücksichtigt
- [ ] Transaktionen für atomare Updates
- [ ] Listener werden unsubscribed
- [ ] Keine sensiblen Daten im Client

### 4. Error Handling
- [ ] try/catch für async Operationen
- [ ] User-freundliche Fehlermeldungen
- [ ] Logging für Debugging (nur Development)
- [ ] Graceful Degradation bei Fehlern

### 5. Performance
- [ ] Keine großen Objekte in State
- [ ] Pagination für lange Listen
- [ ] Bilder optimiert/lazy loaded
- [ ] Bundle Size beachtet

### 6. Sicherheit
- [ ] Keine API-Keys/Secrets im Code
- [ ] Input Validation vorhanden
- [ ] Keine SQL/NoSQL Injection möglich
- [ ] Authentifizierung geprüft

### 7. Accessibility
- [ ] Labels für interaktive Elemente
- [ ] Ausreichende Kontraste
- [ ] Touch-Targets mindestens 44x44px
- [ ] Screen Reader Support

### 8. Code Stil
- [ ] Konsistente Namenskonvention
- [ ] Sinnvolle Kommentare (WARUM, nicht WAS)
- [ ] Keine auskommentierten Code-Blöcke
- [ ] Dateien unter 300 Zeilen

## Review-Prozess

### Bei Service-Dateien prüfen:
```typescript
// ✅ Guter Service
export const createList = async (input: CreateListInput): Promise<List> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new AuthError('Not authenticated');
  
  try {
    // Implementation...
  } catch (error) {
    throw new DatabaseError('Failed to create list', error);
  }
};

// ❌ Problematischer Service
export const createList = async (input: any) => {
  // Kein Auth-Check, kein Error Handling, kein Rückgabetyp
  return database().ref('lists').push(input);
};
```

### Bei Screen-Komponenten prüfen:
```typescript
// ✅ Gute Komponente
const ListScreen: React.FC = () => {
  const { lists, loading, error } = useLists();
  
  useEffect(() => {
    // Cleanup wird automatisch vom Hook gehandhabt
  }, []);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ListGrid lists={lists} />;
};

// ❌ Problematische Komponente
const ListScreen = () => {
  const [lists, setLists] = useState([]);
  
  useEffect(() => {
    // Kein Cleanup, Memory Leak möglich
    database().ref('lists').on('value', snap => {
      setLists(snap.val());
    });
  }, []); // Fehlende Dependency
  
  return lists.map(l => <div>{l.name}</div>); // Fehlendes key
};
```

## Feedback-Format

```markdown
### ✅ Positiv
- Gute Verwendung von TypeScript Generics
- Saubere Trennung von Concerns

### ⚠️ Verbesserungsvorschläge
- Zeile 42: useCallback für Handler verwenden
- Zeile 78: Error Boundary hinzufügen

### ❌ Muss geändert werden
- Zeile 23: `any` Type entfernen
- Zeile 56: Fehlender Cleanup im useEffect
```
