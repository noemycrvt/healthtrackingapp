import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
  <UserProvider>
  <Stack>
    <Stack.Screen name="(tabs)" options={{ title: "Home", headerShown: false }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="+not-found" />
    <Stack.Screen name="medications" options={{ title: "Medications" }} />
  </Stack>
  </UserProvider>
  );
}
