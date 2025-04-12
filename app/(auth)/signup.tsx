import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { router, Link } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { authStyles } from './authStyles'; 

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingUser, setCheckingUser] = useState(true);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
      Alert.alert('Missing Fields', 'Please fill out all fields.');
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
    <View style={authStyles.container}>
      <View style={authStyles.formCard}>
        <Text style={authStyles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={authStyles.input}
        />
  
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={authStyles.input}
        />
  
        <Text style={authStyles.label}>Password</Text>
        <View style={authStyles.passwordWrapper }>
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
  
        <Text style={authStyles.label}>Confirm Password</Text>
        <View style={authStyles.passwordWrapper}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry= {!showConfirmPassword}
          style={[authStyles.input, authStyles.inputWithToggle]}
        />
        <TouchableOpacity
          style={authStyles.toggleButton}
          onPress={() => setShowConfirmPassword(prev => !prev)}>
          <Text style={authStyles.toggleText}>
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
  
        <TouchableOpacity style={authStyles.button} onPress={signUp}>
          <Text style={authStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
  
        <Link href="/account" style={authStyles.link}>
          Already have an account? Log in
        </Link>
      </View>
    </View>
  );
}