import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="account"
        options={{ title: 'LOGIN', headerBackVisible: false }}
      />
      <Stack.Screen
        name="signup"
        options={{ title: 'SIGN UP', headerBackVisible: false }}
      />
    </Stack>
  );
}

