import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { router, Link } from 'expo-router';
import { authStyles } from '../../styles/authStyles'; 

export default function AccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <View style={authStyles.container}>
      <View style={authStyles.formCard}>
        {user ? (
          <>
            <Text>Welcome, {user.email}</Text>
            <TouchableOpacity style={authStyles.button} onPress={logout}>
              <Text style={authStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={authStyles.input}
            />
  
            <Text style={authStyles.label}>Password</Text>
            <View style={authStyles.passwordWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[authStyles.input, authStyles.inputWithToggle]}
            />
            <TouchableOpacity
                style={authStyles.toggleButton}
                onPress={() => setShowPassword(prev => !prev)}>
                <Text style={authStyles.toggleText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={authStyles.button} onPress={login}>
              <Text style={authStyles.buttonText}>Login</Text>
            </TouchableOpacity>
  
            <Link href="/signup" style={authStyles.link}>
              Don’t have an account? Sign up
            </Link>
          </>
        )}
      </View>
    </View>
  );
}