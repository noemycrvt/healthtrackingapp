import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format } from "date-fns";
import uuid from "react-native-uuid";
import { MedicationDose } from "../types/MedicationDose";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  onClose: () => void;
  onSave: (dose: MedicationDose) => void;
}

export default function AddDoseModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [time, setTime] = useState(new Date());
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [totalDoses, setTotalDoses] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (index: number) => {
    setRepeatDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
    );
  };

  const handleSave = async () => {
    if (isSaving || !totalDoses) return;
    setIsSaving(true);

    Toast.hide();
    Toast.show({
      type: 'info',
      text1: `Saving ${totalDoses} doses for: ${name}`,
    });

    const user = auth.currentUser;
    if (!user) {
      Toast.show({ type: 'error', text1: 'User not logged in' });
      return;
    }

    const parsedDoses = parseInt(totalDoses, 10);
    const medicationId = uuid.v4().toString(); // ✅ shared ID for all generated doses
    const doses: MedicationDose[] = [];
    let currentDate = new Date();

    while (doses.length < parsedDoses) {
      if (repeatDays.includes(currentDate.getDay())) {
        const doseDateTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          time.getHours(),
          time.getMinutes()
        );

        doses.push({
          id: uuid.v4().toString(),
          medicationId,
          name,
          details,
          time: doseDateTime.toISOString(),
          date: format(doseDateTime, 'yyyy-MM-dd'),
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
      currentDate = addDays(currentDate, 1);
    }

    try {
      const userMedRef = collection(db, 'users', user.uid, 'medications');
      await Promise.all(doses.map(dose => addDoc(userMedRef, dose)));
      doses.forEach(onSave); // locally push each one
      Toast.show({ type: 'success', text1: 'Medication saved!' });
      onClose();
    } catch (error) {
      console.error("Failed to save dose(s):", error);
      Toast.show({ type: 'error', text1: 'Failed to save medication' });
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = name && details && repeatDays.length > 0 && totalDoses;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? 60 : 40 }}
      >
        <Text className="text-2xl font-bold mb-6 text-center">Add Medication</Text>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Medication Name</Text>
          <TextInput
            className="border rounded px-3 py-2"
            placeholder="e.g. Tylenol"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Details</Text>
          <TextInput
            className="border rounded px-3 py-2"
            placeholder="e.g. 500mg, 1 pill"
            value={details}
            onChangeText={setDetails}
          />
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Time</Text>
          <View style={{ height: Platform.OS === "ios" ? 180 : undefined }}>
            <DateTimePicker
              mode="time"
              value={time}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedTime) => {
                if (selectedTime) setTime(selectedTime);
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Repeat On</Text>
          <View className="flex-row flex-wrap gap-2">
            {weekdays.map((day, i) => (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                className={`px-4 py-2 rounded-full border ${
                  repeatDays.includes(i)
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`${
                    repeatDays.includes(i) ? "text-white" : "text-gray-800"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Total Doses</Text>
          <TextInput
            className="border rounded px-3 py-2"
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={totalDoses}
            onChangeText={setTotalDoses}
          />
        </View>

        <View className="flex-row justify-between items-center mb-10">
          <Pressable
            onPress={onClose}
            className="px-6 py-2 rounded bg-gray-300"
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
            className={`px-6 py-2 rounded ${
              isFormValid && !isSaving ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold">
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}