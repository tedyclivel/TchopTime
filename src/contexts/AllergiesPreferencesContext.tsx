import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { collection, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';
import { useAuth } from './AuthContext';

interface AllergiesPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const AllergiesPreferencesContext = createContext<AllergiesPreferencesContextType | undefined>(undefined);

export const AllergiesPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    allergies: [],
    dietaryRestrictions: [],
    favoriteIngredients: [],
    dislikedIngredients: [],
    mealPreferences: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.uid) return;
      try {
        const preferencesRef = doc(firestore, 'userPreferences', user.uid);
        const snapshot = await getDoc(preferencesRef);
        if (snapshot.exists()) {
          setPreferences(snapshot.data() as UserPreferences);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.uid]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user?.uid) return;
    try {
      const preferencesRef = doc(firestore, 'userPreferences', user.uid);
      await setDoc(preferencesRef, {
        ...preferences,
        ...newPreferences
      });
      setPreferences((prev: any) => ({
        ...prev,
        ...newPreferences
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <AllergiesPreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </AllergiesPreferencesContext.Provider>
  );
};

export const useAllergiesPreferences = () => {
  const context = useContext(AllergiesPreferencesContext);
  if (!context) {
    throw new Error('useAllergiesPreferences must be used within an AllergiesPreferencesProvider');
  }
  return context;
};
export { UserPreferences };

