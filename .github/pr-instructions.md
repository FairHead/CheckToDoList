# Pull Request Instructions

## PR Titel Format

```
[<type>] <kurze beschreibung> (#<issue-nummer>)
```

### Beispiele:
- `[Feature] Phone Authentication implementiert (#2)`
- `[Fix] Listen-Sync Race Condition behoben (#3)`
- `[Refactor] Service Layer optimiert (#4)`

## PR Template

```markdown
## 📋 Beschreibung
<!-- Was wurde geändert und warum? -->

Dieses PR implementiert [Feature/Fix] für Issue #X.

## 🔗 Referenziertes Issue
Closes #X

## 📝 Änderungen

### Neue Dateien
- `mobile/src/services/newService.ts` - Beschreibung
- `mobile/src/hooks/useNewHook.ts` - Beschreibung

### Geänderte Dateien
- `mobile/src/screens/SomeScreen.tsx` - Was wurde geändert

### Gelöschte Dateien
- Keine

## 🧪 Testing

### Manuelle Tests durchgeführt
- [ ] Feature X funktioniert wie erwartet
- [ ] Error Cases getestet
- [ ] Auf iOS getestet
- [ ] Auf Android getestet

### Automatische Tests
- [ ] Unit Tests hinzugefügt
- [ ] Alle bestehenden Tests grün

## 📱 Screenshots/Videos
<!-- Bei UI-Änderungen: Vorher/Nachher Screenshots -->

| Vorher | Nachher |
|--------|---------|
| [Screenshot] | [Screenshot] |

## ✅ Checkliste

- [ ] Code folgt den Projektrichtlinien
- [ ] Selbst-Review durchgeführt
- [ ] Kommentare an komplexen Stellen hinzugefügt
- [ ] Dokumentation aktualisiert (falls nötig)
- [ ] Keine Breaking Changes (oder dokumentiert)
- [ ] TypeScript kompiliert ohne Fehler
- [ ] ESLint zeigt keine Warnungen

## 🚀 Deployment Notes
<!-- Besondere Hinweise für Deployment? Migration nötig? -->

Keine besonderen Hinweise.

## 📚 Zusätzliche Informationen
<!-- Links zu Docs, Design-Entscheidungen, etc. -->
```

## PR Größe Richtlinien

| Größe | Zeilen | Empfehlung |
|-------|--------|------------|
| XS | < 50 | ✅ Ideal für Reviews |
| S | 50-200 | ✅ Gut reviewbar |
| M | 200-500 | ⚠️ Aufteilen erwägen |
| L | 500-1000 | ❌ Zu groß, aufteilen |
| XL | > 1000 | ❌ Definitiv aufteilen |

## Branch Naming

```
<type>/<issue-nummer>-<kurze-beschreibung>
```

### Beispiele:
- `feature/2-phone-auth`
- `fix/3-list-sync`
- `refactor/4-service-layer`
- `docs/readme-update`

## Merge Strategie

1. **Squash and Merge** für Feature Branches
2. **Rebase and Merge** für kleine Fixes
3. **Merge Commit** nur für Release Branches

## Review Anforderungen

- Mindestens 1 Approval vor Merge
- Alle Conversations resolved
- CI/CD Pipeline grün
- Keine Merge Konflikte
