import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const RecipeCard = ({ name, imageUrl, locationInfo }: { name: string, imageUrl: string, locationInfo: string }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>{locationInfo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecipeCard;
