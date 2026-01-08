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
import * as authService from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (displayName.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return;
    }
    
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
        displayName: displayName.trim(),
        isNewUser: true
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Sign up to start sharing lists with friends
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.textSecondary}
          value={displayName}
          onChangeText={setDisplayName}
          autoFocus
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+49 123 456789"
          placeholderTextColor={COLORS.textSecondary}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
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
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
      >
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
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
