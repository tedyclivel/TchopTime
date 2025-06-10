import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';

interface PrivateRouteProps {
  children: React.ReactNode;
  route: RouteProp<any, any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, route }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
