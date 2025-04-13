import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Med {
  name: string;
  details: string;
}

interface MedScheduleCardProps {
  time: string;
  meds: Med[];
  onEdit: (medName: string) => void;
  onDelete: (medName: string) => void;
  onMarkTaken: (medName: string) => void;
}

export default function MedScheduleCard({ time, meds, onEdit, onDelete, onMarkTaken }: MedScheduleCardProps) {
  const [takenStates, setTakenStates] = useState<{ [name: string]: boolean }>({});

  const toggleTaken = (name: string) => {
    setTakenStates((prev) => {
      const newState = !prev[name];
      if (newState) onMarkTaken(name);
      return { ...prev, [name]: newState };
    });
  };

  return (
    <View className="bg-white rounded-md p-4 mt-2 shadow border border-gray-300 relative">
    {/* Black 'x' in top right */}
    <Pressable onPress={() => onDelete(meds[0].name)} className="absolute top-2 right-3 z-10">
      <Text className="text-black text-2xl font-extrabold">×</Text>
    </Pressable>
      <Text className="font-semibold text-base mb-3">{time}</Text>

      {meds.map((med, index) => (
        <Pressable
          key={index}
          className="flex-row items-center justify-between mb-3"
          onPress={() => onEdit(med.name)}
        >

          {/* Med content */}
          <Text className="text-base flex-1">{`• ${med.name} ${med.details}`}</Text>

          {/* Checkbox */}
          <Pressable
            onPress={() => toggleTaken(med.name)}
            className="mr-1"
          >
            <View
              className={`w-7 h-7 rounded-md border-2 ${
                takenStates[med.name]
                  ? "border-blue-600 bg-blue-100 justify-center items-center"
                  : "border-gray-400"
              } flex items-center justify-center`}
            >
              {takenStates[med.name] && (
                <Ionicons name="checkmark" size={16} color="blue" />
              )}
            </View>
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}