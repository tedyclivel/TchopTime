import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importez vos écrans d'application directement depuis 'screens/'
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MyNotebookScreen from '../screens/MyNotebookScreen'; // Ajouté selon votre arborescence
import MyRecipesScreen from '../screens/MyRecipesScreen'; // Ajouté selon votre arborescence
import ProfileScreen from '../screens/ProfileScreen'; // Ajouté selon votre arborescence


const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconSize = 24;
          const tintColor = focused ? '#E53935' : '#888';

          switch (route.name) {
            case 'Accueil':
              iconName = 'home';
              break;
            case 'Rechercher':
              iconName = 'search';
              break;
            case 'Favoris':
              iconName = 'favorite';
              break;
            case 'Mon Carnet':
              iconName = 'book';
              break;
            case 'Mes Recettes':
              iconName = 'restaurant-menu'; // Icône suggérée pour les recettes
              break;
            case 'Profil':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={iconSize} color={tintColor} />;
        },
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 5,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Rechercher" component={SearchScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
      <Tab.Screen name="Mon Carnet" component={MyNotebookScreen} />
      <Tab.Screen name="Mes Recettes" component={MyRecipesScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
      {/* Si vous avez d'autres onglets principaux, ajoutez-les ici */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({}); // Pas de styles spécifiques ici pour l'instant

export default AppTabs;