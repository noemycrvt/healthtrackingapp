import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Modal } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import MedScheduleCard from "../../components/MedScheduleCard";
import AddDoseModal from "../../components/AddDoseModal";
import NextDoseCard from "../../components/NextDoseCard";
import AffirmationCard from "../../components/AffirmationCard";
import { MedicationDose } from "../../types/MedicationDose";
import { format } from "date-fns";

export default function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [userDoses, setUserDoses] = useState<MedicationDose[]>([]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const weekdayIndex = new Date().getDay();

  const todayDoses = userDoses.filter((dose) =>
    dose.repeatDays.includes(weekdayIndex)
  );

  const groupedByTime = todayDoses.reduce((acc, curr) => {
    const formattedTime = format(new Date(curr.time), "h:mm a");
    if (!acc[formattedTime]) acc[formattedTime] = [];
    acc[formattedTime].push({ name: curr.name, details: curr.details });
    return acc;
  }, {} as Record<string, { name: string; details: string }[]>);

  const sortedTimes = Object.keys(groupedByTime);

  const getNextDose = () => {
    const now = new Date();
  
    const upcoming = todayDoses
      .map((dose) => ({
        ...dose,
        date: new Date(dose.time), // dose.time is ISO string
      }))
      .filter((dose) => dose.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    return upcoming[0];
  };

  const nextDose = getNextDose();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // refresh every 60 seconds
  
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="grow px-4">
        <Text className="text-2xl font-bold mt-4">Good Morning, John!</Text>

        <AffirmationCard
          affirmation="“You are safe. Take a few deep breaths—your strength is greater than your anxiety.”"
          nextCheckin="Next Check-In: 9:00 AM"
        />

        <NextDoseCard
          doseText={
            nextDose
              ? `Next Dose: ${nextDose.name} @ ${format(new Date(nextDose.time), "h:mm a")}`
              : "No more doses today 🎉"
          }
        />

        <Text className="text-lg font-bold mt-4">Today's Meds</Text>

        {sortedTimes.length === 0 ? (
          <Text className="text-base mt-2">No scheduled medications today.</Text>
        ) : (
          sortedTimes.map((time) => (
            <MedScheduleCard key={time} time={time} meds={groupedByTime[time]} />
          ))
        )}
      </ScrollView>

      <FloatingButton onPress={() => setShowAddModal(true)} />

      <Modal visible={showAddModal} animationType="slide">
        <AddDoseModal
          onClose={() => setShowAddModal(false)}
          onSave={(dose) => setUserDoses((prev) => [...prev, dose])}
        />
      </Modal>
    </View>
  );
}