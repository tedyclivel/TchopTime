// src/screens/VoiceRecognition.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Voice from '@react-native-community/voice';
import { RootStackParamList } from '../navigation/types';
import RecipeList from './RecipeList';

type VoiceRecognitionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VoiceRecognition'>;

const VoiceRecognition = () => {
  const navigation = useNavigation<VoiceRecognitionNavigationProp>();
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingVolume, setSpeakingVolume] = useState(0);

  const onSpeechStart = useCallback(() => {
    console.log('Voice.onSpeechStart');
    setIsListening(true);
    setIsRecording(true);
    setRecognizedText('');
    setError(null);
  }, []);

  const onSpeechEnd = useCallback(() => {
    console.log('Voice.onSpeechEnd');
    setIsListening(false);
    setIsRecording(false);
    setSpeakingVolume(0);
  }, []);

  const onSpeechRecognized = useCallback(() => {
    console.log('Voice.onSpeechRecognized');
  }, []);

  const onSpeechResults = useCallback((event: any) => {
    console.log('Voice.onSpeechResults:', event);
    if (event.value && event.value.length > 0) {
      const text = event.value[0];
      setRecognizedText(text);
      processVoiceCommand(text);
    }
  }, []);

  const onSpeechError = useCallback((event: any) => {
    console.error('Voice.onSpeechError:', event.error);
    setIsListening(false);
    setIsRecording(false);
    setSpeakingVolume(0);
    let errorMessage = 'Une erreur de reconnaissance vocale est survenue.';
    if (event.error?.code === '3') {
      errorMessage = 'Problème de microphone ou d\'audio. Veuillez vérifier vos réglages.';
    } else if (event.error?.code === '5') {
      errorMessage = 'Problème interne de l\'application ou du service de reconnaissance.';
    } else if (event.error?.code === '7') {
      errorMessage = 'Aucune voix claire détectée ou commande non reconnue.';
    } else if (event.error?.code === '8') {
      errorMessage = 'Le service de reconnaissance est occupé. Veuillez réessayer.';
    }
    setError(errorMessage);
  }, []);

  const onSpeechVolumeChanged = useCallback((event: any) => {
    setSpeakingVolume(event.value);
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    const requestMicrophonePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Permission Microphone',
              message: 'FoodMart a besoin d’accéder à votre microphone pour la reconnaissance vocale.',
              buttonNeutral: 'Plus tard',
              buttonNegative: 'Refuser',
              buttonPositive: 'Autoriser',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission refusée',
              'La reconnaissance vocale ne fonctionnera pas sans la permission du microphone.'
            );
            setError('Permission du microphone refusée.');
          }
        } catch (err: any) {
          console.warn(err);
          setError(`Erreur lors de la demande de permission: ${err.message}`);
        }
      }
    };
    requestMicrophonePermission();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechStart, onSpeechEnd, onSpeechRecognized, onSpeechResults, onSpeechError, onSpeechVolumeChanged]);

  const startRecording = async () => {
    setRecognizedText('');
    setError(null);
    try {
      await Voice.start('fr-FR');
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting voice recognition:', err);
      setError(`Impossible de démarrer la reconnaissance: ${err.message}`);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (err: any) {
      console.error('Error stopping voice recognition:', err);
      setError(`Impossible d'arrêter la reconnaissance: ${err.message}`);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('aller à la liste de courses') || lowerCommand.includes('liste de courses')) {
      Alert.alert('Navigation', `Commande reconnue: "${command}"\nNavigation vers la Liste de Courses.`);
      // --- Ligne rectifiée ici ---
      navigation.navigate({ name: 'ShoppingList', params: undefined });
      // --------------------------
    } else if (lowerCommand.includes('chercher une recette') || lowerCommand.includes('trouver une recette')) {
      Alert.alert('Navigation', `Commande reconnue: "${command}"\nNavigation vers la liste des Recettes.`);
      // --- Ligne rectifiée ici ---
      navigation.navigate({ name: 'RecipeList', params: undefined });
      // --------------------------
    } else if (lowerCommand.includes('montre-moi les marchés') || lowerCommand.includes('voir les magasins') || lowerCommand.includes('aller aux marchés')) {
      Alert.alert('Navigation', `Commande reconnue: "${command}"\nNavigation vers la liste des Marchés.`);
      // --- Ligne rectifiée ici ---
      navigation.navigate({ name: 'MarketList', params: undefined });
      // --------------------------
    } else if (lowerCommand.includes('ouvrir les préférences') || lowerCommand.includes('aller aux préférences')) {
      Alert.alert('Navigation', `Commande reconnue: "${command}"\nNavigation vers les Préférences.`);
      // --- Ligne rectifiée ici ---
      navigation.navigate({ name: 'Preferences', params: undefined });
      // --------------------------
    } else if (lowerCommand.includes('se déconnecter') || lowerCommand.includes('déconnexion')) {
      Alert.alert('Navigation', `Commande reconnue: "${command}"\nTentative de déconnexion...`);
      // Si tu as un écran de login ou de déconnexion spécifique où tu veux naviguer
      // navigation.navigate({ name: 'Login' }); // Exemple
    } else {
      Alert.alert('Commande non reconnue', `"${command}" n'est pas une commande valide. Veuillez réessayer.`);
    }
  };

  const getButtonText = () => {
    if (isRecording) {
      return 'Arrêter l\'écoute';
    } else if (isListening) {
      return 'En attente de la fin de la parole...';
    } else {
      return 'Commencer à parler';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <Text style={styles.title}>Reconnaissance Vocale</Text>
        <Text style={styles.subtitle}>Appuyez sur le bouton et dites votre commande.</Text>

        <TouchableOpacity
          style={[
            styles.recordButton,
            isListening && styles.listeningButton,
            isRecording && styles.recordingButton,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isListening && !isRecording}
          accessibilityLabel={isRecording ? "Arrêter l'enregistrement vocal" : "Démarrer l'enregistrement vocal"}
        >
          {isListening && <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />}
          <Text style={styles.recordButtonText}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>

        {isListening && speakingVolume > 0 && (
          <View style={styles.volumeIndicatorContainer}>
            <View style={[styles.volumeBar, { width: `${(speakingVolume / 10) * 100}%` }]} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
            <TouchableOpacity onPress={() => setError(null)} style={styles.clearErrorButton}>
              <Text style={styles.clearErrorButtonText}>Effacer l'erreur</Text>
            </TouchableOpacity>
          </View>
        )}

        {recognizedText ? (
          <View style={styles.recognizedTextContainer}>
            <Text style={styles.recognizedTextTitle}>Commande reconnue :</Text>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </View>
        ) : (
          !isListening && !error && (
            <Text style={styles.instructionsText}>
              Exemples de commandes: {'\n'}
              - "Aller à la liste de courses" {'\n'}
              - "Chercher une recette" {'\n'}
              - "Montre-moi les marchés" {'\n'}
              - "Ouvrir les préférences"
            </Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  listeningButton: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
  },
  activityIndicator: {
    marginRight: 10,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  volumeIndicatorContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  volumeBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  errorContainer: {
    backgroundColor: '#ffe0e0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  clearErrorButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  clearErrorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recognizedTextContainer: {
    width: '90%',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recognizedTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  recognizedText: {
    fontSize: 17,
    color: '#424242',
    lineHeight: 25,
  },
  instructionsText: {
    fontSize: 15,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});

export default VoiceRecognition;