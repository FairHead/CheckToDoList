/**
 * Phone Verification Screen
 * 
 * OTP code entry screen for phone authentication.
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md - Authentication Flow
 */

import React, { useState, useRef, useEffect } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { authService } from '../../services';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Navigation Params Type
type PhoneVerificationParams = {
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  phoneNumber: string;
  displayName?: string;
  isNewUser: boolean;
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{
    params: PhoneVerificationParams;
  }>;
};

const CODE_LENGTH = 6;

const PhoneVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [confirmation, setConfirmation] = useState(route.params.confirmation);
  const inputRef = useRef<TextInput>(null);

  const { phoneNumber, displayName, isNewUser } = route.params;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async () => {
    if (code.length !== CODE_LENGTH) {
      Alert.alert('Fehler', 'Bitte geben Sie den 6-stelligen Code ein');
      return;
    }

    setLoading(true);
    try {
      // Bestätige den Verifizierungscode
      const userCredential = await authService.confirmPhoneCode(confirmation, code);
      const user = userCredential.user;

      // Wenn neuer User, erstelle Profil in Database
      if (isNewUser && displayName) {
        await authService.createUserProfile(user, displayName);
      } else if (!isNewUser) {
        // Bei bestehendem User, prüfe ob Profil existiert
        await authService.createUserProfile(user);
      }

      // Navigation erfolgt automatisch durch AuthContext
      // wenn user state sich ändert
    } catch (error: any) {
      setLoading(false);
      if (error.message.includes('Verifizierungscode')) {
        Alert.alert('Ungültiger Code', error.message);
      } else {
        Alert.alert('Fehler', error.message || 'Verifizierung fehlgeschlagen');
      }
      setCode('');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      return;
    }

    setLoading(true);
    try {
      const newConfirmation = await authService.sendPhoneVerification(phoneNumber);
      
      // Update confirmation state
      setConfirmation(newConfirmation);
      
      setCountdown(60);
      Alert.alert('Erfolg', 'Ein neuer Verifizierungscode wurde gesendet');
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'Code konnte nicht erneut gesendet werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifizierungscode</Text>
      <Text style={styles.subtitle}>
        Geben Sie den 6-stelligen Code ein, der an{'\n'}
        <Text style={styles.phone}>{phoneNumber}</Text> gesendet wurde
      </Text>

      <TextInput
        ref={inputRef}
        style={styles.codeInput}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        autoFocus
        textContentType="oneTimeCode" // iOS autofill
        editable={!loading}
      />

      <View style={styles.dotsContainer}>
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <View 
            key={index}
            style={[
              styles.dot,
              code.length > index && styles.dotFilled
            ]}
          >
            <Text style={styles.dotText}>{code[index] || ''}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.button, (loading || code.length !== CODE_LENGTH) && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={loading || code.length !== CODE_LENGTH}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.buttonText}>Verifizieren</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton}
        onPress={handleResendCode}
        disabled={countdown > 0 || loading}
      >
        <Text style={[styles.resendText, (countdown > 0 || loading) && styles.resendTextDisabled]}>
          {countdown > 0 
            ? `Code erneut senden in ${countdown}s` 
            : 'Verifizierungscode erneut senden'}
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
    lineHeight: 24,
  },
  phone: {
    fontWeight: 'bold',
  },
  codeInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  dot: {
    width: 48,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.contentBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotFilled: {
    backgroundColor: COLORS.white,
  },
  dotText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
});

export default PhoneVerificationScreen;
