// src/navigation/types.ts

import { ImageSourcePropType } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

// Interface pour un marché
export interface Market {
  id: string;
  name: string;
  image: ImageSourcePropType | { uri: string }; // Keep flexibility for image sources
  distance?: number;
  rating: number; // e.g., 4.5
  latitude: number;
  longitude: number;
  address: string;
  products: FoodItem[]; // Assuming FoodItem can represent a product in a market context
  description: string;
}

// Interface pour un ingrédient
export interface Ingredient {
  name: string;
  quantity: string; // e.g., "2 cups", "1 large"
}

// Mise à jour de l'interface FoodItem (pour les recettes)
export interface FoodItem {
  id: string;
  title: string;
  image: string; // Assuming 'image' is a URL string for recipes
  description: string;
  prepTime: number; // Changed to number for consistency with Firestore queries
  calories: number; // Changed to number for consistency and data manipulation
  category?: string;
  ingredients: string[]; // Or Ingredient[] if you want more structured ingredients
  instructions: string[];
  markets: Market[]; // List of markets where this food item/recipe is available
  similarItems: FoodItem[]; // List of similar recipes
  price?: number; // Optional price for a single item if applicable (e.g., for a restaurant dish)
  difficulty: number; // e.g., 1, 2, 3
  popularity: number; // Average rating or popularity score
  isVegetarian?: boolean; // Added for dietary restrictions filtering
  isVegan?: boolean; // Added for dietary restrictions filtering
  // Add any other specific properties your recipes might have in Firestore
}

// Définition des paramètres de navigation pour le Stack Navigator
export interface RootStackParamList extends ParamListBase {
  SplashScreen: undefined; // Added for initial route
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  RecipeList: { category?: string }; // Can navigate to a specific category
  RecipeDetail: { foodItem: FoodItem }; // Pass the full food item
  ShoppingList: undefined;
  Profile: undefined; // Assuming you have a ProfileScreen
  MarketList: undefined;
  MarketDetail: { market: Market }; // Pass the full market object
  VoiceRecognition: undefined;
  MealPlanner: undefined; // Assuming you have this screen
  IngredientPriceCompare: undefined; // Assuming you have this screen
  RecipeShare: undefined; // Assuming you have this screen
  RecipeRatings: undefined; // Assuming you have this screen, distinct from RecipeReview
  OfflineMode: undefined; // Assuming you have this screen
  VideoTutorial: undefined; // Assuming you have this screen
  Preferences: undefined; // General preferences
  AllergiesPreferences: undefined; // Specific allergies preferences screen
  PriceComparison: undefined; // Screen for ingredient price comparison
  ImageRecognition: undefined; // Screen for image recognition features
  RecipeRecommendation: undefined; // Screen for recipe recommendations
  RecipeReview: { foodItem: FoodItem }; // Screen for leaving a review on a specific recipe
  // Add any other screens from your App.tsx here if they are part of the main stack
}

// Type pour la navigation (pour une utilisation avec useNavigation)
export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;