import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // adjust the path if needed
import { router } from 'expo-router';


const today = new Date()
const formattedDate = today.toLocaleDateString();

export default function TabLayout() {
  useEffect(() => {
    let isMounted = true;
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted && !user) {
        router.replace('/(auth)/account');
      }
    });
  
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/account')}
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
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={({ route }) => ({
          // If route.params?.selectedDay is set, use that. Otherwise 'Calendar'.
          headerTitle: route.params?.selectedDay ?? 'Today',
          title: "Calendar",
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
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'journal' : 'journal-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}