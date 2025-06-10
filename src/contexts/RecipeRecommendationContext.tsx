import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase'; // Assurez-vous que le chemin est correct
import { useAllergiesPreferences } from './AllergiesPreferencesContext'; // Assurez-vous que le chemin est correct
import { FoodItem } from '../navigation/types'; // Importez l'interface FoodItem complète

interface RecipeRecommendationContextType {
  recommendedRecipes: FoodItem[]; // Use FoodItem type here
  getRecommendations: (ingredients?: string[]) => Promise<void>;
  loading: boolean;
}

const RecipeRecommendationContext = createContext<RecipeRecommendationContextType | undefined>(undefined);

export const RecipeRecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences } = useAllergiesPreferences();
  const [recommendedRecipes, setRecommendedRecipes] = useState<FoodItem[]>([]); // Use FoodItem[] here
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (ingredients?: string[]) => {
    setLoading(true);
    try {
      const recipesRef = collection(firestore, 'recipes');

      // Construire la requête en fonction des préférences
      const q = query(
        recipesRef,
        where('difficulty', '<=', preferences.mealPreferences.difficulty || 3),
        where('prepTime', '<=', preferences.mealPreferences.prepTime || 60),
        orderBy('popularity', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const recipes = querySnapshot.docs.map(doc => {
        const data = doc.data() as FoodItem;
        return {
          ...data,
          id: doc.id
        };
      });

      // Filtrer les recettes en fonction des allergies et restrictions
      const filteredRecipes = recipes.filter((recipe: FoodItem) => { // Explicitly type recipe as FoodItem
        // Vérifier les allergies
        if (preferences.allergies.some((allergy: string) =>
          recipe.ingredients?.some((ingredient: string) => ingredient.toLowerCase().includes(allergy.toLowerCase()))
        )) {
          return false;
        }

        // Vérifier les restrictions alimentaires
        // Use optional chaining (?.) for properties that might not always exist on every document
        // and provide default false if undefined.
        if (preferences.dietaryRestrictions.includes('vegetarian') && !recipe.isVegetarian) {
          return false;
        }
        if (preferences.dietaryRestrictions.includes('vegan') && !recipe.isVegan) {
          return false;
        }

        return true;
      });

      // Si des ingrédients sont fournis, prioriser les recettes qui les utilisent
      if (ingredients && ingredients.length > 0) {
        filteredRecipes.sort((a, b) => {
          const aScore = ingredients.filter(ing =>
            a.ingredients?.some((ai: string) => ai.toLowerCase().includes(ing.toLowerCase()))
          ).length;
          const bScore = ingredients.filter(ing =>
            b.ingredients?.some((bi: string) => bi.toLowerCase().includes(ing.toLowerCase()))
          ).length;
          return bScore - aScore;
        });
      }

      setRecommendedRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Récupérer les recommandations initiales
    // Only fetch if preferences are loaded to avoid issues with undefined preferences
    if (preferences) {
      getRecommendations();
    }
  }, [preferences]); // Rerun when preferences change

  return (
    <RecipeRecommendationContext.Provider value={{ recommendedRecipes, getRecommendations, loading }}>
      {children}
    </RecipeRecommendationContext.Provider>
  );
};

export const useRecipeRecommendation = () => {
  const context = useContext(RecipeRecommendationContext);
  if (!context) {
    throw new Error('useRecipeRecommendation must be used within a RecipeRecommendationProvider');
  }
  return context;
};