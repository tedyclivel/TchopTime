// src/screens/ShoppingList.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading state
  SafeAreaView,      // Import SafeAreaView
  KeyboardAvoidingView, // For better keyboard handling
  Platform,          // For platform specific adjustments
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types'; // Ensure this path is correct
import { ShoppingItem } from '../types'; // Ensure this path is correct
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase'; // Ensure this path is correct
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

// Define the specific navigation prop type for this screen
type ShoppingListNavigationProp = NavigationProp<RootStackParamList, 'ShoppingList'>;

const ShoppingList = () => {
  const navigation = useNavigation<ShoppingListNavigationProp>();
  const { user } = useAuth(); // Get user from AuthContext
  const currentUserId = user?.uid; // Get the user's UID

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('1'); // Keep as string for TextInput
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (currentUserId) { // Only load if we have a user ID
      loadShoppingList();
    } else {
      // Handle case where user is not logged in
      setLoading(false);
      setError('Veuillez vous connecter pour gérer votre liste de courses.');
      // Optionally navigate to login or display a login prompt
    }
  }, [currentUserId]); // Reload list when user ID changes (e.g., login/logout)

  const loadShoppingList = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUserId) {
        throw new Error('User not authenticated.');
      }
      const q = query(
        collection(firestore, 'shoppingList'),
        where('userId', '==', currentUserId) // Use the actual user ID
      );
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData as ShoppingItem[]);
    } catch (err: any) {
      console.error('Error loading shopping list:', err);
      setError(`Impossible de charger la liste: ${err.message || err.toString()}`);
      Alert.alert('Erreur', `Impossible de charger la liste de courses: ${err.message || 'Une erreur inconnue est survenue.'}`);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le nom de l\'article.');
      return;
    }
    if (!currentUserId) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter des articles.');
      return;
    }

    setLoading(true); // Indicate adding item
    setError(null);
    try {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        Alert.alert('Erreur', 'La quantité doit être un nombre positif.');
        setLoading(false);
        return;
      }

      await addDoc(collection(firestore, 'shoppingList'), {
        name: newItem.trim(),
        quantity: parsedQuantity,
        notes: notes.trim(), // Trim notes as well
        checked: false,
        userId: currentUserId, // Use the actual user ID
        createdAt: new Date().toISOString(),
      });
      setNewItem('');
      setQuantity('1');
      setNotes('');
      await loadShoppingList(); // Reload the list to show new item
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(`Impossible d'ajouter l'article: ${err.message || err.toString()}`);
      Alert.alert('Erreur', `Impossible d'ajouter l'article: ${err.message || 'Une erreur inconnue est survenue.'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = async (itemId: string) => {
    setLoading(true); // Indicate update
    setError(null);
    try {
      const itemRef = doc(firestore, 'shoppingList', itemId);
      const item = items.find(i => i.id === itemId); // Use 'i' to avoid variable shadowing
      if (item) {
        await updateDoc(itemRef, {
          checked: !item.checked,
        });
        await loadShoppingList(); // Reload the list to reflect changes
      }
    } catch (err: any) {
      console.error('Error toggling check:', err);
      setError(`Impossible de modifier l'article: ${err.message || err.toString()}`);
      Alert.alert('Erreur', `Impossible de modifier l'article: ${err.message || 'Une erreur inconnue est survenue.'}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    Alert.alert(
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article de la liste ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true); // Indicate deletion
            setError(null);
            try {
              await deleteDoc(doc(firestore, 'shoppingList', itemId));
              await loadShoppingList(); // Reload the list
            } catch (err: any) {
              console.error('Error deleting item:', err);
              setError(`Impossible de supprimer l'article: ${err.message || err.toString()}`);
              Alert.alert('Erreur', `Impossible de supprimer l'article: ${err.message || 'Une erreur inconnue est survenue.'}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.checked && styles.checked,
        ]}
        onPress={() => toggleCheck(item.id)}
        accessibilityLabel={item.checked ? `Décocher ${item.name}` : `Cocher ${item.name}`}
      >
        {item.checked && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <Text style={[styles.itemName, item.checked && styles.itemCheckedText]}>{item.name}</Text>
        <View style={styles.itemDetails}>
          <Text style={[styles.quantity, item.checked && styles.itemCheckedText]}>x{item.quantity}</Text>
          {item.notes && <Text style={[styles.notes, item.checked && styles.itemCheckedText]}>Note: {item.notes}</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
        accessibilityLabel={`Supprimer ${item.name}`}
      >
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ma Liste de Courses</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'ingrédient..."
              value={newItem}
              onChangeText={setNewItem}
              returnKeyType="next"
              onSubmitEditing={() => { /* focus next input */ }}
              accessibilityLabel="Nom de l'article"
            />
            <TextInput
              style={styles.quantityInput}
              placeholder="Qté"
              value={quantity}
              onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ''))} // Only allow numbers
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={3}
              accessibilityLabel="Quantité"
            />
            <TextInput
              style={styles.notesInput}
              placeholder="Notes (facultatif)"
              value={notes}
              onChangeText={setNotes}
              returnKeyType="done"
              onSubmitEditing={addItem}
              accessibilityLabel="Notes de l'article"
            />
            <TouchableOpacity style={styles.addButton} onPress={addItem} accessibilityLabel="Ajouter l'article">
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && items.length === 0 ? (
          <Text style={styles.emptyListText}>Votre liste de courses est vide. Ajoutez un article !</Text>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
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
    backgroundColor: '#f8f9fa', // Lighter background for consistency
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 26, // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 15, // More space below title
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items
    marginBottom: 10,
  },
  input: {
    flex: 1, // Takes remaining space
    height: 50, // Taller input for easier tap
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10, // More rounded corners
    paddingHorizontal: 15,
    marginBottom: 10, // Space below input
    backgroundColor: '#f9f9f9',
  },
  quantityInput: {
    width: 70, // Fixed width for quantity
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginLeft: 8, // Margin to separate from name input
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  notesInput: {
    width: '100%', // Full width for notes
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15, // More space below notes
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#28a745', // Green for add button
    paddingVertical: 14, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', // Full width button
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    padding: 20,
    fontSize: 16,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding at the bottom of the scroll view
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10, // Space between items
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 28, // Larger checkbox
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF', // Solid border when checked
  },
  check: {
    color: '#fff',
    fontSize: 18, // Larger checkmark
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
    marginLeft: 15, // More space from checkbox
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600', // Slightly less bold
    color: '#333',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5, // More space below name
  },
  quantity: {
    fontSize: 15,
    marginRight: 10,
    color: '#666',
  },
  notes: {
    fontSize: 15,
    color: '#888',
  },
  itemCheckedText: {
    textDecorationLine: 'line-through',
    color: '#999', // Faded color when checked
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#FF3B30', // Red background for delete
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff', // White text on red button
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ShoppingList;