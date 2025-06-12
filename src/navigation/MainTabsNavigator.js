// src/navigation/MainTabsNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import MyNotebookScreen from '../screens/MyNotebookScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          
          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Recettes') {
            iconName = focused ? 'menu-book' : 'menu-book'; 
          } else if (route.name === 'Mes Recettes') {
            iconName = focused ? 'kitchen' : 'kitchen'; 
          } else if (route.name === 'Mon Carnet') {
            iconName = focused ? 'shopping-cart' : 'shopping-cart'; 
          } else if (route.name === 'Mon Profil') {
            iconName = focused ? 'person' : 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E53935', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: {
          backgroundColor: '#FFFFFF', 
          borderTopColor: '#f0f0f0', 
          height: 60, 
          paddingBottom: Platform.OS === 'ios' ? 10 : 5, 
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        }
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Recettes" component={RecipesScreen} />
      <Tab.Screen name="Mes Recettes" component={MyRecipesScreen} />
      <Tab.Screen name="Mon Carnet" component={MyNotebookScreen} />
      <Tab.Screen name="Mon Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;