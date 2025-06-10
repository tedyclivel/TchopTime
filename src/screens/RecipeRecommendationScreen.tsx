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
import { useRecipeRecommendation } from '../contexts/RecipeRecommendationContext';
import { Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RecipeRecommendationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeRecommendation'>;

const RecipeRecommendationScreen = () => {
  const navigation = useNavigation<RecipeRecommendationScreenNavigationProp>();
  const { recommendedRecipes, getRecommendations, loading } = useRecipeRecommendation();
  const [searchIngredients, setSearchIngredients] = useState('');

  const handleSearch = () => {
    const ingredients = searchIngredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);
    getRecommendations(ingredients);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ''}${hours > 0 ? ' ' : ''}${remainingMinutes}min`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher avec des ingrédients (séparés par des virgules)"
          value={searchIngredients}
          onChangeText={setSearchIngredients}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#007AFF" />
      ) : (
        <View style={styles.recipesContainer}>
          {recommendedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { foodItem: recipe })}
            >
              <Image
                source={{ uri: recipe.image as string }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeInfoItem}>
                    <Text style={styles.recipeInfoLabel}>Difficulté:</Text>
                    <Text style={styles.recipeInfoValue}>{recipe.difficulty}/5</Text>
                  </View>
                  <View style={styles.recipeInfoItem}>
                    <Text style={styles.recipeInfoLabel}>Temps:</Text>
                    <Text style={styles.recipeInfoValue}>{formatDuration(recipe.prepTime)}</Text>
                  </View>
                  <View style={styles.recipeInfoItem}>
                    <Text style={styles.recipeInfoLabel}>Popularité:</Text>
                    <Text style={styles.recipeInfoValue}>{recipe.popularity} ❤️</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  recipesContainer: {
    marginTop: 20,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeDetails: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  recipeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeInfoLabel: {
    color: '#666',
    marginRight: 5,
  },
  recipeInfoValue: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default RecipeRecommendationScreen;
