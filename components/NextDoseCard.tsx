import React from "react";
import { View, Text } from "react-native";

interface NextDoseCardProps {
  doseText: string;
}

export default function NextDoseCard({ doseText }: NextDoseCardProps) {
  return (
    <View className="bg-white rounded-md p-4 mt-4 shadow">
      <Text className="text-lg font-bold mb-2">{doseText}</Text>
    </View>
  );
}