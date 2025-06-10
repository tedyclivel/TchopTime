import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Ingredient, MarketPrice } from '../types';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

const IngredientPriceCompare = () => {
  const navigation = useNavigation<RootStackParamList>();
  const [searchText, setSearchText] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  interface SelectedIngredient {
    ingredient: Ingredient;
    prices: MarketPrice[];
  }

  const [selectedIngredient, setSelectedIngredient] = useState<SelectedIngredient | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'ingredients'));
      const ingredientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIngredients(ingredientsData as Ingredient[]);
    } catch (error) {
      console.error('Error loading ingredients:', error);
    }
  };

  const searchIngredients = (text: string) => {
    setSearchText(text);
    const filteredIngredients = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(text.toLowerCase())
    );
    setIngredients(filteredIngredients);
  };

  const loadMarketPrices = async (ingredientId: string) => {
    try {
      const q = query(
        collection(firestore, 'marketPrices'),
        where('ingredientId', '==', ingredientId)
      );
      const querySnapshot = await getDocs(q);
      const prices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      if (prices.length > 0) {
        // Récupérer l'ingrédient correspondant
        const ingredient = ingredients.find(i => i.id === ingredientId);
        if (ingredient) {
          setSelectedIngredient({
            ingredient,
            prices: prices as MarketPrice[],
          });
        }
      }
    } catch (error) {
      console.error('Error loading market prices:', error);
    }
  };

  const renderItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.ingredientItem}
      onPress={() => loadMarketPrices(item.id)}
    >
      <Text style={styles.ingredientName}>{item.name}</Text>
      <Text style={styles.ingredientUnit}>{item.unit}</Text>
    </TouchableOpacity>
  );

  const renderPriceItem = ({ item }: { item: MarketPrice }) => (
    <View style={styles.priceItem}>
      <Text style={styles.marketName}>{item.marketName}</Text>
      <Text style={styles.price}>{item.price}€</Text>
      <Text style={styles.lastUpdated}>
        Dernière mise à jour: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un ingrédient..."
          value={searchText}
          onChangeText={searchIngredients}
        />
      </View>

      <ScrollView style={styles.content}>
        <FlatList
          data={ingredients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.ingredientList}
        />

        {selectedIngredient && (
          <View style={styles.priceComparison}>
            <Text style={styles.comparisonTitle}>Comparaison des prix</Text>
            <Text style={styles.ingredientTitle}>{selectedIngredient.name}</Text>
          <FlatList
            data={selectedIngredient.prices}
            renderItem={renderPriceItem}
            keyExtractor={(item) => item.id}
            style={styles.priceList}
          />
        </View>
      )}  
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  ingredientList: {
    paddingBottom: 16,
  },
  ingredientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientUnit: {
    fontSize: 14,
    color: '#666',
  },
  priceComparison: {
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ingredientTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceList: {
    marginTop: 8,
  },
  priceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  marketName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default IngredientPriceCompare;
