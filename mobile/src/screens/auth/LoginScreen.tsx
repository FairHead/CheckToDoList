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
import * as authService from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Validate E.164 Format
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Error', 'Phone number must start with + and country code (e.g., +49)');
      return;
    }

    setLoading(true);
    try {
      const confirmation = await authService.sendPhoneVerification(phoneNumber);
      navigation.navigate(ROUTES.PHONE_VERIFICATION, { 
        confirmation, 
        phoneNumber,
        isNewUser: false 
      });
    } catch (error: any) {
      let message = 'Failed to send verification code';
      
      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later';
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>
        Enter your phone number to receive a verification code
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="+49 123 456789"
          placeholderTextColor={COLORS.textSecondary}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoFocus
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
          <Text style={styles.buttonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate(ROUTES.REGISTER)}
      >
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
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
