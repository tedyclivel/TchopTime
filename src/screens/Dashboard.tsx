// src/screens/Dashboard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';
// Ensure all necessary types are imported from your types.ts file
import { RootStackParamList, FoodItem, Market } from '../navigation/types';
import { User } from '../contexts/AuthContext';

// Fonction pour ajouter une commande
const addCommande = async (foodItem: FoodItem, user: User | null) => {
  try {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter une commande.');
      console.error('Utilisateur non connecté');
      return;
    }

    const commande = {
      userId: user.uid, // Using user.uid as the Firebase User ID
      foodItem: foodItem,
      date: new Date().toISOString(),
      status: 'en_attente',
      createdAt: new Date(),
    };

    await addDoc(collection(firestore, 'commandes'), commande);
    Alert.alert('Succès', `"${foodItem.title}" a été ajouté à vos commandes !`);
    console.log('Commande ajoutée avec succès');
  } catch (error) {
    Alert.alert('Erreur', 'Impossible d\'ajouter la commande. Veuillez réessayer.');
    console.error('Erreur lors de l\'ajout de la commande:', error);
  }
};

// Fonction utilitaire pour générer les URLs d'images en ligne
const getImageUrl = (title: string, width = 300, height = 200): string => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '+');
  return `https://via.placeholder.com/${width}x${height}/FFD700/000000?text=${cleanTitle}`;
};

// Fonction utilitaire pour les images des marchés
const getMarketImageUrl = (name: string, width = 300, height = 200): string => {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '+');
  return `https://via.placeholder.com/${width}x${height}/4CAF50/000000?text=${cleanName}`;
};

// Define the type for the Dashboard's navigation prop
// This is critical for TypeScript to understand what routes 'navigation' can navigate to.
type DashboardScreenNavigationProp = NavigationProp<RootStackParamList, 'Dashboard'>;

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2; // Calculation for two columns with padding

