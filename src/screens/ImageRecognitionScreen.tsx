import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useImageRecognition } from '../contexts/ImageRecognitionContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ImageRecognitionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ImageRecognition'>;

const ImageRecognitionScreen = () => {
  const navigation = useNavigation<ImageRecognitionScreenNavigationProp>();
  const { recognizedIngredients, recognizeImage, loading, error } = useImageRecognition();

  const handleScan = async () => {
    await recognizeImage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reconnaissance d'ingrédients</Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScan}
        disabled={loading}
      >
        <Text style={styles.scanButtonText}>{loading ? 'En cours...' : 'Scanner un ingrédient'}</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {recognizedIngredients.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Ingrédients reconnus :</Text>
          {recognizedIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>{ingredient}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ingredientItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
  },
});

export default ImageRecognitionScreen;
