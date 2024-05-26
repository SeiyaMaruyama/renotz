import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

type NotificationItem = {
  id: string;
  title: string | null;
  body: string | null;
  receivedAt: Date;
};


const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      const receivedAt = new Date();

      setNotifications(prevNotifications => [
        ...prevNotifications,
        { id: notification.request.identifier, title, body, receivedAt }
      ]);
    });

    return () => subscription.remove();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  const sortNotifications = () => {
    const sortedNotifications = [...notifications].sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
    setNotifications(sortedNotifications);
    setIsSorted(true);
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationTime}>{item.receivedAt.toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Sort Notifications" onPress={sortNotifications} disabled={isSorted} />
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 14,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationsScreen;
