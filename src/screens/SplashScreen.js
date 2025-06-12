import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulez un temps de chargement
    setTimeout(() => {
      // Naviguez vers l'écran d'onboarding après le splash
      navigation.replace('OnboardingStack'); // Navigue vers le Root Navigator Onboarding
    }, 2000); // 2 secondes
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo_full.png')} // Votre logo complet pour le splash
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#E53935" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%', // Ajustez la taille
    height: 150,
    marginBottom: 50,
  },
  spinner: {
    marginTop: 20,
  },
});

export default SplashScreen;