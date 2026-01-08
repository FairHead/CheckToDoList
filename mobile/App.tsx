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
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase initialisieren
import '@react-native-firebase/app';

// Context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Screens
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import RegisterStep2Screen from './src/screens/auth/RegisterStep2Screen';
import EmailVerificationScreen from './src/screens/auth/EmailVerificationScreen';
import PhoneVerificationScreen from './src/screens/auth/PhoneVerificationScreen';

// Constants
import { ROUTES } from './src/constants/routes';
import { COLORS } from './src/constants/colors';

const Stack = createNativeStackNavigator();

/**
 * Auth Navigator - Screens for unauthenticated users
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.REGISTER_STEP2} component={RegisterStep2Screen} />
      <Stack.Screen name={ROUTES.EMAIL_VERIFICATION} component={EmailVerificationScreen} />
      <Stack.Screen name={ROUTES.PHONE_VERIFICATION} component={PhoneVerificationScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main Navigator - Placeholder for authenticated users
 * TODO: Issue #8 - Full navigation implementation
 */
const MainNavigator = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerText}>CheckToDoList</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>🎉 Authentication Successful!</Text>
        <Text style={styles.subText}>
          You are now logged in.
        </Text>
        <Text style={styles.subText}>
          Next: Implement list management (Issue #3)
        </Text>
      </View>
    </SafeAreaView>
  );
};

/**
 * Loading Screen during auth status check
 */
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

/**
 * App Root with Navigation
 */
const AppRoot = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

/**
 * App Component with AuthProvider
 */
function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
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
