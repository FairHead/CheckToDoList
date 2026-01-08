# Commit Message Instructions

## Format

```
<type>(<scope>): <kurze beschreibung> #<issue-nummer>

[optionaler body mit mehr details]

[optionaler footer]
```

## Type Präfixe

| Type | Verwendung |
|------|------------|
| `feat` | Neues Feature |
| `fix` | Bugfix |
| `docs` | Nur Dokumentation |
| `style` | Formatierung, keine Code-Änderung |
| `refactor` | Code-Umstrukturierung |
| `test` | Tests hinzufügen/ändern |
| `chore` | Build, Dependencies, Config |

## Scope (Bereich)

| Scope | Bereich |
|-------|---------|
| `auth` | Authentication |
| `lists` | Listen-Verwaltung |
| `items` | Item-Verwaltung |
| `invite` | Einladungssystem |
| `contacts` | Kontakte-Integration |
| `push` | Push Notifications |
| `nav` | Navigation |
| `ui` | UI-Komponenten |
| `config` | Konfiguration |
| `deps` | Dependencies |

## Beispiele

### Feature
```
feat(auth): Phone Authentication implementiert #2

- signInWithPhone() Funktion erstellt
- SMS Verification Flow hinzugefügt
- User Profil in Database angelegt
```

### Bugfix
```
fix(lists): Race Condition beim Laden behoben #3

Problem: Listen wurden doppelt angezeigt wenn
schnell zwischen Tabs gewechselt wurde.

Lösung: Unsubscribe beim Component Unmount
```

### Refactoring
```
refactor(services): Firebase Queries optimiert #4

- Batch-Updates statt einzelne Writes
- Index für häufige Abfragen hinzugefügt
```

### Dokumentation
```
docs: README mit Setup-Anleitung aktualisiert
```

### Dependencies
```
chore(deps): React Navigation auf 6.1.10 aktualisiert
```

## Regeln

1. **Immer Issue-Nummer** referenzieren wenn vorhanden
2. **Imperativ** verwenden ("add" nicht "added")
3. **Erste Zeile max 72 Zeichen**
4. **Leerzeile** zwischen Titel und Body
5. **Deutsche Beschreibung**, englische Präfixe
6. **Breaking Changes** im Footer mit `BREAKING CHANGE:` markieren

## Breaking Change Beispiel

```
feat(auth): Neues User-Datenmodell #2

BREAKING CHANGE: User.name wurde zu User.displayName umbenannt.
Migration: Bestehende User-Dokumente müssen aktualisiert werden.
```
