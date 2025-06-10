// src/screens/MarketDetail.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform, // For platform specific styling
} from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Market, FoodItem } from '../navigation/types'; // Assurez-vous que Market et FoodItem sont importés

type MarketDetailRouteProp = RouteProp<RootStackParamList, 'MarketDetail'>;
type MarketDetailNavigationProp = NavigationProp<RootStackParamList, 'MarketDetail'>;

const { width } = Dimensions.get('window');

const MarketDetail = () => {
  const navigation = useNavigation<MarketDetailNavigationProp>();
  const route = useRoute<MarketDetailRouteProp>();
  const { market } = route.params;

  const handleFoodItemPress = (foodItem: FoodItem) => {
    navigation.navigate('RecipeDetail', { foodItem });
  };

  const renderProductItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleFoodItemPress(item)}
      accessibilityLabel={`Voir les détails de ${item.title}`}
    >
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrepTime}>Préparation: {item.prepTime}</Text>
        <Text style={styles.productCalories}>Calories: {item.calories}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour et icône de cœur (optionnel) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} accessibilityLabel="Retour">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Ajouter aux favoris du marché">
          <Text style={styles.headerIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Image principale du marché */}
        <Image
          source={market.image}
          style={styles.marketImage}
          resizeMode="cover"
          accessibilityLabel={`Image du marché ${market.name}`}
        />

        {/* Zone de contenu */}
        <View style={styles.contentArea}>
          <Text style={styles.marketName}>{market.name}</Text>
          <Text style={styles.marketDescription}>{market.description}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Distance: <Text style={styles.boldText}>{market.distance?.toFixed(1)} km</Text></Text>
            <Text style={styles.infoText}>Note: <Text style={styles.boldText}>{market.rating.toFixed(1)}/5</Text></Text>
          </View>

          {market.products && market.products.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Produits disponibles</Text>
              <FlatList
                data={market.products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Afficher en 2 colonnes
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.productsList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
          {!market.products || market.products.length === 0 && (
            <Text style={styles.noProductsText}>Aucun produit listé pour ce marché pour le moment.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 10 : 15, // Adjust vertical padding for Android
    position: 'absolute',
    top: Platform.OS === 'android' ? 25 : 0, // Position correctly below status bar on Android
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.7)', // Slightly transparent background for icons
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  headerIcon: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  marketImage: {
    width: '100%',
    height: width * 0.8, // Image takes 80% of screen width
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentArea: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25, // Increased padding
    marginTop: -20, // Overlap with the image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  marketName: {
    fontSize: 30, // Larger title
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  marketDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 22, // Larger section header
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  productsList: {
    // No horizontal padding needed here if numColumns is used and columnWrapperStyle handles spacing
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10, // Space between rows
  },
  productCard: {
    width: (width - 60) / 2, // 25 (padding left) + 25 (padding right) + 10 (gap) = 60
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10, // Ensure consistent spacing in columns
  },
  productImage: {
    width: '100%',
    height: width * 0.35, // Responsive image height
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    minHeight: 40, // Ensure consistent height for titles across cards
  },
  productPrepTime: {
    fontSize: 13,
    color: '#777',
  },
  productCalories: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default MarketDetail;