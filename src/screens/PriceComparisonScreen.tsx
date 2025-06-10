import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { usePriceComparison } from '../contexts/PriceComparisonContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PriceComparisonScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PriceComparison'>;

const PriceComparisonScreen = () => {
  const navigation = useNavigation<PriceComparisonScreenNavigationProp>();
  const { prices, getPrices, loading } = usePriceComparison();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      setIngredients(prev => [...prev, searchInput.trim()]);
      setSearchInput('');
    }
  };

  const handleComparePrices = () => {
    getPrices(ingredients);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un ingrédient"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSearch}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <Text style={styles.ingredientName}>{ingredient}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setIngredients(prev => prev.filter((_, i) => i !== index))}
          >
            <Text style={styles.removeButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.compareButton}
        onPress={handleComparePrices}
        disabled={ingredients.length === 0}
      >
        <Text style={styles.compareButtonText}>Comparer les prix</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#007AFF" />
      ) : (
        Object.entries(prices).map(([ingredient, priceInfo]) => (
          <View key={ingredient} style={styles.priceItem}>
            <Text style={styles.priceTitle}>{ingredient}</Text>
            <View style={styles.priceDetails}>
              <Text style={styles.priceText}>{formatPrice(priceInfo.price)}</Text>
              <Text style={styles.storeText}>chez {priceInfo.store}</Text>
              <Text style={styles.distanceText}>
                {priceInfo.distance.toFixed(1)} km de vous
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  ingredientName: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'red',
  },
  compareButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  compareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  priceItem: {
    marginBottom: 20,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceDetails: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  storeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
});

export default PriceComparisonScreen;
