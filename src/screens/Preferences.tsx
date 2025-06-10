// src/screens/Preferences.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type PreferencesScreenNavigationProp = NavigationProp<RootStackParamList, 'Preferences'>;

const Preferences = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences Screen</Text>
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
    marginBottom: 20,
  },
});

export default Preferences;