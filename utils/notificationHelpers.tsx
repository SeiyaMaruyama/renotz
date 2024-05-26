import AsyncStorage from '@react-native-async-storage/async-storage';

export const getNotificationSettings = async (): Promise<{ [app: string]: boolean }> => {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : {};
  } catch (error) {
    console.error('Failed to load notification settings:', error);
    return {};
  }
};

export const saveNotificationSettings = async (settings: { [app: string]: boolean }) => {
  try {
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
};
