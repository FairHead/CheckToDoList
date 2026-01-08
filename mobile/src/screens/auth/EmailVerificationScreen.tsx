/**
 * Email Verification Screen
 * 
 * Screen for email verification before proceeding to phone verification.
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md - Authentication Flow
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import * as authService from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const EmailVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profileImage, registrationData } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const isVerified = await authService.isEmailVerified();
      
      if (isVerified) {
        // Upload profile picture if provided
        let photoURL: string | undefined;
        if (profileImage?.uri) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            try {
              photoURL = await authService.uploadProfilePicture(
                currentUser.uid,
                profileImage.uri
              );
            } catch (error) {
              console.error('Error uploading profile picture:', error);
              // Continue without photo
            }
          }
        }

        // Create complete user profile
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          await authService.createCompleteUserProfile(
            currentUser,
            registrationData,
            photoURL
          );
        }

        // Navigate to phone verification
        const confirmation = await authService.sendPhoneVerification(
          registrationData.phoneNumber
        );
        
        navigation.navigate(ROUTES.PHONE_VERIFICATION, {
          confirmation,
          phoneNumber: registrationData.phoneNumber,
          isNewUser: true,
          fromEmailVerification: true,
        });
      } else {
        Alert.alert(
          'Email Not Verified',
          'Please check your email and click the verification link before continuing.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) {
      return;
    }

    setResendLoading(true);
    try {
      await authService.sendEmailVerification();
      setCountdown(60);
      Alert.alert('Success', 'Verification email sent! Please check your inbox.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification email to:
        </Text>
        <Text style={styles.email}>{registrationData?.email}</Text>
        
        <Text style={styles.instructions}>
          Please check your inbox and click the verification link to continue.
        </Text>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.buttonText}>I've Verified My Email</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.resendButton, (resendLoading || countdown > 0) && styles.resendButtonDisabled]}
          onPress={handleResendEmail}
          disabled={resendLoading || countdown > 0}
        >
          {resendLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.resendButtonText}>
              {countdown > 0 
                ? `Resend Email (${countdown}s)` 
                : 'Resend Verification Email'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => {
            authService.logout();
            navigation.navigate(ROUTES.WELCOME);
          }}
        >
          <Text style={styles.linkText}>Cancel Registration</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  linkButton: {
    marginTop: 30,
  },
  linkText: {
    color: COLORS.white,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default EmailVerificationScreen;
