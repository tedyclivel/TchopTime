import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OnboardingScreen3 = ({ navigation }) => {
  const handleCreateAccountPress = () => {
    navigation.navigate('Auth'); // Navigue vers le Stack d'authentification
  };

  const handleLoginPress = () => {
    navigation.navigate('Auth', { screen: 'Login' }); // Navigue vers l'écran Login dans AuthStack
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Rejoignez la communauté</Text>
      <Image
        source={require('../assets/onboarding_community.png')} // Image spécifique à cette étape
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={styles.description}>
        Créez votre <Text style={styles.highlightText}>carnet de recette</Text> pour conserver vos recettes favorites et ajouter votre grain de sel sur TchopTime
      </Text>

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
        <View style={[styles.paginationDot, styles.paginationDotActive]} />
      </View>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleCreateAccountPress}
      >
        <Text style={styles.createAccountButtonText}>Créer un compte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLoginPress}
      >
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.prevButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#E53935" />
        <Text style={styles.buttonText}>Précédent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 20,
  },
  illustration: {
    width: '80%',
    height: 200,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    lineHeight: 24,
    marginBottom: 40,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#E53935',
  },
  createAccountButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FFECB3', // Couleur plus claire
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#E53935', // Couleur du texte assortie
    fontSize: 18,
    fontWeight: 'bold',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#E53935',
    marginHorizontal: 5,
  },
});

export default OnboardingScreen3;