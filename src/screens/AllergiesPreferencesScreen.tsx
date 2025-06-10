import React, { useState, useEffect } from 'react'; // Import useEffect
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAllergiesPreferences } from '../contexts/AllergiesPreferencesContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Import the UserPreferences interface from your context file
import { UserPreferences } from '../contexts/AllergiesPreferencesContext'; // Adjust path if necessary

type AllergiesPreferencesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllergiesPreferences'>;

const AllergiesPreferencesScreen = () => {
  const navigation = useNavigation<AllergiesPreferencesScreenNavigationProp>();
  const { preferences, updatePreferences, loading } = useAllergiesPreferences();

  // Initialize editingPreferences with actual preferences data only when it's available
  const [editingPreferences, setEditingPreferences] = useState<UserPreferences>({
    allergies: [],
    dietaryRestrictions: [],
    mealPreferences: { difficulty: 3, prepTime: 60 }, // Provide default values to match UserPreferences
  });

  // Use useEffect to update editingPreferences when preferences from context change
  useEffect(() => {
    if (preferences) {
      setEditingPreferences(preferences);
    }
  }, [preferences]); // Dependency array ensures this runs when 'preferences' from context changes

  const handleSave = async () => {
    try {
      await updatePreferences(editingPreferences);
      Alert.alert('Succès', 'Vos préférences ont été sauvegardées.');
      navigation.goBack();
    } catch (error) {
      console.error("Error saving preferences:", error); // Log the actual error
      Alert.alert('Erreur', 'Impossible de sauvegarder vos préférences.');
    }
  };

  // Generic handler for adding items to array-based preference categories
  const handleAddItem = (category: 'allergies' | 'dietaryRestrictions', item: string) => {
    // Ensure the category holds an array of strings
    if (Array.isArray(editingPreferences[category])) {
      setEditingPreferences((prev: { [x: string]: string[]; }) => {
        const currentItems = prev[category] as string[];
        if (!currentItems.includes(item)) { // Prevent duplicates
          return {
            ...prev,
            [category]: [...currentItems, item]
          };
        }
        return prev; // No change if item already exists
      });
    } else {
      console.warn(`Category ${String(category)} is not an array and cannot add item.`);
    }
  };

  // Generic handler for removing items from array-based preference categories
  const handleRemoveItem = (category: 'allergies' | 'dietaryRestrictions', item: string) => {
    if (Array.isArray(editingPreferences[category])) {
      setEditingPreferences((prev: { [x: string]: string[]; }) => ({
        ...prev,
        [category]: (prev[category] as string[]).filter(i => i !== item)
      }));
    } else {
      console.warn(`Category ${String(category)} is not an array and cannot remove item.`);
    }
  };

  // Specific handler for dietary restriction switches
  const handleDietaryRestrictionToggle = (restriction: 'vegetarian' | 'vegan', value: boolean) => {
    setEditingPreferences((prev: { dietaryRestrictions: any; }) => {
      const currentRestrictions = prev.dietaryRestrictions;
      if (value) {
        // Add if checked and not already present
        if (!currentRestrictions.includes(restriction)) {
          return {
            ...prev,
            dietaryRestrictions: [...currentRestrictions, restriction]
          };
        }
      } else {
        // Remove if unchecked
        return {
          ...prev,
          dietaryRestrictions: currentRestrictions.filter((item: string) => item !== restriction)
        };
      }
      return prev; // No change needed
    });
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Allergies</Text>
      {editingPreferences.allergies.map((allergy: string, index: number) => ( // Explicitly type allergy as string
        <View key={index} style={styles.item}>
          <Text>{allergy}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem('allergies', allergy)}
          >
            <Text style={styles.removeButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Ajouter une nouvelle allergie"
        onSubmitEditing={(e) => {
          handleAddItem('allergies', e.nativeEvent.text.trim()); // Trim whitespace
          e.currentTarget.setNativeProps({ text: '' }); // Clear input after adding
        }}
        blurOnSubmit={false} // Keep keyboard open for quick entry
      />

      <Text style={styles.sectionTitle}>Restrictions alimentaires</Text>
      <View style={styles.switchContainer}>
        <Switch
          value={editingPreferences.dietaryRestrictions.includes('vegetarian')}
          onValueChange={(value) => handleDietaryRestrictionToggle('vegetarian', value)}
        />
        <Text>Végétarien</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={editingPreferences.dietaryRestrictions.includes('vegan')}
          onValueChange={(value) => handleDietaryRestrictionToggle('vegan', value)}
        />
        <Text>Végétalien</Text>
      </View>

      {/* Example for meal preferences (if you want to add sliders/inputs later) */}
      <Text style={styles.sectionTitle}>Préférences de repas</Text>
      <View>
        <Text>Difficulté max: {editingPreferences.mealPreferences.difficulty}</Text>
        {/* Add slider or input for difficulty */}
        <Text>Temps de préparation max (min): {editingPreferences.mealPreferences.prepTime}</Text>
        {/* Add slider or input for prepTime */}
      </View>


      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Add a background color for better visibility
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333', // Darker text for titles
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out text and button
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8, // Slightly more rounded corners
    marginBottom: 8, // More space between items
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  removeButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#ffdddd', // Light red background for remove button
  },
  removeButtonText: {
    color: '#cc0000', // Darker red text
    fontWeight: '600',
  },
  input: {
    height: 45, // Slightly taller input
    borderColor: '#ccc', // Lighter border color
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 15,
    fontSize: 16, // Larger font size
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align switch to the right
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  saveButton: {
    backgroundColor: '#007bff', // A more modern blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30, // More space before button
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18, // Larger font
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllergiesPreferencesScreen;