# Test Instructions

## Test-Struktur

```
mobile/
├── __tests__/
│   ├── services/           # Service Unit Tests
│   │   ├── authService.test.ts
│   │   ├── listService.test.ts
│   │   └── itemService.test.ts
│   ├── hooks/              # Hook Tests
│   │   ├── useAuth.test.ts
│   │   └── useLists.test.ts
│   ├── screens/            # Screen Integration Tests
│   │   └── MyListsScreen.test.tsx
│   └── __mocks__/          # Firebase Mocks
│       └── firebase.ts
```

## Test-Konventionen

### Dateiname
- `<component>.test.ts` für Unit Tests
- `<component>.test.tsx` für Komponenten Tests
- `<feature>.integration.test.ts` für Integration Tests

### Struktur
```typescript
describe('ComponentName', () => {
  // Setup vor allen Tests
  beforeAll(() => {
    // Globale Mocks einrichten
  });

  // Setup vor jedem Test
  beforeEach(() => {
    // Test-spezifische Mocks zurücksetzen
    jest.clearAllMocks();
  });

  describe('functionName', () => {
    it('should do expected behavior when given valid input', async () => {
      // Arrange
      const input = { /* test data */ };
      
      // Act
      const result = await functionName(input);
      
      // Assert
      expect(result).toEqual(expected);
    });

    it('should throw error when given invalid input', async () => {
      // Arrange
      const invalidInput = null;
      
      // Act & Assert
      await expect(functionName(invalidInput))
        .rejects
        .toThrow('Expected error message');
    });
  });
});
```

## Firebase Mocking

### Mock Setup
```typescript
// __mocks__/firebase.ts
export const mockAuth = {
  currentUser: {
    uid: 'test-user-id',
    phoneNumber: '+491234567890',
    displayName: 'Test User',
  },
  onAuthStateChanged: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  signOut: jest.fn(),
};

export const mockDatabase = {
  ref: jest.fn(() => ({
    push: jest.fn(() => ({ key: 'new-item-id' })),
    set: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    once: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    transaction: jest.fn(),
  })),
};

jest.mock('@react-native-firebase/auth', () => () => mockAuth);
jest.mock('@react-native-firebase/database', () => () => mockDatabase);
```

### Mock in Tests verwenden
```typescript
import { mockAuth, mockDatabase } from '../__mocks__/firebase';

describe('listService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create list for authenticated user', async () => {
    // Arrange
    const mockListRef = {
      key: 'new-list-id',
      set: jest.fn().mockResolvedValue(undefined),
    };
    mockDatabase.ref.mockReturnValue({
      push: jest.fn().mockReturnValue(mockListRef),
    });

    // Act
    const result = await createList({ name: 'Einkaufsliste' });

    // Assert
    expect(mockDatabase.ref).toHaveBeenCalledWith('lists');
    expect(result.name).toBe('Einkaufsliste');
    expect(result.ownerId).toBe('test-user-id');
  });

  it('should throw when user not authenticated', async () => {
    // Arrange
    mockAuth.currentUser = null;

    // Act & Assert
    await expect(createList({ name: 'Test' }))
      .rejects
      .toThrow('Not authenticated');
  });
});
```

## Komponenten Tests

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MyListsScreen } from '../screens/lists/MyListsScreen';

// Mock Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('MyListsScreen', () => {
  it('should render empty state when no lists', () => {
    const { getByText } = render(<MyListsScreen />);
    
    expect(getByText('No lists yet')).toBeTruthy();
  });

  it('should navigate to create list on button press', () => {
    const { getByText } = render(<MyListsScreen />);
    
    fireEvent.press(getByText('+ New List'));
    
    expect(mockNavigate).toHaveBeenCalledWith('CreateList');
  });

  it('should display lists when available', async () => {
    // Mock useLists hook
    jest.mock('../hooks/useLists', () => ({
      useLists: () => ({
        lists: [
          { id: '1', name: 'Einkaufsliste', itemCount: 5 },
        ],
        loading: false,
      }),
    }));

    const { getByText } = render(<MyListsScreen />);
    
    await waitFor(() => {
      expect(getByText('Einkaufsliste')).toBeTruthy();
    });
  });
});
```

## Test Coverage Ziele

| Bereich | Minimum | Ziel |
|---------|---------|------|
| Services | 80% | 90% |
| Hooks | 70% | 85% |
| Screens | 60% | 75% |
| Utils | 90% | 100% |

## Test Commands

```bash
# Alle Tests ausführen
npm test

# Tests mit Coverage
npm test -- --coverage

# Einzelne Datei testen
npm test -- listService.test.ts

# Watch Mode
npm test -- --watch

# Nur geänderte Tests
npm test -- --onlyChanged
```

## Was MUSS getestet werden

1. **Services**: Alle CRUD Operationen
2. **Error Cases**: Ungültige Eingaben, Netzwerkfehler
3. **Auth States**: Eingeloggt vs. ausgeloggt
4. **Edge Cases**: Leere Listen, Sonderzeichen

## Was NICHT getestet werden muss

1. React Native Framework Code
2. Firebase SDK Internals
3. Externe Libraries
4. Rein visuelle Styling-Eigenschaften
