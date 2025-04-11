import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { Link } from 'expo-router';

export default function AccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        router.replace('/'); // Auto-redirect logged-in users
      }
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    Alert.alert('Logged Out');
    router.replace('/account');
  };

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text>Welcome, {user.email}</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <>
          <Text>Email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
          <Text>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 20, padding: 8 }} />
          <Button title="Login" onPress={login} />
          <Link href="/signup" style={{ marginTop: 16, textAlign: 'center' }}>Don’t have an account? Sign up</Link>
        </>
      )}
    </View>
  );
}
