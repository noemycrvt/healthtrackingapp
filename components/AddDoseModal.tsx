import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isAfter } from "date-fns";
import uuid from "react-native-uuid";
import { MedicationDose } from "../types/MedicationDose";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import TimePickerModal from "./TimePickerModal";

interface Props {
  onClose: () => void;
  onSave: (dose: MedicationDose) => void;
  medicationGroup?: MedicationDose[];
}

export default function AddDoseModal({ onClose, onSave, medicationGroup }: Props) {
  const isEditing = !!medicationGroup;
  const initial = medicationGroup?.[0];

  const [name, setName] = useState(initial?.name || "");
  const [details, setDetails] = useState(initial?.details || "");
  const [times, setTimes] = useState<Date[]>(
    initial ? [new Date(initial.time)] : []
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initial ? new Date(initial.date) : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState<number | null>(null);

  const handleSave = async () => {
    if (isSaving || !endDate || times.length === 0) return;
    setIsSaving(true);
    Toast.hide();
    Toast.show({ type: "info", text1: `${isEditing ? "Updating" : "Saving"}...` });

    const user = auth.currentUser;
    if (!user) {
      Toast.show({ type: "error", text1: "User not logged in" });
      return;
    }

    try {
      const userMedRef = collection(db, "users", user.uid, "medications");

      if (isEditing && initial) {
        const q = query(userMedRef, where("medicationId", "==", initial.medicationId));
        const snapshot = await getDocs(q);

        const updates = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as MedicationDose;
          const docRef = docSnap.ref;

          // Only update future doses
          if (isAfter(new Date(data.date), new Date())) {
            await updateDoc(docRef, {
              name,
              details,
              time: times[0].toISOString(),
            });
          }
        });

        await Promise.all(updates);
        Toast.show({ type: "success", text1: "Medication group updated" });
      } else {
        const medicationId = uuid.v4().toString();
        const doses: MedicationDose[] = [];
        let currentDate = new Date();
        const finalDate = new Date(endDate);

        while (currentDate <= finalDate) {
          times.forEach((t) => {
            const doseDateTime = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              t.getHours(),
              t.getMinutes()
            );

            doses.push({
              id: uuid.v4().toString(),
              medicationId,
              name,
              details,
              time: doseDateTime.toISOString(),
              date: format(doseDateTime, "yyyy-MM-dd"),
              status: "pending",
              createdAt: new Date().toISOString(),
            });
          });

          currentDate = addDays(currentDate, 1);
        }

        await Promise.all(doses.map((dose) => addDoc(userMedRef, dose)));
        doses.forEach(onSave);
        Toast.show({ type: "success", text1: "Medication saved!" });
      }

      onClose();
    } catch (error) {
      console.error("Failed to save/update medication:", error);
      Toast.show({ type: "error", text1: "Failed to save/update medication" });
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = name && details && endDate && times.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? 60 : 40 }}>
        <Text className="text-2xl font-bold mb-6 text-center">
          {isEditing ? "Edit Medication Group" : "Add Medication"}
        </Text>

        {/* Form Fields */}
        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Medication Name</Text>
          <TextInput className="border rounded px-3 py-2" placeholder="e.g. Tylenol" value={name} onChangeText={setName} />
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Details</Text>
          <TextInput className="border rounded px-3 py-2" placeholder="e.g. 500mg, 1 pill" value={details} onChangeText={setDetails} />
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Times per Day</Text>
          <View className="space-y-2">
            {times.map((time, idx) => (
              <View key={idx} className="flex-row justify-between items-center bg-blue-100 border border-blue-300 px-4 py-3 rounded-xl mb-3">
                <Pressable onPress={() => setTimes(times.filter((_, i) => i !== idx))}>
                  <Text className="text-red-900 font-bold text-xl">X</Text>
                </Pressable>
                <Text className="text-blue-900 text-base font-medium">{format(time, "hh:mm aa")}</Text>
                <Pressable onPress={() => { setActiveTimeIndex(idx); setModalVisible(true); }}>
                  <Text className="text-blue-700 font-medium">Edit</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => setTimes([...times, new Date()])} className="mt-3 px-4 py-2 rounded bg-blue-500">
              <Text className="text-white text-center">Add Time</Text>
            </Pressable>
          </View>
        </View>

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-1">Repeat Until</Text>
          <Pressable onPress={() => setShowEndPicker(true)} className="border rounded px-3 py-2 bg-white">
            <Text>{endDate ? format(endDate, "MMMM d, yyyy") : "Select end date"}</Text>
          </Pressable>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between items-center mb-10">
          <Pressable onPress={onClose} className="px-6 py-2 rounded bg-gray-300">
            <Text className="text-white font-semibold">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
            className={`px-6 py-2 rounded ${isFormValid && !isSaving ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <Text className="text-white font-semibold">{isSaving ? "Saving..." : "Save"}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={modalVisible}
        value={times[activeTimeIndex ?? 0] ?? new Date()}
        onChange={(selected) => {
          if (activeTimeIndex !== null) {
            const updated = [...times];
            updated[activeTimeIndex] = selected;
            setTimes(updated);
          }
        }}
        onClose={() => {
          setModalVisible(false);
          setActiveTimeIndex(null);
        }}
      />
    </SafeAreaView>
  );
}
