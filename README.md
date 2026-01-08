# CheckToDoList

Eine moderne To-Do Listen Anwendung mit Material Design, die es ermöglicht, mehrere Listen zu erstellen und zu verwalten.

![Material Design](https://img.shields.io/badge/Material%20Design-Lite-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Features

✅ **Mehrere Listen** - Erstelle beliebig viele To-Do Listen mit individuellen Namen  
✅ **Items hinzufügen** - Füge Aufgaben zu jeder Liste hinzu  
✅ **Checkbox** - Markiere Aufgaben als erledigt  
✅ **Bearbeiten** - Bearbeite Listen-Namen und Item-Texte jederzeit  
✅ **Löschen** - Entferne einzelne Items oder ganze Listen  
✅ **Persistenz** - Alle Daten werden im LocalStorage gespeichert  
✅ **Responsive Grid** - Listen werden in einem 3-spalten Layout angezeigt  
✅ **Scrollbar** - Listen mit vielen Items sind scrollbar  
✅ **Material Design** - Modernes UI mit Material Design Lite

## Screenshot

Die App zeigt Listen in einem übersichtlichen 3-spalten Grid an. Jede Liste hat:
- Header mit Listenname und "+" Button für neue Items
- Scrollbarer Content-Bereich für die Aufgaben
- Footer mit Buttons zum Bearbeiten und Löschen der Liste

## Installation

1. Repository klonen:
```bash
git clone https://github.com/FairHead/CheckToDoList.git
```

2. `index.html` im Browser öffnen

Das ist alles! Keine weiteren Abhängigkeiten oder Build-Schritte erforderlich.

## Verwendung

### Liste erstellen
1. Klicke auf "Erstelle Liste" oder den "+" Button oben rechts
2. Gib einen Namen für die Liste ein
3. Klicke auf "Erstellen"

### Item hinzufügen
1. Klicke auf den "+" Button im Header einer Liste
2. Gib den Text für das Item ein
3. Klicke auf "Hinzufügen"

### Item als erledigt markieren
- Klicke auf die Checkbox neben dem Item

### Item bearbeiten
- Klicke auf das Stift-Icon neben dem Item

### Item löschen
- Klicke auf das Mülleimer-Icon neben dem Item

### Liste umbenennen
- Klicke auf das Stift-Icon im Footer der Liste

### Liste löschen
- Klicke auf das Mülleimer-Icon im Footer der Liste

## Tastenkürzel

| Taste | Aktion |
|-------|--------|
| `Enter` | Dialog bestätigen |
| `Escape` | Dialog schließen |

## Technologien

- **HTML5** - Struktur
- **CSS3** - Styling mit Grid Layout
- **JavaScript (Vanilla)** - Logik und DOM-Manipulation
- **Material Design Lite** - UI-Komponenten und Icons
- **LocalStorage** - Datenpersistenz

## Projektstruktur

```
CheckToDoList/
├── index.html    # Hauptseite mit HTML-Struktur
├── styles.css    # Alle CSS-Styles
├── app.js        # JavaScript-Logik
└── README.md     # Diese Datei
```

## Lizenz

MIT License - Frei zur Verwendung und Modifikation.
