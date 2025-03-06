import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const today = new Date()
const formattedDate = today.toLocaleDateString();

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={24}
            />
          ),
        })}
      />
    </Tabs>
  );
}