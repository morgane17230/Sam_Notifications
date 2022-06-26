import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let responseListener = {};
let notificationListener = {};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// ENVOI DES NOTIFICATIONS VIA SCHEDULER
async function schedulePushNotification(data) {
  const trigger = Math.round(
    (data.date - new Date(new Date().setSeconds(0)).getTime() - 60000 * 5) /
      1000
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: data.name,
      body: `Here is the notification body ${new Date(data.date)}`,
      buttonTitle: "voir l'événement",
      data: { data: data.id },
    },
    trigger: {
      seconds: trigger,
    },
  });
}

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
    console.log(token);
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

// INITIALISATION D'UNE NOTIFICATION (FONCTION UTILISÉE DANS LE COMPOSANT NotificationScheduler)
export const initNotifications = (datas) => {
  registerForPushNotificationsAsync();

  // NOTIFICATION EST CREEE POUR CHAQUE DATA
  datas.map(async (data) => {
    await schedulePushNotification(data);
  });

  // EVENEMENT RECEPTION DE LA NOTIFICATION PAR L'UTILISATEUR
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("NOTIFICATION RECUE =>", notification);
    }
  );

  // EVENEMENT APPUI SUR LA NOTIFICATION PAR L'UTILISATEUR
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("L'UTILISATEUR APPUIE SUR LA NOTIF =>", response);
    });

  // SUPPRESSION ABONNEMENT AUX NOTIFICATIONS ENVOYEES
  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
};

/* Je n'ai pas réussi à implméneter des boutons sur la notif avec expo. Ils parlent beaucoup de IOS mais pas vraiment d'android. Donc pour le moment, je dispose des événements réception et appui sur la notification */
