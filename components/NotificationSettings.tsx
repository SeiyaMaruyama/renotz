import React, { useState, useEffect } from 'react';
import { View, Text, Switch, FlatList } from 'react-native';
import {getNotificationSettings, saveNotificationSettings} from "@/utils/notificationHelpers";

const NotificationSettings = () => {
  const [settings, setSettings] = useState<{ [app: string]: boolean }>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const savedSettings = await getNotificationSettings();
      setSettings(savedSettings);
    };

    fetchSettings();
  }, []);

  const toggleSetting = async (app: string) => {
    const newSettings = { ...settings, [app]: !settings[app] };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
  };

  const apps = ['LINE', 'Twitter', 'Facebook']; // サンプルアプリ名

  return (
    <View>
      <FlatList
        data={apps}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
            <Switch
              value={settings[item]}
              onValueChange={() => toggleSetting(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default NotificationSettings;
