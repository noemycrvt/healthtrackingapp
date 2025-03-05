import React from "react";
import { View, Text } from "react-native";

const AffirmationCardComponent = ({ message }: { message: string }) => {
  return (
    <View className="my-4 p-4 bg-blue-100 rounded-lg shadow-md">
      <Text className="text-lg font-semibold text-blue-900">{message}</Text>
    </View>
  );
};

export default AffirmationCardComponent;