const Dashboard = () => {
  // Explicitly type the useNavigation hook using the defined DashboardScreenNavigationProp.
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user } = useAuth(); // Get the authenticated user from AuthContext

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories: string[] = ['All', 'Vegetarian', 'Gluten-Free', 'Vegan'];

  // Data for the recipes - All FoodItem properties are present and consistent with types.ts
  const recipes: FoodItem[] = [
    {
      id: '1',
      title: 'Spicy Chicken Wings',
      difficulty: 2,
      popularity: 4.3,
      image: require('../../assets/poulet.jpg'),
      description: 'Crispy, juicy chicken wings tossed in a fiery blend of spices and a tangy, zesty sauce. Perfect for a quick bite or an appetizer.',
      category: 'lunch',
      price: 8.99,
      prepTime: 30,
      ingredients: ['Chicken wings', 'Spices', 'Sauce'],
      instructions: ['Prepare the wings', 'Cook them', 'Add sauce'], // Corrected to string[]
      calories: 650,
      markets: [
        {
          id: 'm1', name: 'Super Marché Central', image: require('../../assets/marche.jpeg'), distance: 1.5, rating: 4.2,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm2', name: 'Marché du Quartier', image: require('../../assets/marche.jpeg'), distance: 0.8, rating: 3.9,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim1',
          difficulty: 2,
          popularity: 4.2,
          title: 'Crispy Chicken Sandwich',
          image: require('../../assets/Berker.jpg'),
          description: 'A classic crispy fried chicken sandwich with fresh lettuce and mayo on a toasted bun.',
          prepTime: 15,
          calories: 700,
          markets: [],
          category: 'lunch',
          ingredients: ['Chicken', 'Lettuce', 'Mayo'],
          instructions: ['Prepare chicken', 'Toast bun', 'Assemble sandwich'],
          price: 9.50,
          similarItems: [],
          
        },
        {
          id: 'sim2',
          title: 'Grilled Chicken Wrap',
          image: require('../../assets/pile.jpeg'),
          description: 'Healthy grilled chicken with fresh vegetables wrapped in a soft tortilla.',
          prepTime: 10,
          calories: 350,
          markets: [],
          category: 'lunch',
          ingredients: ['Chicken', 'Vegetables', 'Tortilla'],
          instructions: ['Grill chicken', 'Prepare vegetables', 'Wrap in tortilla'],
          price: 7.00,
          similarItems: [],
          difficulty: 0,
          popularity: 0
        },
        {
          id: 'sim3',
          title: 'Chicken Caesar Salad',
          image: require('../../assets/téléchargement.jpeg'),
          description: 'Fresh romaine lettuce, grilled chicken, croutons, and Caesar dressing.',
          prepTime: 15,
          calories: 420,
          markets: [],
          category: 'lunch',
          ingredients: ['Romaine lettuce', 'Grilled chicken', 'Croutons', 'Caesar dressing'],
          instructions: ['Prepare ingredients', 'Mix all'],
          price: 8.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.3,
        },
      ],

    },
    {
      id: '2',
      title: 'Grilled Salmon',
      difficulty: 3,
      popularity: 4.7,
      image: getImageUrl('Grilled Salmon'),
      description: 'Perfectly grilled salmon fillet, flaky and tender, seasoned with herbs and lemon. A healthy and delicious main course.',
      category: 'dinner',
      price: 18.00,
      prepTime: 20,
      calories: 400,
      ingredients: ['Salmon', 'Lemon', 'Herbs'],
      instructions: ['Season salmon', 'Grill until cooked through'],
      markets: [
        {
          id: 'm3', name: 'Poissonnerie Fraîche', image: { uri: getMarketImageUrl('Poissonnerie Fraîche') }, distance: 2.0, rating: 4.8,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm4', name: 'Grand Hypermarché', image: { uri: getMarketImageUrl('Grand Hypermarché') }, distance: 3.5, rating: 4.1,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim4',
          title: 'Baked Cod',
          image: getImageUrl('Baked Cod'),
          description: 'Lightly seasoned baked cod, tender and moist.',
          prepTime: 25,
          calories: 300,
          markets: [],
          category: 'dinner',
          ingredients: ['Cod', 'Butter', 'Garlic'],
          instructions: ['Bake cod in oven'],
          price: 15.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.2,
        },
        {
          id: 'sim5',
          title: 'Shrimp Scampi',
          image: getImageUrl('Shrimp Scampi'),
          description: 'Succulent shrimp sautéed in garlic butter and white wine sauce.',
          prepTime: 20,
          calories: 550,
          markets: [],
          category: 'dinner',
          ingredients: ['Shrimp', 'Garlic', 'Butter', 'White wine'],
          instructions: ['Cook shrimp in sauce'],
          price: 19.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.5,
        },
        {
          id: 'sim6',
          title: 'Tuna Steak',
          image: getImageUrl('Tuna Steak'),
          description: 'Pan-seared tuna steak with a sesame crust.',
          prepTime: 15,
          calories: 480,
          markets: [],
          category: 'dinner',
          ingredients: ['Tuna steak', 'Sesame seeds', 'Soy sauce'],
          instructions: ['Sear tuna', 'Serve with sauce'],
          price: 17.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.4,
        },
      ],
    },
    {
      id: '3',
      title: 'Vegetable Stir-Fry',
      difficulty: 2,
      popularity: 4.5,
      image: getImageUrl('Vegetable Stir-Fry'),
      description: 'A colorful medley of fresh seasonal vegetables stir-fried to perfection in a savory Asian-inspired sauce. Healthy and satisfying.',
      category: 'vegetarian',
      price: 12.00,
      prepTime: 25,
      calories: 380,
      ingredients: ['Mixed vegetables', 'Soy sauce', 'Ginger'],
      instructions: ['Chop vegetables', 'Stir-fry in wok', 'Add sauce'],
      markets: [
        {
          id: 'm5', name: 'Marché Bio Vert', image: { uri: getMarketImageUrl('Marché Bio Vert') }, distance: 0.5, rating: 4.7,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm6', name: 'Epicerie du Coin', image: { uri: getMarketImageUrl('Epicerie du Coin') }, distance: 1.2, rating: 4.0,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim7',
          title: 'Tofu Curry',
          image: getImageUrl('Tofu Curry'),
          description: 'Creamy and spicy tofu curry with coconut milk and mixed vegetables.',
          prepTime: 35,
          calories: 450,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Tofu', 'Curry paste', 'Coconut milk', 'Vegetables'],
          instructions: ['Cook tofu', 'Add curry and vegetables', 'Simmer'],
          price: 14.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.3,
        },
        {
          id: 'sim8',
          title: 'Broccoli & Cheese Casserole',
          image: getImageUrl('Broccoli Cheese Casserole'),
          description: 'Comforting casserole with tender broccoli and melted cheese.',
          prepTime: 40,
          calories: 600,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Broccoli', 'Cheddar cheese', 'Cream of mushroom soup'],
          instructions: ['Combine ingredients', 'Bake until bubbly'],
          price: 13.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.1,
        },
        {
          id: 'sim9',
          title: 'Quinoa Salad',
          image: getImageUrl('Quinoa Salad'),
          description: 'Fresh and light quinoa salad with cucumbers, tomatoes, and a lemon vinaigrette.',
          prepTime: 15,
          calories: 320,
          markets: [],
          category: 'vegan',
          ingredients: ['Quinoa', 'Cucumber', 'Tomato', 'Lemon vinaigrette'],
          instructions: ['Cook quinoa', 'Chop vegetables', 'Mix all ingredients'],
          price: 11.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.2,
        },
      ],
    },
    {
      id: '4',
      title: 'Beef Tacos',
      difficulty: 3,
      popularity: 4.4,
      image: getImageUrl('Beef Tacos'),
      description: 'Savory ground beef seasoned with authentic Mexican spices, served in warm tortillas with fresh toppings like lettuce, cheese, and salsa.',
      category: 'dinner',
      price: 15.00,
      prepTime: 45,
      calories: 550,
      ingredients: ['Ground beef', 'Taco shells', 'Lettuce', 'Cheese', 'Salsa'],
      instructions: ['Cook beef', 'Warm shells', 'Assemble tacos'],
      markets: [
        {
          id: 'm7', name: 'La Taqueria', image: { uri: getMarketImageUrl('La Taqueria') }, distance: 0.3, rating: 4.9,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm8', name: 'Mexico Lindo Market', image: { uri: getMarketImageUrl('Mexico Lindo Market') }, distance: 2.5, rating: 4.3,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim10',
          title: 'Chicken Fajitas',
          image: getImageUrl('Chicken Fajitas'),
          description: 'Sizzling chicken and bell peppers, perfect for rolling in warm tortillas.',
          prepTime: 30,
          calories: 580,
          markets: [],
          category: 'dinner',
          ingredients: ['Chicken breast', 'Bell peppers', 'Onion', 'Tortillas'],
          instructions: ['Sauté chicken and vegetables', 'Serve with tortillas'],
          price: 16.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.4,
        },
        {
          id: 'sim11',
          title: 'Pork Carnitas',
          image: getImageUrl('Pork Carnitas'),
          description: 'Slow-cooked, tender pork carnitas, crispy on the outside.',
          prepTime: 120,
          calories: 750,
          markets: [],
          category: 'dinner',
          ingredients: ['Pork shoulder', 'Orange juice', 'Spices'],
          instructions: ['Slow cook pork', 'Shred and crisp'],
          price: 18.00,
          similarItems: [],
          difficulty: 4,
          popularity: 4.6,
        },
        {
          id: 'sim12',
          title: 'Veggie Burrito',
          image: getImageUrl('Veggie Burrito'),
          description: 'A hearty burrito filled with rice, beans, and fresh vegetables.',
          prepTime: 20,
          calories: 400,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Rice', 'Black beans', 'Corn', 'Salsa', 'Tortilla'],
          instructions: ['Cook rice and beans', 'Assemble burrito'],
          price: 10.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.3,
        },
      ],
    },
    {
      id: '5',
      title: 'Shrimp Scampi',
      difficulty: 3,
      popularity: 4.6,
      image: getImageUrl('Shrimp Scampi'),
      description: 'Plump shrimp sautéed in a rich garlic butter and white wine sauce, typically served over linguine or with crusty bread.',
      category: 'dinner',
      price: 20.00,
      prepTime: 25,
      calories: 500,
      ingredients: ['Shrimp', 'Garlic', 'Butter', 'White wine', 'Linguine'],
      instructions: ['Cook linguine', 'Sauté shrimp in sauce', 'Combine'],
      markets: [
        {
          id: 'm9', name: 'Italian Delights', image: { uri: getMarketImageUrl('Italian Delights') }, distance: 1.0, rating: 4.6,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm10', name: 'Seafood Paradise', image: { uri: getMarketImageUrl('Seafood Paradise') }, distance: 1.8, rating: 4.5,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim13',
          title: 'Pasta Primavera',
          image:  getImageUrl('Pasta Primavera') ,
          description: 'Pasta with fresh spring vegetables in a light sauce.',
          prepTime: 25,
          calories: 420,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Pasta', 'Mixed vegetables', 'Olive oil'],
          instructions: ['Cook pasta', 'Sauté vegetables', 'Toss with pasta'],
          price: 14.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.2,
        },
        {
          id: 'sim14',
          title: 'Linguine with Clams',
          image:  getImageUrl('Linguine with Clams'),
          description: 'Classic Italian dish with tender clams in a garlicky white wine sauce.',
          prepTime: 35,
          calories: 500,
          markets: [],
          category: 'dinner',
          ingredients: ['Linguine', 'Clams', 'Garlic', 'White wine'],
          instructions: ['Cook linguine', 'Cook clams in sauce', 'Combine'],
          price: 19.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.5,
        },
        {
          id: 'sim15',
          title: 'Calamari Fritti',
          image:  getImageUrl('Calamari Fritti'),
          description: 'Crispy fried calamari rings, served with marinara sauce.',
          prepTime: 20,
          calories: 600,
          markets: [],
          category: 'appetizer',
          ingredients: ['Calamari', 'Flour', 'Marinara sauce'],
          instructions: ['Coat calamari', 'Deep fry', 'Serve with sauce'],
          price: 16.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.1,
        },
      ],
    },
    {
      id: '6',
      title: 'Mushroom Risotto',
      image:  getImageUrl('Mushroom Risotto'),
      description: 'Creamy and rich Italian risotto made with Arborio rice, earthy mushrooms, Parmesan cheese, and vegetable broth. A comforting and elegant dish.',
      category: 'vegetarian',
      price: 16.00,
      prepTime: 40,
      calories: 450,
      ingredients: ['Arborio rice', 'Mushrooms', 'Parmesan cheese', 'Vegetable broth'],
      instructions: ['Sauté mushrooms', 'Add rice and broth', 'Cook until creamy'],
      markets: [
        {
          id: 'm11', name: 'Fine Foods Market', image: { uri: getMarketImageUrl('Fine Foods Market') }, distance: 0.7, rating: 4.7,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
        {
          id: 'm12', name: 'Local Farmers Market', image: { uri: getMarketImageUrl('Local Farmers Market') }, distance: 2.2, rating: 4.4,
          latitude: 0,
          longitude: 0,
          address: '',
          products: [],
          description: ''
        },
      ],
      similarItems: [
        {
          id: 'sim16',
          title: 'Pesto Pasta',
          image:  getImageUrl('Pesto Pasta'),
          description: 'Pasta tossed in a vibrant basil pesto sauce.',
          prepTime: 20,
          calories: 480,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Pasta', 'Pesto', 'Cherry tomatoes'],
          instructions: ['Cook pasta', 'Mix with pesto'],
          price: 13.00,
          similarItems: [],
          difficulty: 3,
          popularity: 4.4,
        },
        {
          id: 'sim17',
          title: 'Spinach and Ricotta Lasagna',
          image: getImageUrl('Spinach Lasagna'),
          description: 'Layers of pasta, creamy ricotta, spinach, and marinara sauce.',
          prepTime: 45,
          calories: 650,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Lasagna noodles', 'Ricotta', 'Spinach', 'Marinara sauce'],
          instructions: ['Layer ingredients', 'Bake in oven'],
          price: 17.00,
          similarItems: [],
          difficulty: 2,
          popularity: 4.3,
        },
        {
          id: 'sim18',
          title: 'Gnocchi with Tomato Sauce',
          image: getImageUrl('Gnocchi with Tomato'),
          description: 'Soft potato gnocchi served with a rich tomato sauce.',
          prepTime: 30,
          calories: 520,
          markets: [],
          category: 'vegetarian',
          ingredients: ['Gnocchi', 'Tomato sauce', 'Basil'],
          instructions: ['Cook gnocchi', 'Warm sauce', 'Combine'],
          price: 14.50,
          similarItems: [],
          difficulty: 2,
          popularity: 4.2,
        },
      ],
      difficulty: 0,
      popularity: 0
    },
  ];

  const renderRecipeItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.recipeItem}>
      <TouchableOpacity
        style={styles.recipeItemImageContainer}
        // navigation.navigate is now correctly typed thanks to RootStackParamList
        onPress={() => navigation.navigate('RecipeDetail', { foodItem: item })}
      >
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : (item.image as ImageSourcePropType)}
          style={styles.recipeItemImage}
        />
        <Text style={styles.recipeItemTitle}>{item.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.commandeButton}
        onPress={() => addCommande(item, user)}
      >
        <Text style={styles.commandeButtonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category: string) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe Grid */}
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item: FoodItem) => item.id}
        numColumns={2}
        contentContainerStyle={styles.recipeGrid}
        columnWrapperStyle={styles.recipeRow}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.navText, styles.activeNav]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          {/* You might want to navigate to a Favorites screen here */}
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Preferences')}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 70, // Provide space for the fixed bottom navigation
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
  },
  categoryContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  activeCategory: {
    backgroundColor: '#ff6b00',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeCategoryText: {
    color: 'white',
  },
  recipeGrid: {
    paddingHorizontal: 15,
  },
  recipeRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  recipeItem: {
    width: itemWidth - 5,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15, // Added margin for vertical spacing between items
  },
  recipeItemImageContainer: {
    // Styling if needed for the image touchable area
  },
  recipeItemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    padding: 12,
    textAlign: 'center',
  },
  commandeButton: {
    backgroundColor: '#4CAF50', // Green color for "Ajouter" button
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  commandeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeNav: {
    color: '#ff6b00',
  },
});

export default Dashboard;