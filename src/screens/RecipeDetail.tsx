// src/screens/RecipeDetail.tsx (ou FoodDetails.tsx)

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
  Platform,        // Import Platform for OS-specific adjustments
  ImageSourcePropType, // Import for explicit image source typing
} from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, FoodItem, Market } from '../navigation/types'; // Importez Market ici !
import { FlatList } from 'react-native';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailNavigationProp = NavigationProp<RootStackParamList, 'RecipeDetail'>;

const { width } = Dimensions.get('window');

const RecipeDetail = () => {
  const navigation = useNavigation<RecipeDetailNavigationProp>();
  const route = useRoute<RecipeDetailRouteProp>();
  const { foodItem } = route.params;

  // Function to navigate to a similar item
  const handleSimilarItemPress = (item: FoodItem) => {
    navigation.navigate('RecipeDetail', { foodItem: item });
  };

  // Render similar items
  const renderSimilarItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.similarItemCard}
      onPress={() => handleSimilarItemPress(item)}
      accessibilityLabel={`Voir les détails pour ${item.title}`}
    >
      <Image source={item.image as ImageSourcePropType} style={styles.similarItemImage} resizeMode="cover" />
      <View style={styles.similarItemTextContent}>
        <Text style={styles.similarItemTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour et cœur */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} accessibilityLabel="Retour">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Ajouter aux favoris">
          <Text style={styles.headerIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Main Image */}
        <Image
          source={foodItem.image as ImageSourcePropType}
          style={styles.mainImage}
          resizeMode="cover"
          accessibilityLabel={foodItem.title}
        />

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Titre et description */}
          <Text style={styles.title}>{foodItem.title}</Text>
          <Text style={styles.description}>{foodItem.description}</Text>

          {/* Informations supplémentaires */}
          <Text style={styles.infoText}>Temps de préparation : <Text style={styles.boldText}>{foodItem.prepTime}</Text></Text>
          <Text style={styles.infoText}>Calories : <Text style={styles.boldText}>{foodItem.calories}</Text></Text>

          {/* Section Marchés disponibles */}
          {foodItem.markets && foodItem.markets.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Marchés disponibles</Text>
              {foodItem.markets.map((market: Market) => (
                <View
                  key={market.id} // Add key for FlatList/map children
                  style={styles.marketCard}
                >
                  <Image source={market.image as ImageSourcePropType} style={styles.marketImage} resizeMode="cover" />
                  <View style={styles.marketInfo}>
                    <Text style={styles.marketName}>{market.name}</Text>
                    {market.distance && <Text style={styles.marketDetail}>Distance : {market.distance} km</Text>}
                    {market.rating !== undefined && ( // Only display if rating exists
                      <Text style={styles.marketDetail}>Note : {market.rating.toFixed(1)}/5</Text>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Section Similar Items */}
          {foodItem.similarItems && foodItem.similarItems.length > 0 && (
            <>
              <Text style={styles.similarItemsHeader}>Articles similaires</Text>
              <FlatList
                horizontal
                data={foodItem.similarItems}
                renderItem={renderSimilarItem}
                keyExtractor={(item: FoodItem) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarItemsList}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* "Add to Order" Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.addToOrderButton} accessibilityLabel="Ajouter cet article à la commande">
          <Text style={styles.addToOrderButtonText}>Ajouter à la commande</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'android' ? 50 : 0, // Adjust for Android status bar (header height approx)
    paddingBottom: 100, // Space for the bottom button
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
    color: '#333',
    fontWeight: 'bold',
  },
  mainImage: {
    width: '100%',
    height: width * 0.8,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentArea: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25, // Slightly increased padding
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 30, // Slightly larger title
    fontWeight: 'bold',
    color: '#2c3e50', // Darker color for prominence
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8, // Increased spacing
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2c3e50', // Match title color for boldness
  },
  sectionHeader: {
    fontSize: 22, // Slightly larger section header
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 25, // Increased spacing
    marginBottom: 15,
  },
  marketCard: {
    flexDirection: 'row',
    backgroundColor: '#fff', // White background for market cards
    borderRadius: 15, // More rounded corners
    padding: 15,
    marginBottom: 12, // Increased spacing
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketImage: {
    width: 70, // Slightly smaller image
    height: 70,
    borderRadius: 10, // Slightly more rounded image
    marginRight: 15,
  },
  marketInfo: {
    flex: 1,
  },
  marketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 2,
  },
  marketDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  similarItemsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 25,
    marginBottom: 15,
    paddingLeft: 0, // Ensure no extra padding if any
  },
  similarItemsList: {
    paddingHorizontal: 20, // Add horizontal padding for list items
    paddingRight: 10,
  },
  similarItemCard: {
    width: width * 0.45, // Make cards slightly wider
    marginRight: 15,
    backgroundColor: '#fff', // White background
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 10, // Ensure consistent spacing if wrapping
  },
  similarItemImage: {
    width: '100%',
    height: width * 0.35, // Adjust height
  },
  similarItemTextContent: {
    padding: 10,
  },
  similarItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minHeight: 40, // Ensure consistent height for titles across cards
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // Adjust padding for iOS bottom safe area
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15, // Slightly stronger shadow
    shadowRadius: 8,
    elevation: 8,
  },
  addToOrderButton: {
    backgroundColor: '#28a745', // A vibrant green for action button
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetail;