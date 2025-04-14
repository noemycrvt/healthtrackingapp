import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useMedicationNotes } from './MedicationNotes';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';



interface Props {
  onSave: () => void;
  onCancel: () => void;
  existingEntry?: any;
  isEditMode?: boolean;
}

export default function JournalEntry({ onSave, onCancel, existingEntry, isEditMode = true }: Props) {
  const [journalEntry, setJournalEntry] = useState(existingEntry?.journalEntry || '');
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [moodRating, setMoodRating] = useState(existingEntry?.moodRating ?? 3);
  const [painRating, setPainRating] = useState(existingEntry?.painRating ?? 2);
  const [energyRating, setEnergyRating] = useState(existingEntry?.energyRating ?? 4);
  const [anxietyRating, setAnxietyRating] = useState(existingEntry?.anxietyRating ?? 3);
  

  const {
    selectedEffects,
    toggleEffect,
    effectiveness,
    setEffectiveness,
    sideEffects,
    setSideEffects,
    newEffect,
    setNewEffect,
    isAdding,
    setIsAdding,
    addCustomEffect,
    deleteEffect,
    setSelectedEffects,
  } = useMedicationNotes();


  useEffect(() => {
    if (existingEntry?.selectedEffects) setSelectedEffects(existingEntry.selectedEffects);
    if (existingEntry?.effectiveness) setEffectiveness(existingEntry.effectiveness);
    if (existingEntry?.sideEffects) {
      setSideEffects(existingEntry.sideEffects);
    }
  }, [existingEntry]);

  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊'];
  const painEmojis = ['😊', '🙂', '😐', '😔', '😞'];
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const data = {
      date: existingEntry?.date || new Date().toISOString(),
      journalEntry,
      moodRating,
      painRating,
      energyRating,
      anxietyRating,
      selectedEffects,
      effectiveness,
      sideEffects,
    };

    console.log("Saving entry:", {
      journalEntry,
      moodRating,
      painRating,
      energyRating,
      anxietyRating,
      selectedEffects,
      effectiveness,
    });

    try {
      if (existingEntry?.id) {
        const ref = doc(db, 'users', user.uid, 'journalEntries', existingEntry.id);
        await updateDoc(ref, data);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'journalEntries'), data);
      }
      onSave();
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  return (
    <ScrollView className="flex-1 px-4 pt-16" showsVerticalScrollIndicator={false}>
      <View className="mb-4">
        <Text className="text-2xl font-semibold text-gray-800">{formattedDate}</Text>
      </View>

      {/* Wellness Metrics */}
      <View className="bg-white rounded-md shadow p-4 mb-4">
        <Text className="text-lg font-bold mb-1">How are you feeling today?</Text>
        <Text className="text-xs text-gray-500 mb-4">Track your wellness metrics</Text>

        {/* Mood */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium">Mood</Text>
            <Text className="text-2xl">{moodEmojis[moodRating]}</Text>
          </View>
          <Slider style={{ width: '100%' }} minimumValue={0} maximumValue={4} step={1} value={moodRating} onValueChange={setMoodRating} disabled={!isEditing} />
          <View className="flex-row justify-between text-xs">
            <Text className="text-xs text-gray-500">Low</Text>
            <Text className="text-xs text-gray-500">High</Text>
          </View>
        </View>

        {/* Pain */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium">Pain Level</Text>
            <Text className="text-2xl">{painEmojis[painRating]}</Text>
          </View>
          <Slider style={{ width: '100%' }} minimumValue={0} maximumValue={4} step={1} value={painRating} onValueChange={setPainRating} disabled={!isEditing} />
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">None</Text>
            <Text className="text-xs text-gray-500">Severe</Text>
          </View>
        </View>

        {/* Energy */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium">Energy Level</Text>
            <View className="w-24 bg-blue-100 rounded-full h-5 overflow-hidden">
              <View className="bg-blue-500 h-5" style={{ width: `${(energyRating / 4) * 100}%` }} />
            </View>
          </View>
          <Slider style={{ width: '100%' }} minimumValue={0} maximumValue={4} step={1} value={energyRating} onValueChange={setEnergyRating} disabled={!isEditing} />
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">Low</Text>
            <Text className="text-xs text-gray-500">High</Text>
          </View>
        </View>

        {/* Anxiety */}
        <View>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium">Anxiety Level</Text>
            <View className="w-24 bg-yellow-100 rounded-full h-5 overflow-hidden">
              <View className="bg-yellow-500 h-5" style={{ width: `${(anxietyRating / 4) * 100}%` }} />
            </View>
          </View>
          <Slider style={{ width: '100%' }} minimumValue={0} maximumValue={4} step={1} value={anxietyRating} onValueChange={setAnxietyRating} disabled={!isEditing} />
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">Low</Text>
            <Text className="text-xs text-gray-500">High</Text>
          </View>
        </View>
      </View>

      {/* Journal Entry */}
      <View className="bg-white rounded-md shadow p-4 mb-4">
        <View className="flex-row items-center justify-between pb-2">
          <View>
            <Text className="text-lg font-bold">Journal Entry</Text>
            <Text className="text-xs text-gray-500">How are you feeling today?</Text>
          </View>
          <Pressable onPress={() => setIsEditing((prev) => !prev)} className="p-2">
            <Ionicons name={isEditing ? 'save-outline' : 'create-outline'} size={20} color="black" />
          </Pressable>
        </View>

        {isEditing ? (
          <TextInput
            multiline
            autoFocus
            placeholder="Write about how you're feeling today, any side effects, etc..."
            value={journalEntry}
            onChangeText={setJournalEntry}
            className="min-h-[150px] text-sm border border-gray-200 rounded p-2"
          />
        ) : journalEntry ? (
          <Text className="text-sm whitespace-pre-line">{journalEntry}</Text>
        ) : (
          <View className="items-center justify-center py-8">
            <Ionicons name="create-outline" size={32} color="gray" />
            <Text className="text-gray-400 mt-2 text-center">
              Tap the edit button to start writing your journal entry
            </Text>
          </View>
        )}
      </View>

      {/* Side Effects */}
      <View className="bg-white rounded-md shadow p-4 mb-4">
        <Text className="text-lg font-bold">Medication Notes</Text>
        <Text className="text-xs text-gray-500 mb-2">Track side effects or concerns</Text>

        {sideEffects.map((effect) => (
          <View key={effect} className="flex-row items-center justify-between bg-gray-100 p-3 mt-2 rounded-lg">
            <Pressable onPress={() => isEditing && toggleEffect(effect)} className="flex-row items-center gap-2">
              <View className={`w-4 h-4 border rounded ${selectedEffects.includes(effect) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}`} />
              <Text className="text-sm">{effect}</Text>
            </Pressable>
            {isEditing && (
              <Pressable onPress={() => deleteEffect(effect)}>
                <Ionicons name="close-circle-outline" size={20} color="gray" />
              </Pressable>
            )}
          </View>
        ))}

        {isEditing && (isAdding ? (
          <View className="flex-row items-center mt-2 gap-2">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter custom side effect"
              value={newEffect}
              onChangeText={setNewEffect}
            />
            <Pressable onPress={addCustomEffect} className="bg-blue-500 px-3 py-2 rounded-lg">
              <Text className="text-white text-sm">Add</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg flex-row items-center justify-center"
            onPress={() => setIsAdding(true)}
          >
            <Ionicons name="add-outline" size={18} color="black" />
            <Text className="text-sm ml-2">Add Custom Side Effect</Text>
          </Pressable>
        ))}

        <View className="flex-row justify-between gap-2 mt-2">
          {['Not Working', 'Somewhat', 'Very Effective'].map((label) => (
            <Pressable
              key={label}
              onPress={() => isEditing && setEffectiveness(label)}
              className={`flex-1 py-3 items-center border rounded-lg ${effectiveness === label ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
            >
              <Text>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between gap-6 px-2 mb-8">
        <Pressable onPress={onCancel} className="flex-1 py-3 bg-gray-200 rounded-lg items-center">
          <Text className="text-black">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          className="flex-1 py-3 bg-blue-500 rounded-lg items-center"
        >
          <Text className="text-white">Save</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
