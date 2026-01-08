/**
 * Auth Navigator
 * 
 * Navigation stack for authentication screens.
 * Used when user is not authenticated.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import { 
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  PhoneVerificationScreen
} from '../screens/auth';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.AUTH.WELCOME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name={ROUTES.AUTH.WELCOME} 
        component={WelcomeScreen} 
      />
      <Stack.Screen 
        name={ROUTES.AUTH.LOGIN} 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name={ROUTES.AUTH.REGISTER} 
        component={RegisterScreen} 
      />
      <Stack.Screen 
        name={ROUTES.AUTH.PHONE_VERIFICATION} 
        component={PhoneVerificationScreen} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
