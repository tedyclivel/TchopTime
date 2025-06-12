import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importez vos écrans d'authentification
import LoginScreen from '../screens/LoginScreen';          // <--- MODIFIÉ
import CreateAccountScreen from '../screens/CreateAccountScreen'; // <--- MODIFIÉ

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      {/* Ajoutez d'autres écrans d'authentification ici (ex: ForgotPasswordScreen) */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;