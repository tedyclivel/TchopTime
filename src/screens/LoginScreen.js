import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// Importez Icon si vous l'utilisez pour un bouton de retour par exemple
// import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => { // <-- Assurez-vous que navigation est bien là
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de Connexion</Text>
      <Text>Formulaire de connexion ici...</Text>
      <Button title="Créer un compte" onPress={() => navigation.navigate('CreateAccount')} />
      <Button title="Retour Onboarding" onPress={() => navigation.goBack()} /> {/* Pour faciliter le test */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LoginScreen;