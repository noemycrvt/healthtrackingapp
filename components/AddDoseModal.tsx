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
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { db, auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { requestNotificationPermissions } from "../app/data/notification";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import TimePickerModal from "./TimePickerModal";
import { MedicationDose } from "../types/MedicationDose";
import { MedicationGroup } from "../types/MedicationGroup";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  onClose: () => void;
  onSave: () => void;
  medicationGroup?: MedicationGroup;
}

export default function AddDoseModal({ onClose, onSave, medicationGroup }: Props) {
  const isEditing = !!medicationGroup;

  const [name, setName] = useState(medicationGroup?.name || "");
  const [details, setDetails] = useState(medicationGroup?.details || "");
  const [repeatDays, setRepeatDays] = useState<number[]>(medicationGroup?.repeatDays || []);
  const [times, setTimes] = useState<Date[]>(() => {
    if (!medicationGroup?.times) return [];
    return medicationGroup.times.map((t) => {
      const [hour, minute] = t.split(":").map(Number);
      const d = new Date();
      d.setHours(hour, minute, 0, 0);
      return d;
    });
  });
  const [endDate, setEndDate] = useState<Date | null>(
    medicationGroup?.endDate ? new Date(medicationGroup.endDate) : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState<number | null>(null);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const toggleDay = (index: number) => {
    setRepeatDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
    );
  };

  const scheduleNotification = async (dose: MedicationDose) => {
    const timestamp = new Date(dose.time).getTime();
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to take ${name}`,
        body: details,
        sound: true,
      },
      trigger: {
        type: "date",
        timestamp,
      } as any, // 👈 type-cast to bypass TypeScript limitation
    });
  };

  const handleSave = async () => {
    if (isSaving || !endDate || times.length === 0 || repeatDays.length === 0) return;

    setIsSaving(true);
    Toast.hide();
    Toast.show({ type: "info", text1: `${isEditing ? "Updating" : "Saving"}...` });

    const user = auth.currentUser;
    if (!user) {
      Toast.show({ type: "error", text1: "User not logged in" });
      return;
    }

    try {
      const now = new Date();
      const groupId = isEditing && medicationGroup
        ? medicationGroup.id
        : uuid.v4().toString();

      const groupRef = doc(db, "users", user.uid, "medicationGroups", groupId);

      const groupData: MedicationGroup = {
        id: groupId,
        name,
        details,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        times: times.map((t) => format(t, "HH:mm")),
        repeatDays,
        createdAt: new Date().toISOString(),
      };

      await setDoc(groupRef, groupData, { merge: true });

      const doseCollectionRef = collection(
        db,
        "users",
        user.uid,
        "medicationGroups",
        groupId,
        "doses"
      );

      // If editing: delete future doses
      if (isEditing) {
        const snapshot = await getDocs(doseCollectionRef);
        const deletions = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as MedicationDose;
          const doseTime = new Date(data.time);
          if (isAfter(doseTime, now) && data.status === "pending") {
            return deleteDoc(docSnap.ref);
          }
          return null;
        });
        await Promise.all(deletions.filter(Boolean));
      }

      // Generate and save new doses
      const doses: MedicationDose[] = [];
      let currentDate = new Date();
      const finalDate = new Date(endDate);

      while (currentDate <= finalDate) {
        if (repeatDays.includes(currentDate.getDay())) {
          times.forEach((t) => {
            const doseDateTime = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              t.getHours(),
              t.getMinutes()
            );

            if (isAfter(doseDateTime, now)) {
              const dose: MedicationDose = {
                id: uuid.v4().toString(),
                date: format(doseDateTime, "yyyy-MM-dd"),
                time: doseDateTime.toISOString(),
                status: "pending",
                createdAt: new Date().toISOString(),
              };

              doses.push(dose);
            }
          });
        }
        currentDate = addDays(currentDate, 1);
      }

      await Promise.all(
        doses.map(async (dose) => {
          await addDoc(doseCollectionRef, dose);
          await scheduleNotification(dose); // ⏰ Notify!
        })
      );

      Toast.show({
        type: "success",
        text1: isEditing ? "Medication group updated" : "Medication saved!",
      });

      onSave();
      onClose();

    } catch (error) {
      console.error("Failed to save/update medication:", error);
      Toast.show({
        type: "error",
        text1: "Failed to save/update medication",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFutureDoses = async () => {
    const user = auth.currentUser;
    if (!user || !medicationGroup) return;

    const now = new Date();
    const groupRef = doc(db, "users", user.uid, "medicationGroups", medicationGroup.id);
    const doseCollectionRef = collection(db, "users", user.uid, "medicationGroups", medicationGroup.id, "doses");

    try {
      Toast.show({ type: "info", text1: "Deleting future instances..." });

      const snapshot = await getDocs(doseCollectionRef);
      const deletions = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as MedicationDose;
        if (isAfter(new Date(data.time), now)) {
          return deleteDoc(docSnap.ref);
        }
        return null;
      });

      await Promise.all(deletions.filter(Boolean));

      await setDoc(
        groupRef,
        { repeatDays: [], times: [], endDate: null },
        { merge: true }
      );

      setRepeatDays([]);
      setTimes([]);
      setEndDate(null);

      Toast.show({ type: "success", text1: "Future doses deleted" });
    } catch (error) {
      console.error("Failed to delete future doses:", error);
      Toast.show({ type: "error", text1: "Failed to delete future doses" });
    }
  };

  const isFormValid =
    name && details && endDate && times.length > 0 && repeatDays.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="absolute top-9 left-4 z-50">
        <Pressable onPress={onClose} className="p-2">
          <Ionicons name="close" size={32} color="#4B5563" />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? 60 : 40 }}
      >
        <Text className="text-2xl font-bold mb-6 text-center">
          {isEditing ? "Edit Medication Group" : "Add Medication"}
        </Text>

        {/* Name */}
        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Medication Name</Text>
          <TextInput
            className="border rounded px-3 py-2"
            placeholder="e.g. Tylenol"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Details */}
        <View className="mb-5">
          <Text className="text-base font-semibold mb-1">Details</Text>
          <TextInput
            className="border rounded px-3 py-2"
            placeholder="e.g. 500mg, 1 pill"
            value={details}
            onChangeText={setDetails}
          />
        </View>

        {/* Times */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">Times per Day</Text>
          <View className="space-y-2">
            {times.map((time, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center bg-blue-100 border border-blue-300 px-4 py-3 rounded-xl mb-3"
              >
                <Pressable onPress={() => setTimes(times.filter((_, i) => i !== idx))}>
                  <Text className="text-red-900 font-bold text-xl">X</Text>
                </Pressable>
                <Text className="text-blue-900 text-base font-medium">
                  {format(time, "hh:mm aa")}
                </Text>
                <Pressable
                  onPress={() => {
                    setActiveTimeIndex(idx);
                    setModalVisible(true);
                  }}
                >
                  <Text className="text-blue-700 font-medium">Edit</Text>
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={() => setTimes([...times, new Date()])}
              className="mt-3 px-4 py-2 rounded bg-blue-500"
            >
              <Text className="text-white text-center">Add Time</Text>
            </Pressable>
          </View>
        </View>

        {/* Repeat Days */}
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

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-1">Repeat Until</Text>
          {Platform.OS === 'web' ? (
            // @react-native-community/datetimepicker has no web implementation
            // (it renders null there), so fall back to a native <input type="date">.
            React.createElement('input', {
              type: 'date',
              value: endDate ? format(endDate, 'yyyy-MM-dd') : '',
              onChange: (e: any) => {
                const [year, month, day] = e.target.value.split('-').map(Number);
                if (year && month && day) setEndDate(new Date(year, month - 1, day));
              },
              style: { fontSize: 16, padding: 8, border: '1px solid #d1d5db', borderRadius: 4, width: '100%' },
            })
          ) : (
            <>
              <Pressable
                onPress={() => setShowEndPicker(true)}
                className="border rounded px-3 py-2 bg-white"
              >
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
            </>
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
      {/* Fixed Delete Button at the bottom */}
      {isEditing && (
        <View className="px-5 pb-6 bg-white">
          <Pressable
            onPress={handleDeleteFutureDoses}
            className="w-full bg-red-600 py-3 rounded"
          >
            <Text className="text-white font-semibold text-center">
              Delete Future Instances
            </Text>
          </Pressable>
        </View>
      )}
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