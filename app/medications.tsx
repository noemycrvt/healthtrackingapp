import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, Alert, Platform } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { MedicationGroup } from '../types/MedicationGroup';
import { MedicationDose } from '../types/MedicationDose';
import MedicationGroupCard from '../components/MedCard';
import AddDoseModal from '../components/AddDoseModal';
import { useRouter } from 'expo-router';
import { Modal } from 'react-native';
import Toast from 'react-native-toast-message';

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

  const handleDeleteGroup = async (groupId: string) => {
    const confirmed =
      Platform.OS === 'web'
        ? window.confirm('Delete this medication and all its scheduled doses? This cannot be undone.')
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              'Delete Medication',
              'Delete this medication and all its scheduled doses? This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
              ],
              { cancelable: true, onDismiss: () => resolve(false) }
            );
          });

    if (!confirmed) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const dosesRef = collection(db, 'users', user.uid, 'medicationGroups', groupId, 'doses');
      const doseSnap = await getDocs(dosesRef);
      await Promise.all(doseSnap.docs.map((d) => deleteDoc(d.ref)));
      await deleteDoc(doc(db, 'users', user.uid, 'medicationGroups', groupId));

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setGroupDoses((prev) => {
        const updated = { ...prev };
        delete updated[groupId];
        return updated;
      });

      Toast.show({ type: 'success', text1: 'Medication deleted' });
    } catch (error) {
      console.error('Failed to delete medication group:', error);
      Toast.show({ type: 'error', text1: 'Failed to delete medication' });
    }
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