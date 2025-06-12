import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir cet import

const ConfirmationScreen = ({ navigation }) => {
  const handleEnrichProfile = () => {
    navigation.replace('AppTabs', { screen: 'Profil' }); // Navigue vers l'onglet Profil
  };

  const handleClose = () => {
    navigation.replace('AppTabs'); // Navigue vers l'onglet Accueil par défaut
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Compte créé</Text>
        <Text style={styles.modalMessage}>
          Un email de confirmation a été envoyé sur votre adresse email
        </Text>
        <Image
          source={require('../assets/cooking_illustration.png')} // Une illustration de cuisine
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.profilePrompt}>
          Pour avoir des recettes personnalisées et adaptées à votre style
        </Text>

        <TouchableOpacity
          style={styles.enrichProfileButton}
          onPress={handleEnrichProfile}
        >
          <Text style={styles.enrichProfileButtonText}>Enrichir mon profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E53935',
    marginBottom: 20,
  },
  illustration: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  profilePrompt: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  enrichProfileButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  enrichProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;