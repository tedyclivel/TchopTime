// src/App.tsx

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

// Importez vos fournisseurs de contexte
import { AuthProvider } from './src/contexts/AuthContext';
import { ShoppingListProvider } from './src/contexts/ShoppingListContext';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { AllergiesPreferencesProvider } from './src/contexts/AllergiesPreferencesContext';
import { PriceComparisonProvider } from './src/contexts/PriceComparisonContext';
import { ImageRecognitionProvider } from './src/contexts/ImageRecognitionContext';
import { RecipeRecommendationProvider } from './src/contexts/RecipeRecommendationContext';
import { ReviewProvider } from './src/contexts/ReviewContext';
import { OfflineSyncProvider } from './src/contexts/OfflineSyncContext';

// Importez tous vos composants d'écran
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import Dashboard from './src/screens/Dashboard';
import RecipeList from './src/screens/RecipeList';
import RecipeDetail from './src/screens/RecipeDetail';
import ShoppingList from './src/screens/ShoppingList';
import ProfileScreen from './src/screens/ProfileScreen';
import MarketList from './src/screens/MarketList';
import MarketDetail from './src/screens/MarketDetail';
import VoiceRecognition from './src/screens/VoiceRecognition';
import MealPlanner from './src/screens/MealPlanner';
import IngredientPriceCompare from './src/screens/IngredientPriceCompare';
import RecipeShare from './src/screens/RecipeShare';
import RecipeRatings from './src/screens/RecipeRatings';
import OfflineMode from './src/screens/OfflineMode'; // Original OfflineMode component
import VideoTutorial from './src/screens/VideoTutorial';
import Preferences from './src/screens/Preferences';

// Nouveaux imports d'écrans pour les nouveaux contextes
import AllergiesPreferencesScreen from './src/screens/AllergiesPreferencesScreen';
import PriceComparisonScreen from './src/screens/PriceComparisonScreen';
import ImageRecognitionScreen from './src/screens/ImageRecognitionScreen';
import RecipeRecommendationScreen from './src/screens/RecipeRecommendationScreen'; // Assurez-vous d'avoir ce composant
import RecipeReviewScreen from './src/screens/RecipeReviewScreen'; // Assurez-vous d'avoir ce composant
import OfflineModeScreen from './src/screens/OfflineModeScreen'; // Assurez-vous d'avoir ce composant si différent de OfflineMode

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      {/* Ordre des fournisseurs de contexte : du plus générique au plus spécifique si dépendances */}
      <AuthProvider>
        <PreferencesProvider>
          <ShoppingListProvider>
            <AllergiesPreferencesProvider>
              <PriceComparisonProvider>
                <ImageRecognitionProvider>
                  <RecipeRecommendationProvider>
                    <ReviewProvider>
                      <OfflineSyncProvider>
                        <NavigationContainer>
                          <Stack.Navigator
                            initialRouteName="SplashScreen"
                            screenOptions={{
                              headerShown: false,
                              animation: 'slide_from_right' // Animation globale par défaut
                            }}
                          >
                            {/* Écrans d'authentification */}
                            <Stack.Screen
                              name="SplashScreen"
                              component={SplashScreen}
                              options={{
                                animation: 'fade' // Animation spécifique pour le SplashScreen
                              }}
                            />
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

                            {/* Écrans de l'application principale */}
                            <Stack.Screen name="Dashboard" component={Dashboard} />
                            <Stack.Screen name="MealPlanner" component={MealPlanner} />
                            <Stack.Screen name="RecipeList" component={RecipeList} />
                            <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
                            <Stack.Screen name="RecipeShare" component={RecipeShare} />
                            <Stack.Screen name="RecipeRatings" component={RecipeRatings} />
                            <Stack.Screen name="Preferences" component={Preferences} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="MarketList" component={MarketList} />
                            <Stack.Screen name="MarketDetail" component={MarketDetail} />
                            <Stack.Screen name="ShoppingList" component={ShoppingList} />
                            <Stack.Screen name="IngredientPriceCompare" component={IngredientPriceCompare} />
                            <Stack.Screen name="VoiceRecognition" component={VoiceRecognition} />
                            <Stack.Screen name="VideoTutorial" component={VideoTutorial} />

                            {/* Nouveaux écrans liés aux contextes ajoutés */}
                            <Stack.Screen name="AllergiesPreferences" component={AllergiesPreferencesScreen} />
                            <Stack.Screen name="PriceComparison" component={PriceComparisonScreen} />
                            <Stack.Screen name="ImageRecognition" component={ImageRecognitionScreen} />
                            <Stack.Screen name="RecipeRecommendation" component={RecipeRecommendationScreen} />
                            <Stack.Screen name="RecipeReview" component={RecipeReviewScreen} />
                            <Stack.Screen name="OfflineMode" component={OfflineMode} /> {/* Using original OfflineMode name */}
                            {/* If you have both OfflineMode and OfflineModeScreen, choose one or rename in types.ts */}

                          </Stack.Navigator>
                        </NavigationContainer>
                      </OfflineSyncProvider>
                    </ReviewProvider>
                  </RecipeRecommendationProvider>
                </ImageRecognitionProvider>
              </PriceComparisonProvider>
            </AllergiesPreferencesProvider>
          </ShoppingListProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default App;