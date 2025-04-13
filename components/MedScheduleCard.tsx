import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MedicationDose } from "../types/MedicationDose";
import { MedicationGroup } from "../types/MedicationGroup";

type Med = MedicationDose & { group: MedicationGroup };

interface MedScheduleCardProps {
  time: string;
  meds: Med[];
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => void;
  onMarkTaken: (groupId: string) => void;
}

export default function MedScheduleCard({
  time,
  meds,
  onEdit,
  onDelete,
  onMarkTaken,
}: MedScheduleCardProps) {
  const [takenStates, setTakenStates] = useState<{ [groupId: string]: boolean }>({});

  const toggleTaken = (groupId: string) => {
    setTakenStates((prev) => {
      const newState = !prev[groupId];
      if (newState) onMarkTaken(groupId);
      return { ...prev, [groupId]: newState };
    });
  };

  return (
    <View className="bg-white rounded-md p-4 mt-2 shadow border border-gray-300 relative">
      {/* Top-right X button */}
      <Pressable
        onPress={() => onDelete(meds[0].group.id)}
        className="absolute top-2 right-3 z-10"
      >
        <Text className="text-black text-2xl font-extrabold">×</Text>
      </Pressable>

      <Text className="font-semibold text-base mb-3">{time}</Text>

      {meds.map((med, index) => (
        <Pressable
          key={index}
          className="flex-row items-center justify-between mb-3"
          onPress={() => onEdit(med.group.id)}
        >
          {/* Med content */}
          <Text className="text-base flex-1">{`• ${med.group.name} ${med.group.details}`}</Text>

          {/* Checkbox */}
          <Pressable onPress={() => toggleTaken(med.group.id)} className="mr-1">
            <View
              className={`w-7 h-7 rounded-md border-2 ${
                takenStates[med.group.id]
                  ? "border-blue-600 bg-blue-100 justify-center items-center"
                  : "border-gray-400"
              } flex items-center justify-center`}
            >
              {takenStates[med.group.id] && (
                <Ionicons name="checkmark" size={16} color="blue" />
              )}
            </View>
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}
