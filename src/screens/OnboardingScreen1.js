import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // CORRECTED PATH HERE: changed from '../../assets/logo.png'
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Le plein d'idées</Text>
      <Image
        source={require('../assets/onboarding_ideas.png')} // Also correct this path if OnboardingScreen1 is in src/screens/
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={styles.description}>
        Trouvez votre bonheur avec <Text style={styles.highlightText}>plus de +76000</Text> recettes pour toutes vos envies (et celles de votre frigo)
      </Text>

      <View style={styles.paginationContainer}>
        <View style={[styles.paginationDot, styles.paginationDotActive]} />
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Onboarding2')}
      >
        <Text style={styles.buttonText}>Suivant</Text>
        <Icon name="arrow-forward" size={24} color="#E53935" />
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
    width: 120, // Ajustez la taille si nécessaire
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
    width: '80%', // Ajustez la taille selon l'image
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
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#E53935',
    marginRight: 5,
  },
});

export default OnboardingScreen1;