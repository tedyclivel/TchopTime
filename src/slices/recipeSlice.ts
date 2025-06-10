import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  calories?: string;
  images?: any[];
  similar?: any[];
  markets?: {
    name: string;
    distance: string;
    rating: string;
    image: any;
  }[];
}

const initialState = {
  recipes: [] as Recipe[],
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
    clearRecipes: (state) => {
      state.recipes = [];
    },
  },
});

export const { setRecipes, addRecipe, updateRecipe, removeRecipe, clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
