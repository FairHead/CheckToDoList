/**
 * Register Screen - Step 2
 * 
 * Second step of user registration with birth date, phone number, username, and terms acceptance.
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
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import * as authService from '../../services/authService';
import { 
  validatePhoneNumber, 
  validateBirthDate, 
  validateUsername 
} from '../../utils/validation';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const RegisterStep2Screen: React.FC<Props> = ({ navigation, route }) => {
  const { profileImage, firstName, lastName, email, password } = route.params || {};

  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate birth date
    const birthDateValidation = validateBirthDate(birthDate);
    if (!birthDateValidation.isValid) {
      Alert.alert('Error', birthDateValidation.error);
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      Alert.alert('Error', phoneValidation.error);
      return;
    }

    // Validate username (optional)
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      Alert.alert('Error', usernameValidation.error);
      return;
    }

    // Check username availability if provided
    if (username) {
      try {
        const isAvailable = await authService.checkUsernameAvailability(username);
        if (!isAvailable) {
          Alert.alert('Error', 'This username is already taken. Please choose another one.');
          return;
        }
      } catch (error) {
        Alert.alert('Error', 'Could not check username availability. Please try again.');
        return;
      }
    }

    // Check terms acceptance
    if (!acceptedTerms) {
      Alert.alert('Error', 'You must accept the Terms & Conditions to continue');
      return;
    }

    setLoading(true);
    try {
      // 1. Register user with email/password
      const user = await authService.registerWithEmail({
        firstName,
        lastName,
        email,
        password,
        birthDate,
        phoneNumber,
        username,
        bio,
        acceptedTerms,
      });

      // 2. Navigate to email verification
      navigation.navigate(ROUTES.EMAIL_VERIFICATION, {
        profileImage,
        registrationData: {
          firstName,
          lastName,
          email,
          password,
          birthDate,
          phoneNumber,
          username,
          bio,
          acceptedTerms,
        },
      });
    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (text: string) => {
    // Auto-format date as YYYY-MM-DD
    let formatted = text.replace(/[^0-9]/g, '');
    
    if (formatted.length >= 4) {
      formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
    }
    if (formatted.length >= 7) {
      formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
    }
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    
    setBirthDate(formatted);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Almost Done!</Text>
        <Text style={styles.subtitle}>Step 2 of 2</Text>

        {/* Birth Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birth Date * (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="1990-05-15"
            placeholderTextColor={COLORS.textSecondary}
            value={birthDate}
            onChangeText={handleDateChange}
            keyboardType="number-pad"
            maxLength={10}
          />
          <Text style={styles.hint}>You must be at least 13 years old</Text>
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="+49 123 456789"
            placeholderTextColor={COLORS.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Text style={styles.hint}>We'll send you a verification code</Text>
        </View>

        {/* Username (Optional) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="cool_username"
            placeholderTextColor={COLORS.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.hint}>For search and invitations</Text>
        </View>

        {/* Bio (Optional) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            placeholderTextColor={COLORS.textSecondary}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I accept the <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>
            <Text style={styles.linkTextBold}>← Back</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.white,
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: COLORS.white,
    fontSize: 14,
    flex: 1,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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

export default RegisterStep2Screen;
