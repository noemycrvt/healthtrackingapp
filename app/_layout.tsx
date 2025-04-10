import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "./UserContext";

export default function RootLayout() {
  return (
  <UserProvider>
  <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="+not-found" />
  </Stack>
  </UserProvider>
  );
}
