// app/signup.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router, Link } from 'expo-router';


export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingUser, setCheckingUser] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/');
      } else {
        setCheckingUser(false);
      }
    });
    return unsubscribe;
  }, []);


  const signUp = async () => {
      console.log("Sign up button clicked");
      console.log("Creating account with:", email, password);


    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }


    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }


    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/'); // Redirect after signup
    } catch (error: any) {
      let message = error.message;


      if (error.code === 'auth/email-already-in-use') {
        message = 'That email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }


      Alert.alert('Sign Up Failed', message);
    }
  };


  if (checkingUser) {
    console.log('Still checking auth status...');
    return null; // Optional: show a loading indicator instead
  }


  return (
    <View style={{ padding: 20 }}>
      <Text>Valid Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title="Sign Up" onPress={signUp} />
      <Link href="/account" style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? Log in
      </Link>
    </View>
  );
}

