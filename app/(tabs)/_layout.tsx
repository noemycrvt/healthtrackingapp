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