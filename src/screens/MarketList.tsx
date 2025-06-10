// src/screens/MarketList.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // <-- Ajout de cette import
import { RootStackParamList, Market, FoodItem } from '../navigation/types';

// Définition du type de navigation pour cet écran spécifique
// C'est la ligne clé qui manquait !
type MarketListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MarketList'>;


// Données de démonstration (à remplacer par une source de données réelle, ex: Firestore)
const DUMMY_MARKETS: Market[] = [
  {
    id: 'market1',
    name: 'Marché Central',
    image: require('../../assets/marche.jpeg'), // Assurez-vous que l'image existe
    distance: 2.5,
    rating: 4.5,
    description: 'Le plus grand marché de la ville, proposant une large gamme de produits frais locaux et importés.',
    products: [
      {
        id: 'food1', title: 'Bananes Plantain', image: require('../../assets/chicken.jpeg'), description: 'Des bananes plantains fraîches, parfaites pour les frites ou le ndolé.', prepTime: 10 , calories: 120, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
      {
        id: 'food2', title: 'Manioc Frais', image: require('../../assets/chicken.jpeg'), description: 'Racines de manioc de première qualité, idéales pour le couscous de manioc ou le bâton de manioc.', prepTime: 15 , calories: 160, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
      {
        id: 'food3', title: 'Piment Rouge', image: require('../../assets/chicken.jpeg'), description: 'Piments frais et piquants pour relever tous vos plats.', prepTime: 5 , calories: 30, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
      // ... plus de produits
    ],
    latitude: 0,
    longitude: 0,
    address: ''
  },
  {
    id: 'market2',
    name: 'Marché Mfoundi',
    image: require('../../assets/marche.jpeg'), // Assurez-vous que l'image existe
    distance: 1.8,
    rating: 4.2,
    description: 'Connu pour ses produits locaux et son ambiance animée.',
    products: [
      {
        id: 'food4', title: 'Taro', image: require('../../assets/chicken.jpeg'), description: 'Taro frais, idéal pour le Eru ou le ndolé.', prepTime: 20 , calories: 150, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
      {
        id: 'food5', title: 'Gombo', image: require('../../assets/chicken.jpeg'), description: 'Gombos verts, parfaits pour les soupes ou les sauces gluantes.', prepTime: 10 , calories: 20, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
    ],
    latitude: 0,
    longitude: 0,
    address: ''
  },
  {
    id: 'market3',
    name: 'Supermarché Santa Lucia',
    image: require('../../assets/marche.jpeg'), // Assurez-vous que l'image existe
    distance: 5.1,
    rating: 3.9,
    description: 'Un supermarché moderne avec une sélection de produits locaux et importés.',
    products: [
      {
        id: 'food6', title: 'Riz Basmati', image: require('../../assets/chicken.jpeg'), description: 'Riz Basmati de qualité supérieure, idéal pour les accompagnements.', prepTime: 25, calories: 350, markets: [], similarItems: [],
        ingredients: [],
        instructions: [],
        difficulty: 0,
        popularity: 0
      },
    ],
    latitude: 0,
    longitude: 0,
    address: ''
  },
  // Ajoutez d'autres marchés de démonstration si nécessaire
];

// Largeur de l'écran pour le responsive design
const { width } = Dimensions.get('window');


const MarketList: React.FC = () => {
  const navigation = useNavigation<MarketListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async (): Promise<Market[]> => {
      setLoading(true);
      return new Promise<Market[]>(resolve => {
        setTimeout(() => {
          const toFullFoodItem = (baseProductData: any, currentMarketData: any, allDummyProducts: any[]): FoodItem => {
            const fullProduct: FoodItem = {
              id: baseProductData.id,
              title: baseProductData.title || 'Unknown Title',
              image: baseProductData.image || { uri: 'default_food.png' },
              description: baseProductData.description || 'No description available.',
              prepTime: baseProductData.prepTime || 'N/A',
              calories: baseProductData.calories || 'N/A',
              category: baseProductData.category || 'General',
              ingredients: baseProductData.ingredients || [],
              instructions: baseProductData.instructions || [],
              price: baseProductData.price || 0,
              markets: [
                {
                  id: currentMarketData.id,
                  name: currentMarketData.name,
                  image: currentMarketData.image,
                  distance: currentMarketData.distance,
                  rating: currentMarketData.rating,
                  latitude: currentMarketData.latitude || 0,
                  longitude: currentMarketData.longitude || 0,
                  address: currentMarketData.address || 'N/A',
                  products: [], // Avoid recursion; or provide only IDs/summary
                  description: currentMarketData.description || 'N/A',
                },
              ],
              similarItems: allDummyProducts
                .filter(p => p.id !== baseProductData.id)
                .slice(0, 3)
                .map(p_sim => toFullFoodItem(p_sim, {}, [])),
              difficulty: 0,
              popularity: 0
            };
            return fullProduct;
          };

          const allDummyProducts = DUMMY_MARKETS.flatMap(m => m.products);

          const updatedMarkets: Market[] = DUMMY_MARKETS.map(marketData => {
            const marketProducts: FoodItem[] = marketData.products.map(baseProduct =>
              toFullFoodItem(baseProduct, marketData, allDummyProducts)
            );

            return {
              ...marketData,
              products: marketProducts,
            };
          });
          resolve(updatedMarkets);
        }, 1000);
      });
    };

    fetchMarkets().then(data => {
      setMarkets(data);
      setLoading(false);
    });
  }, []);

  const filteredMarkets = markets.filter(market =>
    market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.products.some((product: { title: string; }) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleMarketPress = (market: Market) => {
    navigation.navigate('MarketDetail', { market });
  };

  const handleFoodItemPress = (foodItem: FoodItem) => {
    navigation.navigate('RecipeDetail', { foodItem });
  };

  const renderMarketItem = ({ item }: { item: Market }) => (
    <TouchableOpacity
      style={styles.marketCard}
      onPress={() => handleMarketPress(item)}
      accessibilityLabel={`Voir les détails du marché ${item.name}`}
    >
      <Image source={item.image} style={styles.marketImage} resizeMode="cover" />
      <View style={styles.marketInfo}>
        <Text style={styles.marketName}>{item.name}</Text>
        <Text style={styles.marketDetails}>
          Distance: {item.distance?.toFixed(1)} km | Note: {item.rating.toFixed(1)}/5
        </Text>
        <Text style={styles.marketDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.productsHeader}>Produits disponibles :</Text>
        <FlatList
          horizontal
          data={item.products.slice(0, 3)}
          keyExtractor={(product) => product.id}
          renderItem={({ item: product }) => (
            <TouchableOpacity
              style={styles.productPill}
              onPress={() => handleFoodItemPress(product)}
              accessibilityLabel={`Voir le produit ${product.title}`}
            >
              <Text style={styles.productPillText}>{product.title}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Marchés et Produits</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un marché ou un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          accessibilityLabel="Champ de recherche"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
        ) : filteredMarkets.length === 0 ? (
          <Text style={styles.noResultsText}>Aucun marché ou produit trouvé pour votre recherche.</Text>
        ) : (
          <FlatList
            data={filteredMarkets}
            renderItem={renderMarketItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 30,
  },
  marketCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  marketImage: {
    width: '100%',
    height: width * 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  marketInfo: {
    padding: 15,
  },
  marketName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  marketDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  marketDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    lineHeight: 20,
  },
  productsHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 5,
  },
  productsList: {
    flexDirection: 'row',
  },
  productPill: {
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  productPillText: {
    color: '#00796b',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MarketList;