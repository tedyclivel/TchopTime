import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase'; // Assurez-vous que ce chemin est correct
import { useAuth } from './AuthContext'; // Assurez-vous que ce chemin est correct

// Define an interface for the review data structure
interface ReviewData {
  userId: string;
  recipeId: string;
  rating: number; // Add the rating property explicitly
  comment?: string; // Assuming comments are optional
  createdAt: string;
  updatedAt: string;
  // Add any other fields your review documents might have
}

// Define an interface for a review item retrieved from Firestore (includes id)
interface ReviewItem extends ReviewData {
  id: string; // The Firestore document ID
}

interface ReviewContextType {
  reviews: ReviewItem[]; // Use the new ReviewItem type
  addReview: (recipeId: string, review: Omit<ReviewData, 'userId' | 'recipeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReview: (recipeId: string, review: Partial<Omit<ReviewData, 'userId' | 'recipeId' | 'createdAt'>>) => Promise<void>; // Allow partial updates
  loading: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]); // Initialize with ReviewItem[]
  const [loading, setLoading] = useState(false);

  // You might want to load reviews for the current user/recipes on mount
  // However, your current implementation adds/updates reviews directly.
  // A typical pattern would be to fetch reviews for a specific recipe when viewing it.
  // For simplicity, this context manages adding/updating, and `useReview` consumers would fetch.

  const addReview = async (recipeId: string, review: Omit<ReviewData, 'userId' | 'recipeId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.uid) {
      console.warn("User not authenticated. Cannot add review.");
      return;
    }
    setLoading(true);
    try {
      const newReviewRef = doc(collection(firestore, 'reviews')); // Generate a new document reference
      const newReviewData: ReviewData = { // Ensure the data conforms to ReviewData
        ...review,
        userId: user.uid,
        recipeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(newReviewRef, newReviewData); // Use setDoc with the new reference

      // Mettre à jour la note moyenne de la recette
      await updateRecipeAverageRating(recipeId);

      // Add the new review to the local state (optional, depending on how you display reviews)
      setReviews(prev => [...prev, { id: newReviewRef.id, ...newReviewData }]);
    } catch (error) {
      console.error('Error adding review:', error);
      // You might want to throw the error or return a status to the caller
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (recipeId: string, reviewPartial: Partial<Omit<ReviewData, 'userId' | 'recipeId' | 'createdAt'>>) => {
    if (!user?.uid) {
      console.warn("User not authenticated. Cannot update review.");
      return;
    }
    setLoading(true);
    try {
      const reviewsRef = collection(firestore, 'reviews');
      // Query for the specific review by user and recipe
      const reviewQuery = query(
        reviewsRef,
        where('userId', '==', user.uid),
        where('recipeId', '==', recipeId)
      );
      const reviewSnapshot = await getDocs(reviewQuery);

      if (!reviewSnapshot.empty) {
        // Assuming there's only one review per user per recipe
        const reviewDocId = reviewSnapshot.docs[0].id;
        const reviewRef = doc(reviewsRef, reviewDocId);

        const updatedReviewData = {
          ...reviewPartial, // Apply partial updates
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(reviewRef, updatedReviewData);

        // Mettre à jour la note moyenne de la recette
        await updateRecipeAverageRating(recipeId);

        // Update local state (optional)
        setReviews(prev =>
          prev.map(r =>
            r.recipeId === recipeId && r.userId === user.uid
              ? { ...r, ...updatedReviewData } as ReviewItem // Ensure type consistency
              : r
          )
        );
      } else {
        console.warn("No existing review found for this user and recipe to update.");
        // Optionally, you could call addReview here if no review exists
      }
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update recipe's average rating
  const updateRecipeAverageRating = async (recipeId: string) => {
    try {
      const reviewsForRecipeQuery = query(
        collection(firestore, 'reviews'),
        where('recipeId', '==', recipeId)
      );
      const recipeReviewsSnapshot = await getDocs(reviewsForRecipeQuery);

      const allReviewsForRecipe: ReviewItem[] = recipeReviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as ReviewData // Explicitly cast doc.data() to ReviewData
      }));

      let averageRating = 0;
      if (allReviewsForRecipe.length > 0) {
        averageRating = allReviewsForRecipe.reduce((sum, r) => sum + r.rating, 0) / allReviewsForRecipe.length;
      }

      const recipeRef = doc(firestore, 'recipes', recipeId);
      await updateDoc(recipeRef, { popularity: averageRating });
    } catch (error) {
      console.error('Error updating recipe average rating:', error);
    }
  };


  return (
    <ReviewContext.Provider value={{ reviews, addReview, updateReview, loading }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};