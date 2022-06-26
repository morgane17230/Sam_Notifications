import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { initNotifications } from "../services/expo-notification";

export default function NotificationScheduler() {
  const [notification, setNotification] = useState();
  const events = [
    {
      id: 1,
      name: "event1",
      date: new Date(new Date(new Date().setSeconds(0)).getTime() + 60000 * 6),
    },
    {
      id: 2,
      name: "event2",
      date: new Date(new Date(new Date().setSeconds(0)).getTime() + 60000 * 7),
    },
    {
      id: 3,
      name: "event3",
      date: new Date(new Date(new Date().setSeconds(0)).getTime() + 60000 * 8),
    },
  ];

  useEffect(() => {
    initNotifications(events);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {events.map((event) => (
        <View key={event.id}>
          <Text>{event.name}</Text>
          <Text>{new Date(event.date).toString()}</Text>
          <View>{notification}</View>
        </View>
      ))}
    </View>
  );
}
