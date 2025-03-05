import React from "react";
import { View, Text } from "react-native";

interface AffirmationCardProps {
  affirmation: string;
  nextCheckin: string;
}

export default function AffirmationCard({
  affirmation,
  nextCheckin
}: AffirmationCardProps) {
  return (
    <View className="bg-white rounded-md p-4 mt-4 shadow">
      <Text className="text-gray-700 italic">{affirmation}</Text>
      <Text className="text-gray-500 mt-2">{nextCheckin}</Text>
    </View>
  );
}