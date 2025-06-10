import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { FoodItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

const FavoriteDishes = () => {
  const navigation = useNavigation<RootStackParamList>();
  const { user } = useAuth();
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (user) {
      loadFavoriteFoods();
    }
  }, [user]);

  const loadFavoriteFoods = async () => {
    try {
      const q = query(
        collection(firestore, 'favoriteFoods'),
        where('userId', '==', user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const foods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoriteFoods(foods as FoodItem[]);
    } catch (error) {
      console.error('Error loading favorite foods:', error);
    }
  };

  const renderItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => navigation.navigate('FoodDetails', { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.foodImage} />
      <Text style={styles.foodName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Plats Favoris</Text>
      <FlatList
        data={favoriteFoods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  foodItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  foodImage: {
    width: '100%',
    height: 150,
  },
  foodName: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoriteDishes;
