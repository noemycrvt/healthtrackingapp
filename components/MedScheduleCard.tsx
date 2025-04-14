import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MedicationDose } from "../types/MedicationDose";
import { MedicationGroup } from "../types/MedicationGroup";

type Med = MedicationDose & { group: MedicationGroup };

interface MedScheduleCardProps {
  time: string;
  meds: Med[];
  onTake: (doseId: string) => void;
  onSkip: (doseId: string) => void;
}

export default function MedScheduleCard({
  time,
  meds,
  onTake,
  onSkip,
}: MedScheduleCardProps) {
  return (
    <View className="bg-white rounded-md p-4 mt-2 shadow border border-gray-300">
      <Text className="font-semibold text-base mb-3">{time}</Text>

      {meds.map((med, index) => (
        <View
          key={index}
          className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50"
        >
          <Text className="text-base font-medium mb-2">
            • {med.group.name} {med.group.details}
          </Text>

          <View className="flex-row space-x-3">
            <Pressable
              onPress={() => onTake(med.id)}
              className="flex-row items-center bg-green-500 px-3 py-2 rounded"
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white ml-2 font-semibold">Take Dose</Text>
            </Pressable>

            <Pressable
              onPress={() => onSkip(med.id)}
              className="flex-row items-center bg-red-500 px-3 py-2 rounded"
            >
              <Ionicons name="close-circle" size={18} color="white" />
              <Text className="text-white ml-2 font-semibold">Skip Dose</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
