import React from "react";
import { View, Text } from "react-native";

interface DayCirclesProps {
  days: string[];
  currentDayIndex: number;
}

export default function DayCircles({ days, currentDayIndex }: DayCirclesProps) {
  return (
    <View className="flex-row justify-around items-center bg-white p-4">
      {days.map((day, index) => {
        const isToday = index === currentDayIndex;
        return (
          <View key={index} className="items-center">
            <Text className="text-sm font-bold">{day}</Text>
            {isToday ? (
              <View className="w-9 h-9 bg-black rounded-full flex items-center justify-center mt-1">
                <Text className="text-white text-base">{index + 1}</Text>
              </View>
            ) : (
              <View className="w-9 h-9 rounded-full flex items-center justify-center mt-1">
                <Text className="text-black text-base">{index + 1}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
