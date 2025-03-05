import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav() {
  return (
    <View className="flex-row items-center justify-around bg-white p-4 shadow">
      <Pressable onPress={() => {}}>
        <Ionicons name="calendar-outline" size={24} color="gray" />
      </Pressable>
      <Pressable onPress={() => {}}>
        <Ionicons name="home" size={24} color="gray" />
      </Pressable>
      <Pressable onPress={() => {}}>
        <Ionicons name="person-outline" size={24} color="gray" />
      </Pressable>
    </View>
  );
}