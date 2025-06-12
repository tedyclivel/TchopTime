import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importez vos écrans d'authentification directement depuis 'screens/'
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen'; // <-- Ajouté

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} /> {/* <-- Ajouté */}
    </Stack.Navigator>
  );
};

export default AuthStack;