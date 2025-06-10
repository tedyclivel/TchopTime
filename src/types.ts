export interface Ingredient {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  price?: number;
  unit?: string;
  category?: string;
}

export interface Market {
  id: string;
  name: string;
  address: string;
  image: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export interface MarketPrice {
  id: string;
  ingredientId: string;
  marketId: string;
  marketName: string;
  price: number;
  unit: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  checked: boolean;
  userId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'reminder' | 'update';
  read: boolean;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    allergies: string[];
    dietaryRestrictions: string[];
    favoriteIngredients: string[];
  };
}
