import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Pressable, View, Modal, Text, Button } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function TabLayout() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/(auth)/account');
      } else {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserName(docSnap.data().name || '');
          }
        } catch (err) {
          console.warn('Failed to fetch user profile:', err);
        }
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setProfileVisible(false);
    router.replace('/(auth)/account');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          headerLeft: () => (
            <Pressable
              onPress={() => setProfileVisible(true)}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="person-circle-outline" size={24} color="#000" />
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home-sharp' : 'home-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={({ route }) => ({
            headerTitle: route.params?.selectedDay ?? 'Today',
            title: 'Calendar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                color={color}
                size={24}
              />
            ),
          })}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'journal' : 'journal-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>

      <Modal
        visible={profileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000aa',
          }}
        >
          <View
            style={{
              width: '80%',
              maxWidth: 400,
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              Hi, {userName || 'Guest'}!
            </Text>
            <View style={{ width: '100%', marginBottom: 10 }}>
              <Button title="LOGOUT" onPress={logout} color="#6699FF" />
            </View>
            <View style={{ width: '100%' }}>
              <Button
                title="CLOSE"
                onPress={() => setProfileVisible(false)}
                color="#6699FF"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Toast position="top" />
    </>
  );
}
