import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

interface Preferences {
  dietaryPreferences: string[];
  allergies: string[];
  mealTimes: string[];
  favoriteIngredients: string[];
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreferences: (newPreferences: Partial<Preferences>) => Promise<void>;
  loading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    dietaryPreferences: [],
    allergies: [],
    mealTimes: ['breakfast', 'lunch', 'dinner'],
    favoriteIngredients: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'userPreferences'));
      const data = querySnapshot.docs[0]?.data() as Preferences;
      setPreferences(data || {
        dietaryPreferences: [],
        allergies: [],
        mealTimes: ['breakfast', 'lunch', 'dinner'],
        favoriteIngredients: [],
      });
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    try {
      setPreferences(prev => ({
        ...prev,
        ...newPreferences,
      }));

      await setDoc(doc(firestore, 'userPreferences', 'current'), {
        ...preferences,
        ...newPreferences,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a PreferencesProvider');
  }
  return context;
};
