// pages/journal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import FloatingButton from "../../components/FloatingButton";
import JournalEntry from "../../components/JournalEntry";
import { format } from "date-fns";

interface JournalEntryType {
  id: string;
  date: string;
  content: string;
}

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const ref = collection(db, "users", user.uid, "journalEntries");
        const snapshot = await getDocs(ref);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { date: string; content: string }),
        }));
        setEntries(
          docs.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (e) {
        console.error("Failed to fetch journal entries", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [showModal]);

  const handleSave = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="grow px-4">
        <Text className="text-2xl font-bold mt-4">Your Journal</Text>
        {entries.length === 0 ? (
          <Text className="mt-4 text-base">No journal entries yet.</Text>
        ) : (
          entries.map((entry) => (
            <View
              key={entry.id}
              className="bg-white rounded-md shadow p-4 my-2"
            >
              <Text className="text-xs text-gray-500">
                {format(new Date(entry.date), "MMMM d, yyyy")}
              </Text>
              <Text className="text-sm mt-2">{entry.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <FloatingButton onPress={() => setShowModal(true)} />

      <Modal visible={showModal} animationType="slide">
        <JournalEntry
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </View>
  );
}