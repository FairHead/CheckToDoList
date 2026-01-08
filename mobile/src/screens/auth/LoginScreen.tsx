/**
 * Login Screen
 * 
 * Phone number authentication entry.
 * Uses Firebase Phone Auth.
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
  Alert 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../services';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Einfache Validierung: muss mit + beginnen und mindestens 10 Zeichen haben
    return phone.startsWith('+') && phone.length >= 10;
  };

  const handleSendCode = async () => {
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
      const confirmation = await authService.sendPhoneVerification(phoneNumber);
      navigation.navigate(ROUTES.AUTH.PHONE_VERIFICATION, { 
        confirmation, 
        phoneNumber,
        isNewUser: false 
      });
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'SMS konnte nicht gesendet werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anmelden</Text>
      <Text style={styles.subtitle}>
        Geben Sie Ihre Telefonnummer ein, um einen Verifizierungscode zu erhalten
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="+49 123 456789"
          placeholderTextColor={COLORS.placeholder}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoFocus
          editable={!loading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.buttonText}>Verifizierungscode senden</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)}
        disabled={loading}
      >
        <Text style={styles.linkText}>
          Noch kein Konto? <Text style={styles.linkTextBold}>Registrieren</Text>
        </Text>
      </TouchableOpacity>
    </View>
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
  input: {
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
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

export default LoginScreen;
