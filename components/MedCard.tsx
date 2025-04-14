// components/MedicationGroupCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';

interface Props {
  name: string;
  details: string;
  startDate: string;
  endDate: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MedicationGroupCard({
  name,
  details,
  startDate,
  endDate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View className="bg-white p-4 rounded shadow mb-3">
      <Text className="text-lg font-bold mb-1">{name}</Text>
      <Text className="text-gray-700 mb-1">{details}</Text>
      <Text className="text-sm text-gray-500 mb-2">
        From {format(new Date(startDate), 'MMM d')} to {format(new Date(endDate), 'MMM d')}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Pressable onPress={onEdit} className="px-4 py-2 bg-blue-500 rounded">
          <Text className="text-white font-semibold">Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} className="px-4 py-2 bg-red-500 rounded">
          <Text className="text-white font-semibold">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
