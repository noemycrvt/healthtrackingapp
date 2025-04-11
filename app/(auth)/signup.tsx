import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router, Link } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Alert} from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingUser, setCheckingUser] = useState(true);
  const [name, setName] = useState('');

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
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim()) {
      console.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }


    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
  

    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: user.email,
      createdAt: new Date(),
    });
      
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
    return null; //shows a loading indicator
  }


  return (
    <View style={{ padding: 20 }}>
      <Text>Full Name</Text>
      <TextInput
      value={name}
      onChangeText={setName}
      autoCapitalize="words"
      style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Email</Text>
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
      <Text>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title="Sign Up" onPress={signUp}/>
      <Link href="/account" style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? Log in
      </Link>
    </View>
  );
}

