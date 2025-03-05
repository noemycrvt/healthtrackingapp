import React from "react";
import { View, Text } from "react-native";

const MedicationCard = ({ name, time, dosage }: { name: string; time: string; dosage: string }) => {
  return (
    <View className="mb-2 p-4 bg-white rounded-lg shadow-md border border-gray-300">
      <Text className="text-lg font-bold">{name}</Text>
      <Text className="text-gray-700">{time} - {dosage}</Text>
    </View>
  );
};

export default MedicationCard;