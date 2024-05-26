import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Notification } from 'expo-notifications';// Notificationの型をインポート
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotificationSettings } from '../../utils/notificationHelpers';

const methodTest = () => {
  useEffect(() => {
    const handleNotification = async (notification: Notification) => {
      const newNotification = {
        id: notification.request.identifier,
        title: notification.request.content.title || '',
        body: notification.request.content.body || '',
        receivedAt: new Date().toISOString(),
        appName: notification.request.content.data.appName as string,
      };

      const settings = await getNotificationSettings();
      if (settings[newNotification.appName]) {
        try {
          const storedNotifications = await AsyncStorage.getItem('notifications');
          const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

          notifications.push(newNotification);

          await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (error) {
          console.error('Failed to save notification:', error);
        }
      }
    };

    const subscription = Notifications.addNotificationReceivedListener(handleNotification);
    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>Notifications App</Text>
    </View>
  );
};

export default methodTest;
