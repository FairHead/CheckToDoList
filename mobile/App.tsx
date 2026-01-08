/**
 * CheckToDoList Mobile App
 * Collaborative ToDo-Listen App mit Firebase Backend
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Firebase initialisieren
import '@react-native-firebase/app';

// Auth Context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Navigators
import { AuthNavigator, MainNavigator } from './src/navigation';

// Colors
import { COLORS } from './src/constants/colors';

/**
 * App Root Navigator
 * Zeigt AuthNavigator oder MainNavigator basierend auf Auth-Status
 */
const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Zeige Loading Screen während Auth-Check
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Lade...</Text>
      </View>
    );
  }

  // Zeige Auth oder Main Navigator basierend auf User-Status
  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

/**
 * App Root Component
 * Wrapped mit AuthProvider für globalen Auth-State
 */
function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default App;
