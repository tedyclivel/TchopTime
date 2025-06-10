import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, query, where } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  checked: boolean;
  createdAt?: string;
  completedAt?: string;
}

interface ShoppingListContextType {
  shoppingList: ShoppingItem[];
  addItem: (item: ShoppingItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<ShoppingItem>) => Promise<void>;
  loading: boolean;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(firestore, 'shoppingList'),
          where('checked', '==', false)
        )
      );
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingList(items as ShoppingItem[]);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: ShoppingItem) => {
    try {
      const docRef = await setDoc(doc(firestore, 'shoppingList', item.name), {
        ...item,
        checked: false,
        createdAt: new Date().toISOString(),
      });
      loadShoppingList();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await setDoc(doc(firestore, 'shoppingList', itemId), {
        checked: true,
        completedAt: new Date().toISOString(),
      });
      loadShoppingList();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const toggleItem = async (itemId: string) => {
    try {
      const item = shoppingList.find(i => i.id === itemId);
      if (item) {
        await setDoc(doc(firestore, 'shoppingList', itemId), {
          ...item,
          checked: !item.checked,
        });
        loadShoppingList();
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
    try {
      const item = shoppingList.find(i => i.id === itemId);
      if (item) {
        await setDoc(doc(firestore, 'shoppingList', itemId), {
          ...item,
          ...updates,
        });
        loadShoppingList();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <ShoppingListContext.Provider value={{
      shoppingList,
      addItem,
      removeItem,
      toggleItem,
      updateItem,
      loading,
    }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
