import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { UserContext } from "../../context/UserContext";
import FloatingButton from "../../components/FloatingButton";
import MedScheduleCard from "../../components/MedScheduleCard";
import AddDoseModal from "../../components/AddDoseModal";
import NextDoseCard from "../../components/NextDoseCard";
import AffirmationCard from "../../components/AffirmationCard";
import { MedicationDose } from "../../types/MedicationDose";
import { format } from "date-fns";

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function HomeScreen() {
  const router = useRouter();
  const { userName, loadingUser } = useContext(UserContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MedicationDose[] | null>(
    null
  );
  const [userDoses, setUserDoses] = useState<MedicationDose[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/account");
      } else {
        await fetchUserDoses(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [showAddModal]);

  const fetchUserDoses = async (uid: string) => {
    try {
      const medsRef = collection(db, "users", uid, "medications");
      const snapshot = await getDocs(query(medsRef, orderBy("time")));
      const all = snapshot.docs.map((doc) => doc.data() as MedicationDose);
      const todayFiltered = all.filter((d) => d.date === todayStr);
      setUserDoses(todayFiltered);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const groupedByTime = userDoses.reduce((acc, curr) => {
    const formattedTime = format(new Date(curr.time), "h:mm a");
    if (!acc[formattedTime]) acc[formattedTime] = [];
    acc[formattedTime].push({ ...curr });
    return acc;
  }, {} as Record<string, MedicationDose[]>);

  const sortedTimes = Object.keys(groupedByTime);

  const getNextDose = () => {
    const now = new Date();
    const upcoming = userDoses
      .map((dose) => ({
        ...dose,
        dateObj: new Date(dose.time),
      }))
      .filter((dose) => dose.dateObj > now)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    return upcoming[0];
  };

  const nextDose = getNextDose();

  if (loading || loadingUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="grow px-4">
        <Text className="text-2xl font-bold mt-4">
          {getTimeGreeting()}, {userName || "Guest"}!
        </Text>

        <AffirmationCard
          affirmation="“You are safe. Take a few deep breaths—your strength is greater than your anxiety.”"
          nextCheckin="Next Check-In: 9:00 AM"
        />
        <Pressable
          onPress={() => router.push("/medications")}
          className="bg-blue-500 px-4 py-2 rounded mb-4 mt-2"
        >
          <Text className="text-white text-center">View All Medications</Text>
        </Pressable>

        <NextDoseCard
          doseText={
            nextDose
              ? `Next Dose: ${nextDose.name} @ ${format(
                  new Date(nextDose.time),
                  "h:mm a"
                )}`
              : "No more doses today 🎉"
          }
        />

        <Text className="text-lg font-bold mt-4">Today's Meds</Text>

        {sortedTimes.length === 0 ? (
          <Text className="text-base mt-2">No scheduled medications today.</Text>
        ) : (
          sortedTimes.map((time) => (
            <MedScheduleCard
              key={time}
              time={time}
              meds={groupedByTime[time]}
              onEdit={(name) => {
                const group = userDoses.filter((d) => d.name === name);
                if (group.length > 0) {
                  setEditingGroup(group);
                  setShowAddModal(true);
                }
              }}
              onDelete={(name) => console.log("Delete", name)}
              onMarkTaken={(name) => console.log("Taken", name)}
            />
          ))
        )}
      </ScrollView>

      <FloatingButton
        onPress={() => {
          setEditingGroup(null);
          setShowAddModal(true);
        }}
      />

      <Modal visible={showAddModal} animationType="slide">
        <AddDoseModal
          medicationGroup={editingGroup || undefined}
          onClose={() => {
            setShowAddModal(false);
            setEditingGroup(null);
          }}
          onSave={() => {
            setEditingGroup(null);
            fetchUserDoses(auth.currentUser?.uid || "");
          }}
        />
      </Modal>
    </View>
  );
}