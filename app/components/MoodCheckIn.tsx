import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

const MoodCheckInComponent = () => {
  const [mood, setMood] = useState("Neutral");

  return (
    <View className="my-4 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold mb-2">How are you feeling?</Text>
      {["Neutral", "Anxious", "Better than expected"].map((m) => (
        <Pressable
          key={m}
          onPress={() => setMood(m)}
          className="px-4 py-2 my-1 bg-blue-500 rounded-lg"
        >
          <Text className="text-white text-center">{m}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default MoodCheckInComponent;