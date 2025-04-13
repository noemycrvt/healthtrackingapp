import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { MedicationDose } from '../types/MedicationDose';
import MedicationGroupCard from '../components/MedCard'; // or rename back if desired
import { useRouter } from 'expo-router';

export default function MedicationsScreen() {
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState<Record<string, MedicationDose[]>>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/account');
        return;
      }

      const ref = collection(db, 'users', user.uid, 'medications');
      const snapshot = await getDocs(ref);
      const doses = snapshot.docs.map(doc => doc.data() as MedicationDose);

      // Group all doses by medicationId
      const grouped: Record<string, MedicationDose[]> = {};

      for (const dose of doses) {
        if (!grouped[dose.medicationId]) {
          grouped[dose.medicationId] = [];
        }
        grouped[dose.medicationId].push(dose);
      }

      // Sort each group by time
      Object.values(grouped).forEach(group =>
        group.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      );

      setMedications(grouped);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEditGroup = (medicationId: string) => {
    console.log('Edit group', medicationId);
    // Add navigation or modal logic here
  };

  const handleDeleteGroup = (medicationId: string) => {
    console.log('Delete group', medicationId);
    // Add confirmation and deletion logic here
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">All Medications</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : Object.keys(medications).length === 0 ? (
        <Text>No medications found.</Text>
      ) : (
        Object.entries(medications).map(([medicationId, doses]) => {
          const first = doses[0];
          const last = doses[doses.length - 1];

          return (
            <MedicationGroupCard
              key={medicationId}
              name={first.name}
              details={first.details}
              startDate={first.date}
              endDate={last.date}
              onEdit={() => handleEditGroup(medicationId)}
              onDelete={() => handleDeleteGroup(medicationId)}
            />
          );
        })
      )}
    </ScrollView>
  );
}
