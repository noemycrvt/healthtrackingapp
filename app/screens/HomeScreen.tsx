import React from "react";
import { View, ScrollView, Text } from "react-native";
import MedicationCard from "@/components/MedicationCard";
import MoodCheckInComponent from "@/components/MoodCheckIn";
import AffirmationCardComponent from "@/components/AffirmationCard";

const HomeScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Medication Schedule</Text>
      <MedicationCard name="Lexapro" time="8:00 AM" dosage="10mg" />
      <MedicationCard name="Sumatriptan" time="12:30 PM" dosage="50mg" />
      
      <MoodCheckInComponent />
      <AffirmationCardComponent message="Small steps lead to big progress. Take it easy this morning." />
    </ScrollView>
  );
};

export default HomeScreen;