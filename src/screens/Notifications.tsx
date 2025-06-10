import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import PushNotification from 'react-native-push-notification';
import { collection, getDocs, addDoc, updateDoc, doc } from '@react-native-firebase/firestore';
import { firestore } from '../config/firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'reminder' | 'update';
  read: boolean;
  timestamp: string;
}

const Notifications = () => {
  const navigation = useNavigation<RootStackParamList>();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    configureNotifications();
    loadNotifications();
  }, []);

  const configureNotifications = () => {
    PushNotification.configure({
      onNotification: (notification: any) => {
        console.log('NOTIFICATION:', notification);
        // Process the notification
        handleNotification(notification);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const loadNotifications = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'notifications'));
      const notificationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsData as Notification[]);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotification = async (notification: any) => {
    try {
      await addDoc(collection(firestore, 'notifications'), {
        title: notification.title,
        message: notification.message,
        type: notification.type || 'update',
        read: false,
        timestamp: new Date().toISOString(),
      });
      loadNotifications();
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unread,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          {notifications.filter(n => !n.read).length} non lues
        </Text>
      </View>

      <FlatList
        data={notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unread: {
    backgroundColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default Notifications;
