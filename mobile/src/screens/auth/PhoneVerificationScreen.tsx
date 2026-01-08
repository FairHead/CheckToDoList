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

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const CODE_LENGTH = 6;

const PhoneVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef<TextInput>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async () => {
    // TODO: Implement - Issue #2
    // 1. Validate code length
    // 2. Confirm code with Firebase: confirmation.confirm(code)
    // 3. If new user, update profile with displayName
    // 4. Create user document in database
    // 5. Navigate to main app
    
    if (code.length !== CODE_LENGTH) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // const { confirmation, displayName, isNewUser } = route.params;
      // await confirmation.confirm(code);
      // 
      // if (isNewUser && displayName) {
      //   await authService.updateProfile({ displayName });
      // }
      Alert.alert('Not Implemented', 'Issue #2 - Code verification');
    } catch (error: any) {
      Alert.alert('Invalid Code', 'The verification code is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement - Issue #2
    // 1. Resend verification code
    // 2. Reset countdown
    
    setCountdown(60);
    Alert.alert('Not Implemented', 'Issue #2 - Resend code');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={styles.phone}>{route.params?.phoneNumber || '+49 XXX XXX'}</Text>
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
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton}
        onPress={handleResendCode}
        disabled={countdown > 0}
      >
        <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
          {countdown > 0 
            ? `Resend code in ${countdown}s` 
            : 'Resend verification code'}
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
