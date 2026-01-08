/**
 * Register Screen
 * 
 * New user registration with phone number.
 * Collects display name before verification.
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md - Authentication Flow
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../services';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Einfache Validierung: muss mit + beginnen und mindestens 10 Zeichen haben
    return phone.startsWith('+') && phone.length >= 10;
  };

  const handleRegister = async () => {
    // Validiere Display Name
    if (!displayName.trim() || displayName.trim().length < 2) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein (mindestens 2 Zeichen)');
      return;
    }
    
    // Validiere Telefonnummer
    if (!phoneNumber.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihre Telefonnummer ein');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige Telefonnummer im Format +49... ein');
      return;
    }

    setLoading(true);
    try {
      // Sende Verifizierungscode
      const confirmation = await authService.sendPhoneVerification(phoneNumber);
      
      // Navigiere zu PhoneVerificationScreen mit displayName für neuen User
      navigation.navigate(ROUTES.AUTH.PHONE_VERIFICATION, { 
        confirmation, 
        phoneNumber,
        displayName: displayName.trim(),
        isNewUser: true
      });
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'SMS konnte nicht gesendet werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Konto erstellen</Text>
      <Text style={styles.subtitle}>
        Registrieren Sie sich, um Listen mit Freunden zu teilen
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ihr Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Geben Sie Ihren Namen ein"
          placeholderTextColor={COLORS.placeholder}
          value={displayName}
          onChangeText={setDisplayName}
          autoFocus
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefonnummer</Text>
        <TextInput
          style={styles.input}
          placeholder="+49 123 456789"
          placeholderTextColor={COLORS.placeholder}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!loading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.buttonText}>Weiter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
        disabled={loading}
      >
        <Text style={styles.linkText}>
          Bereits ein Konto? <Text style={styles.linkTextBold}>Anmelden</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.white,
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
