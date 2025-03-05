import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FloatingButtonProps {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center absolute right-6 bottom-6"
    >
      <Ionicons name="add" size={24} color="#fff" />
    </Pressable>
  );
}