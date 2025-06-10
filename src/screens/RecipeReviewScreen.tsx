import React, { useState, FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useReview } from '../contexts/ReviewContext';
import { FoodItem } from '../navigation/types';

type RecipeReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeReview'>;

const RecipeReviewScreen = ({ route }: NativeStackScreenProps<RootStackParamList, 'RecipeReview'>) => {
  const navigation = useNavigation<RecipeReviewScreenNavigationProp>();
  const { reviews, addReview, updateReview, loading } = useReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showPhoto, setShowPhoto] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleAddPhoto = async () => {
    // TODO: Implémenter la prise de photo
    setShowPhoto(true);
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert('Veuillez donner une note.');
      return;
    }

    if (!route.params.foodItem) return;

    const review = {
      rating,
      comment,
      photo: photo || null,
      recipeId: route.params.foodItem.id
    };

    try {
      await addReview(route.params.foodItem.id, review);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Une erreur est survenue lors de l\'envoi du commentaire.');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)}
          style={styles.starContainer}
        >
          <Image
            source={require('../assets/star.png')}
            style={[
              styles.star,
              i <= rating && styles.filledStar
            ]}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Évaluer la recette</Text>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Notez cette recette</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>

      <View style={styles.commentContainer}>
        <Text style={styles.commentText}>Ajoutez un commentaire</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          placeholder="Partagez votre expérience..."
        />
      </View>

      <TouchableOpacity
        style={styles.photoButton}
        onPress={handleAddPhoto}
      >
        <Text style={styles.photoButtonText}>Ajouter une photo</Text>
      </TouchableOpacity>

      {showPhoto && (
        <View style={styles.photoPreview}>
          <Text style={styles.photoPreviewText}>Prévisualisation de la photo</Text>
          {/* TODO: Afficher la photo */}
        </View>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Envoyer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    marginBottom: 30,
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starContainer: {
    marginHorizontal: 5,
  },
  star: {
    width: 30,
    height: 30,
    tintColor: '#ddd',
  },
  filledStar: {
    tintColor: '#FFD700',
  },
  commentContainer: {
    marginBottom: 30,
  },
  commentText: {
    fontSize: 18,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
  },
  photoButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  photoPreview: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  photoPreviewText: {
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeReviewScreen;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

