import React, { createContext, useContext, useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

interface ImageRecognitionContextType {
  recognizedIngredients: string[];
  recognizeImage: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ImageRecognitionContext = createContext<ImageRecognitionContextType | undefined>(undefined);

export const ImageRecognitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recognizedIngredients, setRecognizedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognizeImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permission refusée');
      }

      const result = await ImagePicker.launchCamera({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        includeBase64: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        // Réduire la taille de l'image pour l'envoi
        const resizedImage = await ImageResizer.createResizedImage(
          result.assets[0].uri,
          300,
          300,
          'JPEG',
          50
        );

        // Envoyer l'image à l'API de reconnaissance
        const formData = new FormData();
        formData.append('image', {
          uri: resizedImage.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });

        const response = await axios.post('https://api.foodai.org/recognize', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setRecognizedIngredients(response.data.ingredients);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageRecognitionContext.Provider value={{
      recognizedIngredients,
      recognizeImage,
      loading,
      error,
    }}>
      {children}
    </ImageRecognitionContext.Provider>
  );
};

export const useImageRecognition = () => {
  const context = useContext(ImageRecognitionContext);
  if (!context) {
    throw new Error('useImageRecognition must be used within an ImageRecognitionProvider');
  }
  return context;
};
