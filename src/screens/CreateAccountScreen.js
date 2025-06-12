import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CreateAccountScreen = ({ navigation }) => { // <-- Assurez-vous que navigation est bien là
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeNewsletter, setAgreeNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!email || !password || !pseudo || !gender || !birthDate) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Mot de passe invalide',
        'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial.'
      );
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Conditions requises', 'Vous devez accepter les Conditions Générales d\'Utilisation.');
      return;
    }
    const [day, month, year] = birthDate.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (isNaN(parsedDate.getTime()) || birthDate.length !== 10 || birthDate[2] !== '/' || birthDate[5] !== '/') {
      Alert.alert('Date de naissance invalide', 'Veuillez entrer une date au format JJ/MM/AAAA.');
      return;
    }

    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    if (parsedDate > minAgeDate) {
      Alert.alert('Âge minimum', 'Vous devez avoir au moins 15 ans pour créer un compte.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: user.email,
        pseudo: pseudo,
        gender: gender,
        birthDate: firestore.Timestamp.fromDate(parsedDate),
        agreeNewsletter: agreeNewsletter,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setLoading(false);
      // Redirection vers l'écran de confirmation
      Alert.alert('Compte créé', 'Votre compte a été créé avec succès !', [
          { text: 'OK', onPress: () => navigation.replace('ConfirmationScreen') }
      ]);

    } catch (error) {
      setLoading(false);
      let errorMessage = 'Une erreur est survenue lors de la création du compte.';
      console.error('Erreur Firebase :', error.code, error.message);

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse e-mail est déjà utilisée.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'L\'adresse e-mail n\'est pas valide.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'La création de compte par e-mail/mot de passe n\'est pas activée.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible.';
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert('Erreur de création de compte', errorMessage);
    }
  };

  const handleGeneratePseudo = () => {
    const adjectives = ['Grand', 'Petit', 'Rapide', 'Gourmand', 'Magique', 'Créatif'];
    const nouns = ['Chef', 'Cuisinier', 'Gastronome', 'Explorateur', 'Mixeur', 'Maître'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    setPseudo(`<span class="math-inline">\{randomAdj\}</span>{randomNoun}${Math.floor(Math.random() * 99) + 1}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}> {/* <-- Modifier ici */}
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Création de compte</Text>
        </View>

        <Text style={styles.label}>Email obligatoire</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre adresse email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Text style={styles.label}>Mot de passe obligatoire</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe 8 caractères"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} disabled={loading}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.hintText}>8 caractères 1 majuscule 1 carac. spécial 1 chiffre</Text>

        <Text style={styles.label}>Pseudo obligatoire</Text>
        <TextInput
          style={styles.input}
          placeholder="Choisissez un pseudo"
          autoCapitalize="none"
          value={pseudo}
          onChangeText={setPseudo}
          editable={!loading}
        />
        <TouchableOpacity onPress={handleGeneratePseudo} disabled={loading}>
          <Text style={styles.generatePseudoLink}>Générer un pseudo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Genre obligatoire</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'male' && styles.genderOptionSelected]}
            onPress={() => setGender('male')}
            disabled={loading}
          >
            <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Cuisinier ♂</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'female' && styles.genderOptionSelected]}
            onPress={() => setGender('female')}
            disabled={loading}
          >
            <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Cuisinière ♀</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Date de naissance obligatoire</Text>
        <TextInput
          style={styles.input}
          placeholder="JJ/MM/AAAA"
          keyboardType="numeric"
          value={birthDate}
          onChangeText={setBirthDate}
          maxLength={10}
          editable={!loading}
        />
        <Text style={styles.hintText}>Vous devez avoir 15 ans minimum</Text>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} style={styles.checkbox} disabled={loading}>
            {agreeTerms ? <Icon name="check-box" size={24} color="#E53935" /> : <Icon name="check-box-outline-blank" size={24} color="#888" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            J'accepte les Conditions Générales d'Utilisation et reconnais avoir été informé que mes données personnelles seront utilisées tel que décrit ci-dessous et détaillé dans la
            <Text style={styles.linkText}> Politique de protection des données personnelles</Text>*
          </Text>
        </View>
        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => Alert.alert("CGU", "Lien vers les CGU à implémenter")} disabled={loading}>
            <Text style={styles.smallLinkText}>Voir les Conditions Générales d'Utilisation</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => Alert.alert("Politique", "Lien vers la Politique de protection des données à implémenter")} disabled={loading}>
            <Text style={styles.smallLinkText}>Voir la Politique de Protection des Données personnelles</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgreeNewsletter(!agreeNewsletter)} style={styles.checkbox} disabled={loading}>
            {agreeNewsletter ? <Icon name="check-box" size={24} color="#E53935" /> : <Icon name="check-box-outline-blank" size={24} color="#888" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            J'accepte que TchopTime m'envoie des newsletters personnalisées et mesure mes interactions avec celles-ci.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createAccountButtonText}>Créer mon compte</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, backgroundColor: '#FFFFFF', paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  closeButton: { position: 'absolute', left: 0, padding: 5, zIndex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#333', backgroundColor: '#f9f9f9' },
  passwordContainer: { flexDirection: 'row', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', paddingRight: 10, backgroundColor: '#f9f9f9' },
  passwordInput: { flex: 1, padding: 12, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 5 },
  hintText: { fontSize: 12, color: '#888', marginTop: 5, marginBottom: 10 },
  generatePseudoLink: { color: '#E53935', fontSize: 14, marginTop: 5, marginBottom: 10, textDecorationLine: 'underline' },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 },
  genderOption: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#f9f9f9' },
  genderOptionSelected: { borderColor: '#E53935', backgroundColor: '#FCE4EC' },
  genderText: { fontSize: 16, color: '#333' },
  genderTextSelected: { color: '#E53935', fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, marginBottom: 5 },
  checkbox: { paddingRight: 10, paddingTop: 2 },
  checkboxLabel: { flex: 1, fontSize: 13, color: '#333', lineHeight: 20 },
  linkText: { color: '#E53935', textDecorationLine: 'underline' },
  linkRow: { alignSelf: 'flex-start', marginLeft: 34, marginTop: 5 },
  smallLinkText: { color: '#E53935', fontSize: 12, textDecorationLine: 'underline' },
  createAccountButton: { backgroundColor: '#E53935', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  createAccountButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default CreateAccountScreen;