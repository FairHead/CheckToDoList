# CheckToDoList

A collaborative to-do list app for sharing and managing lists with friends and family.

![React Native](https://img.shields.io/badge/React%20Native-0.73-blue)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 📁 Project Structure

```
CheckToDoList/
├── web/                    # Original web application
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── config/        # Firebase configuration
│   │   ├── constants/     # Colors, routes
│   │   ├── hooks/         # Custom React hooks
│   │   ├── screens/       # Screen components
│   │   ├── services/      # Firebase service layer
│   │   └── types/         # TypeScript interfaces
│   └── package.json
│
├── docs/
│   └── MOBILE_APP_SPECIFICATION.md
│
└── .github/issues/        # Implementation issues for Copilot
```

## ✅ Features

### Web App (Complete)
- ✅ Create lists with custom names
- ✅ Add/edit/delete items
- ✅ Toggle item completion
- ✅ 3-column responsive grid layout
- ✅ Local storage persistence

### Mobile App (In Development)
- 📱 Phone authentication
- 👥 Share lists with contacts
- 🔔 Push notifications for updates
- 🔄 Real-time synchronization
- 📇 Phone contacts integration

## 🛠️ Tech Stack

### Web
- HTML5, CSS3, JavaScript
- Material Design Lite

### Mobile
- React Native 0.73+
- TypeScript
- Firebase (Auth, Realtime Database, Cloud Messaging, Cloud Functions)
- React Navigation 6.x

## 🚀 Development

### Implementation Order (for GitHub Copilot)

1. **Issue #1**: Project Setup & Firebase Configuration
2. **Issue #2**: Phone Authentication  
3. **Issue #8**: Navigation & Tab Structure
4. **Issue #3**: List Management (CRUD)
5. **Issue #4**: Item Management
6. **Issue #5**: Invitation System
7. **Issue #6**: Contacts Integration
8. **Issue #7**: Push Notifications

Each issue in `.github/issues/` contains:
- Detailed description & acceptance criteria
- Implementation steps with code examples
- Files to modify & testing requirements
- References to existing code

### Getting Started

#### Web App
```bash
# Clone and open in browser
git clone https://github.com/FairHead/CheckToDoList.git
open web/index.html
```

#### Mobile App
```bash
# Follow Issue #1 for complete setup
cd mobile
npm install
npx react-native run-ios  # or run-android
```

## 🎨 Design

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#0288D1` | Headers, buttons |
| Background | `#29B6F6` | Main background |
| Content | `#81D4FA` | Cards, inputs |
| Text | `#333333` | Primary text |

## 📚 Documentation

- [Mobile App Specification](docs/MOBILE_APP_SPECIFICATION.md) - Complete mobile app specification
- [Issue #1](/.github/issues/ISSUE_001_project_setup.md) - Project setup guide
- [Issue #2](/.github/issues/ISSUE_002_phone_authentication.md) - Authentication implementation

## License

MIT## Projektstruktur

```
CheckToDoList/
├── index.html    # Hauptseite mit HTML-Struktur
├── styles.css    # Alle CSS-Styles
├── app.js        # JavaScript-Logik
└── README.md     # Diese Datei
```

## Lizenz

MIT License - Frei zur Verwendung und Modifikation.
