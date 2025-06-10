import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Obtenir la position actuelle
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Définir les mises à jour en continu
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Nettoyer la surveillance quand le composant est démonté
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return { location };
};
