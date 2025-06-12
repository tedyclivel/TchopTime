import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth'; // Pour vérifier l'état de connexion

// Importez tous vos navigateurs et écrans de premier niveau
import SplashScreen from '../screens/SplashScreen';
import OnboardingStack from './OnboardingStack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

const RootNavigator = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* La logique de la séquence */}
      {user ? (
        // Si l'utilisateur est connecté, on va directement à l'application principale
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        // Si l'utilisateur n'est pas connecté, on commence par le Splash, puis l'onboarding, puis l'authentification
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="OnboardingStack" component={OnboardingStack} />
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;