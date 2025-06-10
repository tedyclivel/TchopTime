import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const images = [
  require('../../assets/backgroud.jpg'),
  require('../../assets/Ndolet.jpeg'),
  require('../../assets/YeovilleDinnerClub-10-1024x683.jpg'),
];

const messages = [
  "Un monde de saveurs dans un seul plat.",
  "Faites le tour du monde… sans quitter votre table.",
  "Comme à la maison, en mieux.",
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [index, setIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateText = () => {
    slideAnim.setValue(30); // commence en bas
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const next = (prevIndex + 1) % images.length;
        animateText();
        return next;
      });
    }, 5000);

    animateText(); // Animation initiale
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={images[index]}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>🍽️ Welcome to ChopTime</Text>
          <Text style={styles.subtitle}>{messages[index]}</Text>
        </Animated.View>

        {/* Redirection vers Login au lieu de Dashboard */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    paddingVertical: height * 0.1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
