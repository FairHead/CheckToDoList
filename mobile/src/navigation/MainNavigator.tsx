/**
 * Main Navigator
 * 
 * Placeholder for main app navigation after authentication.
 * Will be implemented in Issue #3 (Lists).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

const MainNavigator: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CheckToDoList</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>🎉 Erfolgreich angemeldet!</Text>
        <Text style={styles.subText}>
          Willkommen {user?.displayName || user?.phoneNumber}
        </Text>
        <Text style={styles.infoText}>
          Listen-Verwaltung wird in Issue #3 implementiert
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Abmelden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
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
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainNavigator;
