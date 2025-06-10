import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView, // Ajouté pour gérer les encoches et barres de statut
  StatusBar,    // Ajouté pour personnaliser la barre de statut
  ActivityIndicator, // Ajouté pour l'état de chargement
  Alert,        // Pour les messages d'alerte
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // useFocusEffect pour recharger à l'arrivée
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importation correcte pour le type de navigation
import { RootStackParamList, FoodItem } from '../navigation/types'; // Assurez-vous que FoodItem est exporté de types.ts
import { collection, getDocs, addDoc, query, where, doc, deleteDoc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase'; // Assurez-vous que 'firestore' est correctement exporté
import { useAuth } from '../contexts/AuthContext'; // Assurez-vous que ce chemin est correct et que useAuth fournit l'ID utilisateur

// Définissez un type pour les repas planifiés pour inclure la date et l'ID du document Firestore
interface PlannedMeal {
  id: string; // L'ID du document dans la collection 'mealPlan'
  mealId: string; // L'ID de la recette (FoodItem)
  date: string; // Date au format ISO string
  userId: string;
  createdAt: string;
  // Vous pouvez aussi inclure les détails de la recette ici pour éviter des requêtes supplémentaires
  title: string;
  description: string;
  image?: string; // Optionnel
  // Ajoutez d'autres champs si nécessaire
}

type MealPlannerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealPlanner'>; // Spécifiez le nom de la route si vous l'ajoutez

const MealPlanner = () => {
  const navigation = useNavigation<MealPlannerNavigationProp>();
  const { user } = useAuth(); // Récupérer l'utilisateur connecté depuis le contexte d'authentification
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]); // Repas spécifiquement planifiés pour une date
  const [showAddMealModal, setShowAddMealModal] = useState(false); // Renommé pour plus de clarté
  const [availableRecipes, setAvailableRecipes] = useState<FoodItem[]>([]); // Recettes disponibles à ajouter
  const [loading, setLoading] = useState(true);
  const [loadingAvailableMeals, setLoadingAvailableMeals] = useState(false);

  // Utiliser useFocusEffect pour recharger les repas à chaque fois que l'écran est mis au point
  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) { // Assurez-vous que l'utilisateur est connecté
        loadPlannedMeals(selectedDate);
      } else {
        // Gérer le cas où l'utilisateur n'est pas connecté
        Alert.alert("Erreur", "Vous devez être connecté pour utiliser le planificateur de repas.");
        setPlannedMeals([]);
        setLoading(false);
      }
      return () => {
        // Optional cleanup
      };
    }, [selectedDate, user?.uid]) // Dépend de la date sélectionnée et de l'UID de l'utilisateur
  );

  const loadPlannedMeals = async (date: Date) => {
    if (!user?.uid) return; // Ne pas charger si l'utilisateur n'est pas connecté

    setLoading(true);
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(firestore, 'mealPlan'),
        where('userId', '==', user.uid),
        where('date', '>=', startOfDay.toISOString()),
        where('date', '<=', endOfDay.toISOString())
      );
      const querySnapshot = await getDocs(q);

      const fetchedPlannedMeals: PlannedMeal[] = [];
      const recipeIdsToFetch: string[] = [];

      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        fetchedPlannedMeals.push({
          id: doc.id, // L'ID du document dans mealPlan
          mealId: data.mealId,
          date: data.date,
          userId: data.userId,
          createdAt: data.createdAt,
          title: '', // Placeholder, to be filled from FoodItem
          description: '', // Placeholder
        });
        recipeIdsToFetch.push(data.mealId);
      });

      // Maintenant, récupérez les détails complets des recettes basés sur les mealId
      if (recipeIdsToFetch.length > 0) {
        const recipeQuerySnapshot = await getDocs(
          query(collection(firestore, 'recipes'), where('__name__', 'in', recipeIdsToFetch))
        );
        const recipesMap = new Map<string, FoodItem>();
        recipeQuerySnapshot.docs.forEach(doc => {
          recipesMap.set(doc.id, { id: doc.id, ...doc.data() } as FoodItem);
        });

        // Fusionnez les données des recettes dans les repas planifiés
        const finalPlannedMeals = fetchedPlannedMeals.map(plannedMeal => {
          const recipe = recipesMap.get(plannedMeal.mealId);
          return recipe ? { ...plannedMeal, title: recipe.title, description: recipe.description } : plannedMeal;
        });
        setPlannedMeals(finalPlannedMeals);
      } else {
        setPlannedMeals([]);
      }

    } catch (error) {
      console.error('Error loading planned meals:', error);
      Alert.alert('Erreur', 'Impossible de charger les repas planifiés.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRecipes = async () => {
    setLoadingAvailableMeals(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableRecipes(recipesData as FoodItem[]);
    } catch (error) {
      console.error('Error loading available recipes:', error);
      Alert.alert('Erreur', 'Impossible de charger les recettes disponibles.');
    } finally {
      setLoadingAvailableMeals(false);
    }
  };

  const addMealToPlan = async (recipe: FoodItem) => {
    if (!user?.uid) {
      Alert.alert("Erreur", "Vous devez être connecté pour ajouter un repas au plan.");
      return;
    }
    try {
      await addDoc(collection(firestore, 'mealPlan'), {
        mealId: recipe.id,
        date: selectedDate.toISOString(), // Stocker la date au format ISO string pour une comparaison facile
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setShowAddMealModal(false);
      loadPlannedMeals(selectedDate); // Recharger les repas pour la date actuelle
      Alert.alert('Succès', `${recipe.title} a été ajouté au plan!`);
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le repas au plan.');
    }
  };

  const removeMealFromPlan = async (plannedMealId: string) => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(firestore, 'mealPlan', plannedMealId));
      loadPlannedMeals(selectedDate); // Recharger les repas pour la date actuelle
      Alert.alert('Succès', 'Repas supprimé du plan.');
    } catch (error) {
      console.error('Error removing meal from plan:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le repas du plan.');
    }
  };

  const renderAvailableRecipeItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.availableMealItem}
      onPress={() => addMealToPlan(item)}
    >
      <Text style={styles.availableMealTitle}>{item.title}</Text>
      <Text style={styles.availableMealDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderPlannedMealItem = ({ item }: { item: PlannedMeal }) => (
    <View style={styles.plannedMealItem}>
      <View>
        <Text style={styles.plannedMealTitle}>{item.title}</Text>
        <Text style={styles.plannedMealDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeMealFromPlan(item.id)} // Utilisez l'ID du document planifié
      >
        <Text style={styles.removeButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planificateur de Repas</Text>
        </View>

        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => handleDateChange(-1)} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          <TouchableOpacity onPress={() => handleDateChange(1)} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() => {
            loadAvailableRecipes();
            setShowAddMealModal(true);
          }}
        >
          <Text style={styles.addMealButtonText}>Ajouter un repas</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Repas planifiés pour cette journée :</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
        ) : plannedMeals.length > 0 ? (
          <FlatList
            data={plannedMeals}
            renderItem={renderPlannedMealItem}
            keyExtractor={(item) => item.id}
            style={styles.plannedMealsList}
            contentContainerStyle={styles.listContentContainer}
          />
        ) : (
          <Text style={styles.noMealsText}>Aucun repas planifié pour cette date. Ajoutez-en un !</Text>
        )}
      </View>

      {/* Modal pour ajouter un repas */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showAddMealModal}
        onRequestClose={() => setShowAddMealModal(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choisir une recette</Text>
            {loadingAvailableMeals ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
            ) : availableRecipes.length > 0 ? (
              <FlatList
                data={availableRecipes}
                renderItem={renderAvailableRecipeItem}
                keyExtractor={(item) => item.id}
                style={styles.modalList}
                contentContainerStyle={styles.listContentContainer}
              />
            ) : (
              <Text style={styles.noMealsText}>Aucune recette disponible à ajouter.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddMealModal(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateNavButton: {
    padding: 10,
  },
  dateNavButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addMealButton: {
    backgroundColor: '#4CAF50', // Vert éclatant
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addMealButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  plannedMealsList: {
    flexGrow: 1, // Permet au contenu de défiler si plus grand que l'écran
  },
  listContentContainer: {
    paddingBottom: 20, // Espace en bas de la liste
  },
  plannedMealItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  plannedMealTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  plannedMealDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#FF3B30', // Rouge vif
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noMealsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
    fontStyle: 'italic',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40, // Espace pour la barre de statut et le titre du modal
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalList: {
    flex: 1,
  },
  availableMealItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  availableMealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  availableMealDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MealPlanner;