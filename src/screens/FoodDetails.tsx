import React from 'react';
import { View, Text, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Market } from '../navigation/types';

type FoodDetailsRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

const FoodDetails = () => {
  const route = useRoute<FoodDetailsRouteProp>();
  const { foodItem } = route.params;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{foodItem.title}</Text>
      <Text style={{ marginVertical: 10 }}>{foodItem.description}</Text>

      <Image
        source={{ uri: foodItem.image }}
        style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }}
      />
      {/* Removed the images.map since FoodItem only has a single image */}
      <Image
        source={{ uri: foodItem.image }}
        style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }}
        resizeMode="cover"
      />

      <Text style={{ fontWeight: 'bold' }}>Temps de préparation : {foodItem.prepTime}</Text>
      <Text style={{ fontWeight: 'bold' }}>Calories : {foodItem.calories}</Text>

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Marchés disponibles</Text>
      {foodItem.markets.map((market, index) => (
        <View style={{ marginVertical: 10 }}>
          <Image source={market.image} style={{ height: 100, width: '100%', borderRadius: 10 }} />
          <Text style={{ fontWeight: 'bold' }}>{market.name}</Text>
          <Text>Distance : {market.distance}</Text>
          <Text>Note : {market.rating}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default FoodDetails;
