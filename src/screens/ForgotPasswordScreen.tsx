import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';

interface ForgotPasswordScreenProps {
  navigation: RootStackNavigationProp<'ForgotPassword'>;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // TODO: Implémenter la logique de réinitialisation du mot de passe
    console.log('Réinitialisation du mot de passe pour:', email);
    // Après l'envoi du lien de réinitialisation, on pourrait afficher un message de succès
    navigation.navigate('Login');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.description}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.loginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#EDE7E7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#C64357',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#C64357',
    fontSize: 16,
  },
});
