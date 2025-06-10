import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useLocation } from '../hooks/useLocation';

interface PriceComparisonContextType {
  prices: Record<string, { price: number; store: string; distance: number }>;
  getPrices: (ingredients: string[]) => Promise<void>;
  loading: boolean;
}

const PriceComparisonContext = createContext<PriceComparisonContextType | undefined>(undefined);

export const PriceComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [prices, setPrices] = useState<Record<string, { price: number; store: string; distance: number }>>({});
  const [loading, setLoading] = useState(false);
  const { location } = useLocation();

  const calculateDistance = (storeLocation: { lat: number; lng: number }): number => {
    if (!location) return 0;
    
    const R = 6371; // Rayon de la Terre en km
    const dLat = (storeLocation.lat - location.latitude) * Math.PI / 180;
    const dLon = (storeLocation.lng - location.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.latitude * Math.PI / 180) * Math.cos(storeLocation.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getPrices = async (ingredients: string[]) => {
    if (!user?.uid || !location) return;
    
    setLoading(true);
    try {
      const storesRef = collection(firestore, 'stores');
      const storesQuery = query(storesRef, where('active', '==', true));
      const storesSnapshot = await getDocs(storesQuery);

      const storesWithPrices = storesSnapshot.docs.map(storeDoc => {
        const storeData = storeDoc.data();
        const storePrices = storeData.prices || {};
        const storeLocation = storeData.location || { lat: 0, lng: 0 };
        const distance = calculateDistance(storeLocation);

        return {
          id: storeDoc.id,
          name: storeData.name,
          prices: storePrices,
          location: storeLocation,
          distance: distance
        };
      });

      const bestPrices: Record<string, { price: number; store: string; distance: number }> = {};
      ingredients.forEach(ingredient => {
        const pricesForIngredient = storesWithPrices
          .filter(store => store.prices[ingredient])
          .map(store => ({
            price: store.prices[ingredient],
            store: store.name,
            distance: store.distance
          }));

        if (pricesForIngredient.length > 0) {
          // Trier par prix, puis par distance si les prix sont égaux
          pricesForIngredient.sort((a, b) => {
            if (a.price !== b.price) return a.price - b.price;
            return a.distance - b.distance;
          });

          bestPrices[ingredient] = pricesForIngredient[0];
        }
      });

      setPrices(bestPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PriceComparisonContext.Provider value={{ prices, getPrices, loading }}>
      {children}
    </PriceComparisonContext.Provider>
  );
};

export const usePriceComparison = () => {
  const context = useContext(PriceComparisonContext);
  if (!context) {
    throw new Error('usePriceComparison must be used within a PriceComparisonProvider');
  }
  return context;
};
