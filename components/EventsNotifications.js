import React, { useState, useEffect } from "react";
import { Text, View, Button, Flex, Box } from "native-base";

import {
  initNotifications,
  notificationsClickedEvents,
  notificationsReceivedEvents,
} from "../services/expo-notification";

export default function EventsNotifications() {
  const [notification, setNotification] = useState({});
  const [notifications, setNotifications] = useState([]);

  const events = [
    {
      id: 1,
      name: "event1",
    },
    {
      id: 2,
      name: "event2",
    },
    {
      id: 3,
      name: "event3",
    },
  ];

  const handleNotification = (event) => {
    setNotification({});
    initNotifications("event", event, setNotification);

    notificationsReceivedEvents(setNotification);

    notificationsClickedEvents(setNotification);
  };

  useEffect(() => {
    if (notifications.length) {
      const index = notifications.findIndex(
        (n) => n?.sent?.id === notification?.sent?.id
      );
      console.log(index);
      if (index > -1) {
        notifications.splice(index, 1);
        setNotifications([...notifications, notification]);
      } else {
        setNotifications([...notifications, notification]);
      }
    } else {
      setNotifications([notification]);
    }
  }, [setNotifications, notification]);

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
          <Flex>
            <Button marginBottom={3} onPress={() => handleNotification(event)}>
              Envoyer une notification
            </Button>
            <Button>Supprimer une notification</Button>
            {notifications?.map((notif, index) => (
              <Flex key={index}>
                {(notif?.sent?.id === event.id ||
                  notification?.clicked?.request?.content?.id === event.id) && (
                  <>
                    <Text fontWeight="bold">{notif?.sent?.message}</Text>
                    <Box>
                      <Text fontWeight="bold">{notif?.received?.message}</Text>
                      <Text>{notif?.received?.request.content.data.id}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">{notif?.clicked?.message}</Text>
                      <Text>
                        {notif?.clicked?.notification.request.content.data.id}
                      </Text>
                    </Box>
                  </>
                )}
              </Flex>
            ))}
          </Flex>
        </View>
      ))}
    </View>
  );
}
