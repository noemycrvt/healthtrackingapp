import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { MedicationGroup } from '../types/MedicationGroup';
import { MedicationDose } from '../types/MedicationDose';
import MedicationGroupCard from '../components/MedCard';
import AddDoseModal from '../components/AddDoseModal';
import { useRouter } from 'expo-router';
import { Modal } from 'react-native';

export const screenOptions = {
  title: "Medications",
  headerBackTitle: "Home", // 👈 this controls the back button text
};
export default function MedicationsScreen() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<MedicationGroup[]>([]);
  const [groupDoses, setGroupDoses] = useState<Record<string, MedicationDose[]>>({});
  const [editingGroup, setEditingGroup] = useState<MedicationGroup | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/account');
        return;
      }

      const groupsRef = collection(db, 'users', user.uid, 'medicationGroups');
      const groupsSnap = await getDocs(groupsRef);
      const groupList = groupsSnap.docs.map(doc => doc.data() as MedicationGroup);

      const dosesByGroup: Record<string, MedicationDose[]> = {};

      await Promise.all(groupList.map(async (group) => {
        const dosesRef = collection(db, 'users', user.uid, 'medicationGroups', group.id, 'doses');
        const q = query(dosesRef, orderBy('time', 'asc'));
        const doseSnap = await getDocs(q);
        dosesByGroup[group.id] = doseSnap.docs.map(doc => doc.data() as MedicationDose);
      }));

      setGroups(groupList);
      setGroupDoses(dosesByGroup);
      setLoading(false);
    });

    return unsubscribe;
  }, [refreshKey]);

  const handleEditGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setEditingGroup(group);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    console.log('Delete group', groupId);
    // Optional: Implement delete logic here
  };

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <Text className="text-2xl font-bold mb-4">All Medications</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : groups.length === 0 ? (
          <Text>No medications found.</Text>
        ) : (
          groups.map((group) => {
            const doses = groupDoses[group.id] || [];

            return (
              <MedicationGroupCard
                key={group.id}
                name={group.name}
                details={group.details}
                startDate={group.startDate}
                endDate={group.endDate}
                onEdit={() => handleEditGroup(group.id)}
                onDelete={() => handleDeleteGroup(group.id)}
              />
            );
          })
        )}
      </ScrollView>

      <Modal
  visible={!!editingGroup}
  animationType="slide"
  onRequestClose={() => setEditingGroup(null)}
>
  {editingGroup && (
        <AddDoseModal
          medicationGroup={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSave={() => {
            setEditingGroup(null);
            setRefreshKey(prev => prev + 1);
            router.replace(`/`);
          }}
        />
      )}
    </Modal>
    </>
  );
}