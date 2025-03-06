import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

export default function JournalPage() {
  // State for the journal page
  const [journalEntry, setJournalEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [moodRating, setMoodRating] = useState(3);
  const [painRating, setPainRating] = useState(2);
  const [energyRating, setEnergyRating] = useState(4);
  const [anxietyRating, setAnxietyRating] = useState(3);

  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊'];
  const painEmojis = ['😊', '🙂', '😐', '😔', '😞'];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View className="flex-1 bg-white">
      {/* MAIN CONTENT SCROLLABLE */}
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>

        {/* WELLNESS METRICS CARD */}
        <View className="bg-white rounded-md shadow p-4 mb-4">
          <Text className="text-lg font-bold mb-1">How are you feeling today?</Text>
          <Text className="text-xs text-gray-500 mb-4">Track your wellness metrics</Text>

          {/* MOOD RATING */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium">Mood</Text>
              <Text className="text-2xl">{moodEmojis[moodRating]}</Text>
            </View>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={moodRating}
              onValueChange={(val) => setMoodRating(val)}
            />
            <View className="flex-row justify-between text-xs">
              <Text className="text-xs text-gray-500">Low</Text>
              <Text className="text-xs text-gray-500">High</Text>
            </View>
          </View>

          {/* PAIN RATING */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium">Pain Level</Text>
              <Text className="text-2xl">{painEmojis[painRating]}</Text>
            </View>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={painRating}
              onValueChange={(val) => setPainRating(val)}
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">None</Text>
              <Text className="text-xs text-gray-500">Severe</Text>
            </View>
          </View>

          {/* ENERGY RATING */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium">Energy Level</Text>
              <View className="w-24 bg-blue-100 rounded-full h-5 overflow-hidden">
                <View
                  className="bg-blue-500 h-5"
                  style={{ width: `${(energyRating / 4) * 100}%` }}
                />
              </View>
            </View>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={energyRating}
              onValueChange={(val) => setEnergyRating(val)}
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">Low</Text>
              <Text className="text-xs text-gray-500">High</Text>
            </View>
          </View>

          {/* ANXIETY RATING */}
          <View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium">Anxiety Level</Text>
              <View className="w-24 bg-yellow-100 rounded-full h-5 overflow-hidden">
                <View
                  className="bg-yellow-500 h-5"
                  style={{ width: `${(anxietyRating / 4) * 100}%` }}
                />
              </View>
            </View>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={anxietyRating}
              onValueChange={(val) => setAnxietyRating(val)}
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">Low</Text>
              <Text className="text-xs text-gray-500">High</Text>
            </View>
          </View>
        </View>

        {/* JOURNAL ENTRY CARD */}
        <View className="bg-white rounded-md shadow p-4 mb-4">
          <View className="flex-row items-center justify-between pb-2">
            <View>
              <Text className="text-lg font-bold">Journal Entry</Text>
              <Text className="text-xs text-gray-500">How are you feeling today?</Text>
            </View>
            <Pressable
              className="p-2"
              onPress={() => {
                // Toggle editing
                if (isEditing) {
                  // Optionally save logic here
                }
                setIsEditing(!isEditing);
              }}
            >
              <Ionicons name={isEditing ? 'save-outline' : 'create-outline'} size={20} color="black" />
            </Pressable>
          </View>

          {/* If editing, show a TextInput, else show existing text or placeholder */}
          {isEditing ? (
            <TextInput
              multiline
              placeholder="Write about how you're feeling today, any side effects, etc..."
              value={journalEntry}
              onChangeText={(text) => setJournalEntry(text)}
              className="min-h-[150px] text-sm border border-gray-200 rounded p-2"
            />
          ) : journalEntry ? (
            <Text className="text-sm">{journalEntry}</Text>
          ) : (
            <View className="items-center justify-center py-8">
              <Ionicons name="create-outline" size={32} color="gray" />
              <Text className="text-gray-400 mt-2 text-center">
                Tap the edit button to start writing your journal entry
              </Text>
            </View>
          )}
        </View>

        {/* MEDICATION NOTES (Tabs Example) */}
        <View className="bg-white rounded-md shadow p-4 mb-4">
          <Text className="text-lg font-bold">Medication Notes</Text>
          <Text className="text-xs text-gray-500 mb-2">Track side effects or concerns</Text>

          {/* For simplicity, let’s just show a "Side Effects" section + "Effectiveness" section. 
              You could create a "Tabs" system with react-navigation or your own custom logic. */}
          
          {/* Side Effects */}
          <Text className="text-sm font-semibold mt-2">Side Effects</Text>
          <View className="flex-row items-center gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
            {/* Fake checkbox. Use <Switch> or a custom Pressable. */}
            <Pressable className="w-4 h-4 bg-white border border-gray-400 rounded" />
            <Text className="text-sm">Headache</Text>
          </View>
          <View className="flex-row items-center gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
            <Pressable className="w-4 h-4 bg-white border border-gray-400 rounded" />
            <Text className="text-sm">Nausea</Text>
          </View>
          <View className="flex-row items-center gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
            <Pressable className="w-4 h-4 bg-white border border-gray-400 rounded" />
            <Text className="text-sm">Dizziness</Text>
          </View>
          <View className="flex-row items-center gap-2 bg-gray-100 p-3 mt-2 rounded-lg">
            <Pressable className="w-4 h-4 bg-white border border-gray-400 rounded" />
            <Text className="text-sm">Fatigue</Text>
          </View>
          <Pressable
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg flex-row items-center justify-center"
            onPress={() => { /* Add side effect logic */ }}
          >
            <Ionicons name="add-outline" size={18} color="black" />
            <Text className="text-sm ml-2">Add Custom Side Effect</Text>
          </Pressable>

          {/* Effectiveness */}
          <Text className="text-sm font-semibold mt-4">Effectiveness</Text>
          <Text className="text-xs text-gray-500">
            How effective was your medication today?
          </Text>
          <View className="flex-row justify-between gap-2 mt-2">
            <Pressable className="flex-1 py-3 items-center border border-gray-300 rounded-lg">
              <Text>Not Working</Text>
            </Pressable>
            <Pressable className="flex-1 py-3 items-center border border-gray-300 rounded-lg">
              <Text>Somewhat</Text>
            </Pressable>
            <Pressable className="flex-1 py-3 items-center border border-gray-300 rounded-lg">
              <Text>Very Effective</Text>
            </Pressable>
          </View>
        </View>

        {/* AI INSIGHTS */}
        <View className="bg-blue-50 rounded-md shadow p-4 mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="happy-outline" size={20} color="#00f" />
            <Text className="text-blue-600 font-bold text-base">
              AI Wellness Insights
            </Text>
          </View>
          <Text className="text-sm">
            Based on your journal entries this week, your mood seems to improve
            on days when you take your medication consistently. Your anxiety
            levels are also lower on days when you report higher energy levels.
          </Text>
          <Pressable
            className="border border-blue-600 rounded-md p-3 mt-3 items-center"
            onPress={() => {
              // e.g., navigate to "Detailed Analysis" screen
            }}
          >
            <Text className="text-blue-600">View Detailed Analysis</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}