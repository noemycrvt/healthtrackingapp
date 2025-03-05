import React from "react";
import { View, Text } from "react-native";

interface Med {
  name: string;
  details: string;
}

interface MedScheduleCardProps {
  time: string;
  meds: Med[];
}

export default function MedScheduleCard({ time, meds }: MedScheduleCardProps) {
  return (
    <View className="bg-white rounded-md p-4 mt-2 shadow">
      <Text className="font-bold text-base mb-2">{time}</Text>
      {meds.map((med, index) => (
        <Text key={index}>{`• ${med.name} ${med.details}`}</Text>
      ))}
    </View>
  );
}