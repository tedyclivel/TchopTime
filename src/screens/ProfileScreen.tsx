import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackNavigationProp } from '../navigation/types';

interface ProfileScreenProps {
  navigation: RootStackNavigationProp<'Profile'>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.message}>Please login to view your profile</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{`${user.firstName} ${user.lastName}`}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#C64357',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#C64357',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
