import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useOfflineSync } from '../contexts/OfflineSyncContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OfflineModeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OfflineMode'>;

const OfflineModeScreen = () => {
  const navigation = useNavigation<OfflineModeScreenNavigationProp>();
  const { isOnline, pendingChanges, syncWithServer, loading } = useOfflineSync();

  const handleSync = async () => {
    await syncWithServer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isOnline ? 'Connecté' : 'Hors ligne'}
        </Text>
        <Text style={styles.statusDetail}>
          {isOnline 
            ? 'Vous êtes connecté à Internet' 
            : 'Vous êtes hors ligne'}
        </Text>
      </View>

      {pendingChanges.length > 0 && (
        <View style={styles.pendingChangesContainer}>
          <Text style={styles.pendingChangesText}>
            {pendingChanges.length} modification(s) en attente
          </Text>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSync}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.syncButtonText}>Synchroniser maintenant</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Fonctionnalités disponibles hors ligne</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Consultation des recettes sauvegardées</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Création de listes de courses</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Planification des repas</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Gestion des préférences</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statusDetail: {
    fontSize: 16,
    color: '#666',
  },
  pendingChangesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  pendingChangesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featuresList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
  },
  featureItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OfflineModeScreen;
