import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let state = {
  sent: {},
  received: {},
  clicked: {},
};

// CONFIGURATION DES NOTIFICATIONS
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}

export const initNotifications = async (type, data, setNotification) => {
  state = {}

  registerForPushNotificationsAsync();

  const options = [
    {
      type: "event",
      content: {
        title: data.name,
        body: `Here is the notification n°${data.id}`,
        buttonTitle: "voir l'événement",
        data,
      },
      trigger: { seconds: 3 },
    },
  ];

  const currentOptions = options.find((options) => options.type === type);

  // ENVOI DES NOTIFICATIONS VIA SCHEDULER
  await Notifications.scheduleNotificationAsync(currentOptions);
  state = {
    ...state,
    sent: { message: "Notification planifiée", id: data.id },
  };
  setNotification({...state});
};

export const notificationsReceivedEvents = (setNotification) => {
  // EVENEMENT RECEPTION DE LA NOTIFICATION PAR L'UTILISATEUR
  Notifications.addNotificationReceivedListener((notification) => {
    state = {
      ...state,
      received: { ...notification, message: "Notification reçue"},
    };
    setNotification({...state});
  });
};

export const notificationsClickedEvents = (setNotification) => {
  // EVENEMENT APPUI SUR LA NOTIFICATION PAR L'UTILISATEUR
  Notifications.addNotificationResponseReceivedListener((response) => {
    state = {
      ...state,
      clicked: { ...response, message: "Notification cliquée"},
    };
    setNotification({...state});
  });
};
