// src/screens/MyNotebookScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyNotebookScreen = () => { // C'est une fonction composant React
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Carnet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MyNotebookScreen; // Il doit être exporté par défaut