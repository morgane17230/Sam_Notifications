import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NativeBaseProvider, View } from "native-base";

import EventsNotifications from "./components/EventsNotifications";

export default function App() {

  return (
    <NativeBaseProvider>
    <View style={styles.container}>
      <EventsNotifications />
      <StatusBar style="auto" />
    </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
