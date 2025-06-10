// src/screens/RecipeList.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type RecipeListScreenRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;
type RecipeListScreenNavigationProp = NavigationProp<RootStackParamList, 'RecipeList'>;

const RecipeList = () => {
  const navigation = useNavigation<RecipeListScreenNavigationProp>();
  const route = useRoute<RecipeListScreenRouteProp>();
  const { category } = route.params || {}; // Get category if passed

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe List Screen</Text>
      {category && <Text style={styles.subtitle}>Category: {category}</Text>}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

export default RecipeList;