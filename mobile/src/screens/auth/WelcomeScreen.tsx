/**
 * Welcome Screen
 * 
 * Initial screen shown to unauthenticated users.
 * Provides options to sign in or create account.
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md - Navigation Structure
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  // TODO: Implement - Issue #2
  // 1. App logo and branding
  // 2. "Sign In" button -> LoginScreen
  // 3. "Create Account" button -> RegisterScreen
  // 4. Optional: Skip for anonymous usage
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CheckToDoList</Text>
      <Text style={styles.subtitle}>Listen mit Freunden und Familie teilen</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
        >
          <Text style={styles.primaryButtonText}>Anmelden</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)}
        >
          <Text style={styles.secondaryButtonText}>Konto erstellen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
