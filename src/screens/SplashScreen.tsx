// src/screens/SplashScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,        // Import Image for your logo
  Text,         // Import Text for app name
  StatusBar,    // Manage status bar appearance
  Platform      // For platform-specific adjustments
} from 'react-native';
import { useNavigation } from  '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import Firebase Auth (assuming it's initialized via firebase.ts)
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import appPromise from '../config/firebase'; // Renamed to indicate it's a promise

const SplashScreen = () => { // No longer async
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    let unsubscribeFromAuth: (() => void) | undefined;

    const initializeAndListen = async () => {
      try {
        const resolvedApp = await appPromise;
        const authInstance = getAuth(resolvedApp);

        unsubscribeFromAuth = onAuthStateChanged(authInstance, (user) => {
          if (unsubscribeFromAuth) {
            // Unsubscribe after the first auth state change to prevent multiple navigations
            // and ensure the splash screen logic runs only once.
            unsubscribeFromAuth();
          }

          // Simulate a minimum loading time for the splash screen
          setTimeout(() => {
            if (user) {
              console.log('User already logged in:', user.email);
              navigation.replace('MarketList'); // Navigate to main app screen
            } else {
              console.log('No user logged in, navigating to Login.');
              navigation.replace('Login'); // Navigate to Login screen
            }
          }, 2000); // Minimum splash screen visibility duration
        });
      } catch (error) {
        console.error('Firebase initialization or auth error:', error);
        // Fallback navigation if Firebase setup fails
        setTimeout(() => navigation.replace('Login'), 2000);
      }
    };

    initializeAndListen();

    // Cleanup function for useEffect
    return () => {
      if (unsubscribeFromAuth) {
        // This cleanup runs if the component unmounts before onAuthStateChanged callback fires
        unsubscribeFromAuth();
      }
    };
  }, [navigation]); // Dependency array includes navigation

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Remplacez par votre logo d'application */}
      <Image
        source={require('../../assets/logo.jpg')} // Assurez-vous que le chemin est correct et que l'image existe
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo de l'application FoodMart"
      />
      <Text style={styles.appName}>ChopTime</Text> {/* Nom de votre application */}
      <ActivityIndicator size="large" color="#007AFF" style={styles.activityIndicator} />
      {/* Vous pouvez ajouter un texte de chargement si vous le souhaitez */}
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fond blanc pour correspondre au logo
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Padding for Android status bar
  },
  logo: {
    width: 150, // Ajustez la taille selon votre logo
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  activityIndicator: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SplashScreen;