import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from 'react-native-netinfo';
import { collection, getDocs, setDoc, doc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

interface OfflineSyncContextType {
  isOnline: boolean;
  pendingChanges: any[];
  saveChangesOffline: (changes: any[]) => Promise<void>;
  syncWithServer: () => Promise<void>;
  loading: boolean;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | ((prevState: boolean) => boolean); }) => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        syncWithServer();
      }
    });

    return () => unsubscribe();
  }, []);

  const saveChangesOffline = async (changes: any[]) => {
    try {
      const currentChanges = await AsyncStorage.getItem('pendingChanges');
      const allChanges = [...(currentChanges ? JSON.parse(currentChanges) : []), ...changes];
      await AsyncStorage.setItem('pendingChanges', JSON.stringify(allChanges));
      setPendingChanges(allChanges);
    } catch (error) {
      console.error('Error saving offline changes:', error);
    }
  };

  const syncWithServer = async () => {
    if (!isOnline || loading) return;

    setLoading(true);
    try {
      const storedChanges = await AsyncStorage.getItem('pendingChanges');
      if (!storedChanges) return;

      const changes = JSON.parse(storedChanges);
      const failedChanges: any[] = [];

      // Traiter chaque changement
      for (const change of changes) {
        try {
          const collectionRef = collection(firestore, change.collection);
          const docRef = doc(collectionRef, change.id);
          await setDoc(docRef, change.data);
        } catch (error) {
          console.error(`Error syncing change ${change.id}:`, error);
          failedChanges.push(change);
        }
      }

      // Sauvegarder les changements échoués
      if (failedChanges.length > 0) {
        await AsyncStorage.setItem('pendingChanges', JSON.stringify(failedChanges));
        setPendingChanges(failedChanges);
      } else {
        await AsyncStorage.removeItem('pendingChanges');
        setPendingChanges([]);
      }
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OfflineSyncContext.Provider value={{
      isOnline,
      pendingChanges,
      saveChangesOffline,
      syncWithServer,
      loading,
    }}>
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};
