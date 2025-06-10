// src/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  SafeAreaView,         // Import SafeAreaView
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform,             // Import Platform for OS-specific adjustments
  ActivityIndicator,    // Import ActivityIndicator for loading state
} from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Not needed if navigation is passed as prop
import { RootStackNavigationProp } from '../navigation/types'; // Ensure this path is correct

// Import Firebase Authentication (assuming you're using it)
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';
import app from '../config/firebase'; // Ensure this path correctly exports your Firebase app instance

interface SignUpScreenProps {
  navigation: RootStackNavigationProp<'SignUp'>;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = async ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for sign-up process
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  // State for inline error messages
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const auth = getAuth(await app); // Get Firebase Auth instance
  const firestore = getFirestore(await app); // Get Firebase Firestore instance

  const validateInputs = () => {
    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError('Le prénom est requis.');
      isValid = false;
    } else {
      setFirstNameError(null);
    }

    if (!lastName.trim()) {
      setLastNameError('Le nom est requis.');
      isValid = false;
    } else {
      setLastNameError(null);
    }

    if (!email.trim()) {
      setEmailError('L\'adresse e-mail est requise.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Format d\'e-mail invalide.');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Le mot de passe est requis.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Veuillez confirmer votre mot de passe.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas.');
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return; // Stop if validation fails
    }

    setLoading(true); // Start loading
    try {
      // 1. Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user) {
        // 2. Update user profile (display name, etc.)
        await updateProfile(user, {
          displayName: `${firstName.trim()} ${lastName.trim()}`,
        });

        // 3. Store additional user data in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
          // Add any other user-specific data you need
        });

        console.log('User created and profile updated:', user.email);
        Alert.alert('Succès', 'Votre compte a été créé avec succès!', [
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'La création du compte a échoué. Veuillez réessayer.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cette adresse e-mail est déjà utilisée.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'L\'adresse e-mail est invalide.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'L\'inscription par e-mail/mot de passe n\'est pas activée. Veuillez contacter l\'administrateur.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
      }
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Retour">
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Inscription</Text>

        <TextInput
          style={[styles.input, firstNameError && styles.inputError]}
          placeholder="Prénom"
          value={firstName}
          onChangeText={(text) => { setFirstName(text); setFirstNameError(null); }}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => { /* focus lastName input */ }}
          accessibilityLabel="Champ Prénom"
        />
        {firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}

        <TextInput
          style={[styles.input, lastNameError && styles.inputError]}
          placeholder="Nom"
          value={lastName}
          onChangeText={(text) => { setLastName(text); setLastNameError(null); }}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => { /* focus email input */ }}
          accessibilityLabel="Champ Nom"
        />
        {lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}

        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Adresse e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => { setEmail(text); setEmailError(null); }}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => { /* focus password input */ }}
          testID="emailInput"
          clearButtonMode="while-editing"
          accessibilityLabel="Champ Adresse e-mail"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <View style={[styles.input, styles.passwordInputContainer, passwordError && styles.inputError]}>
          <TextInput
            style={styles.passwordTextInput}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); setPasswordError(null); }}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => { /* focus confirmPassword input */ }}
            accessibilityLabel="Champ Mot de passe"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle} accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            <Text style={styles.passwordToggleText}>{showPassword ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        </View>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <View style={[styles.input, styles.passwordInputContainer, confirmPasswordError && styles.inputError]}>
          <TextInput
            style={styles.passwordTextInput}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setConfirmPasswordError(null); }}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            accessibilityLabel="Champ Confirmer le mot de passe"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordToggle} accessibilityLabel={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            <Text style={styles.passwordToggleText}>{showConfirmPassword ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        </View>
        {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading}
          accessibilityLabel="S'inscrire"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.alreadyAccountText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={navigateToLogin} accessibilityLabel="Se connecter">
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 20, // Adjust for Android status bar
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 50, // Adjust position for iOS/Android status bar
    left: 20,
    zIndex: 1, // Ensure button is above other content
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
  },
  title: {
    fontSize: 32, // Larger title
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 20, // Adjust top margin based on back button
    textAlign: 'center',
  },
  input: {
    height: 55, // Taller inputs for better touch target
    backgroundColor: '#fff', // White background for inputs
    borderRadius: 12, // More rounded corners
    paddingHorizontal: 18, // More horizontal padding
    marginBottom: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border
    shadowColor: '#000', // Subtle shadow for input fields
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#FF3B30', // Red border for error state
    borderWidth: 2,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10, // Adjust padding to make space for toggle
  },
  passwordTextInput: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  passwordToggle: {
    padding: 5,
  },
  passwordToggleText: {
    fontSize: 20,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30', // Red for error messages
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: -10, // Pull closer to the input field
  },
  signUpButton: {
    backgroundColor: '#28a745', // Vibrant green for primary action
    borderRadius: 12,
    paddingVertical: 16, // More padding for a larger button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // More space above button
    marginBottom: 20,
    shadowColor: '#000', // Button shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyAccountText: {
    color: '#666',
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    color: '#007AFF', // Standard blue for links
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;