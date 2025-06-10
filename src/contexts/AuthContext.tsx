import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implémenter l'appel API pour la connexion
      // Pour l'instant, on simule une connexion réussie
      const mockUser: User = {
        id: '1',
        uid: '1',
        email,
        firstName: email.split('@')[0],
        lastName: 'User'
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      // TODO: Implémenter l'appel API pour l'inscription
      // Pour l'instant, on simule une inscription réussie
      const mockUser: User = {
        id: '1',
        uid: '1',
        email,
        firstName,
        lastName
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
