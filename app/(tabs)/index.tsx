import React from "react";
import { View, Text, ScrollView } from "react-native";
import DayCircles from "../../components/DayCircles";
import AffirmationCard from "../../components/AffirmationCard";
import NextDoseCard from "../../components/NextDoseCard";
import MedScheduleCard from "../../components/MedScheduleCard";
import BottomNav from "../../components/BottomNav";
import FloatingButton from "../../components/FloatingButton";

// Example medication data
const medScheduleData = [
  {
    time: "9:00 AM",
    meds: [
      { name: "Antibiotics", details: "100mg, 1 pill" },
      { name: "Ibuprofen", details: "200mg, 2 pills" },
      { name: "Metformin", details: "500mg, 1 pill" }
    ]
  },
  {
    time: "12:00 PM",
    meds: [
      { name: "Antibiotics", details: "100mg, 1 pill" },
      { name: "Ibuprofen", details: "200mg, 2 pills" }
    ]
  }
];

export default function HomeScreen() {
  // Example array of days (Sun=0 -> Sat=6)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Suppose it's Wednesday
  const currentDayIndex = 3;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Day Circles row */}
      <DayCircles days={days} currentDayIndex={currentDayIndex} />

      {/* Main Scrollable Content */}
      <ScrollView className="grow px-4">
        {/* Greeting */}
        <Text className="text-2xl font-bold mt-4">Good Morning, John!</Text>

        {/* Affirmation Box */}
        <AffirmationCard
          affirmation="“You are safe. Take a few deep breaths—your strength is greater than your anxiety.”"
          nextCheckin="Next Check-In: 9:00 AM"
        />

        {/* Next Dose */}
        <NextDoseCard
          doseText="Next Dose: Antibiotics @ 9:00 AM"
        />

        {/* Today's Meds Title */}
        <Text className="text-lg font-bold mt-4">Today's Meds</Text>

        {/* Medication Schedules */}
        {medScheduleData.map((item, index) => (
          <MedScheduleCard
            key={index}
            time={item.time}
            meds={item.meds}
          />
        ))}
      </ScrollView>

      {/* Floating '+' Button */}
      <FloatingButton onPress={() => {}} />
    </View>
  );
}
