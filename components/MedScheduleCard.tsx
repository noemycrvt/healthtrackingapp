import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { MedicationDose } from "../types/MedicationDose";
import { MedicationGroup } from "../types/MedicationGroup";

type Med = MedicationDose & { group: MedicationGroup };

interface MedScheduleCardProps {
  time: string;
  meds: Med[];
  onTake: (doseId: string) => void;
  onSkip: (doseId: string) => void;
}

export default function MedScheduleCard({
  time,
  meds,
  onTake,
  onSkip,
}: MedScheduleCardProps) {
  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">{time}</Text>

      {meds.map((med, index) => {
        const isTaken = med.status === "taken";
        const isSkipped = med.status === "skipped";
        const disabled = isTaken || isSkipped;

        // Tint the entire card based on individual dose status
        const cardTint = isTaken
          ? "bg-green-50 border-green-200"
          : isSkipped
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200";

        return (
          <View
            key={index}
            className={`rounded-lg p-4 mb-3 shadow-sm border ${cardTint}`}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-2">
                <Text className="text-base font-bold text-gray-900">
                  {med.group.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {med.group.details}
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                {/* Take Button */}
                <Pressable disabled={disabled} onPress={() => onTake(med.id)}>
                  <Animatable.View
                    animation={isTaken ? "bounceIn" : undefined}
                    duration={600}
                    className={`w-9 h-9 rounded-full justify-center items-center ${
                      isTaken ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={isTaken ? "green" : "gray"}
                    />
                  </Animatable.View>
                </Pressable>

                {/* Skip Button */}
                <Pressable disabled={disabled} onPress={() => onSkip(med.id)}>
                  <Animatable.View
                    animation={isSkipped ? "shake" : undefined}
                    duration={600}
                    className={`w-9 h-9 rounded-full justify-center items-center ${
                      isSkipped ? "bg-red-100" : "bg-gray-200"
                    }`}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={isSkipped ? "red" : "gray"}
                    />
                  </Animatable.View>
                </Pressable>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
