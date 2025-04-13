import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { MedicationDose } from '../../types/MedicationDose';
import { MedicationGroup } from '../../types/MedicationGroup';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

function getOrdinalSuffix(dayNumber: number) {
  if (dayNumber % 100 >= 11 && dayNumber % 100 <= 13) return 'th';
  switch (dayNumber % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function isToday(day: { year: number; month: number; day: number }) {
  const now = new Date();
  return (
    day.year === now.getFullYear() &&
    day.month === now.getMonth() + 1 &&
    day.day === now.getDate()
  );
}

function formatSelectedDay(day: { year: number; month: number; day: number }) {
  if (isToday(day)) return 'Today';
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const monthName = months[day.month - 1];
  const suffix = getOrdinalSuffix(day.day);
  return `${monthName} ${day.day}${suffix}, ${day.year}`;
}

function getTodayAsDayObject() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return {
    dateString,
    day,
    month,
    year,
    timestamp: now.getTime()
  };
}

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getTodayAsDayObject().dateString);
  const [allItems, setAllItems] = useState<Record<string, any[]>>({});
  const [visibleItems, setVisibleItems] = useState<Record<string, any[]>>({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchCalendarData = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const groupsRef = collection(db, "users", user.uid, "medicationGroups");
        const groupSnap = await getDocs(groupsRef);
        const groupList = groupSnap.docs.map((doc) => doc.data() as MedicationGroup);

        const calendarData: Record<string, any[]> = {};

        for (const group of groupList) {
          const dosesRef = collection(db, "users", user.uid, "medicationGroups", group.id, "doses");
          const q = query(dosesRef, orderBy("time"));
          const snapshot = await getDocs(q);
          const doses = snapshot.docs.map((doc) => doc.data() as MedicationDose);

          doses.forEach((dose) => {
            const dateKey = dose.date;
            if (!calendarData[dateKey]) {
              calendarData[dateKey] = [];
            }
            calendarData[dateKey].push({
              name: group.name,
              details: group.details,
              time: format(new Date(dose.time), "h:mm a"),
              status: dose.status,
            });
          });
        }

        setAllItems(calendarData);
        setVisibleItems({ [selectedDate]: calendarData[selectedDate] || [] });
      };

      fetchCalendarData();
    }, [selectedDate])
  );

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    setVisibleItems({ [date]: allItems[date] || [] });

    const formatted = formatSelectedDay(day);
    router.setParams({ selectedDay: formatted });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
      <Agenda
        items={visibleItems}
        selected={selectedDate}
        renderItem={(item) => (
          <View
            style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 8,
              marginTop: 10,
              marginRight: 10,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.details}</Text>
            <Text style={{ color: 'gray' }}>{item.time}</Text>
            <Text style={{ color: item.status === 'taken' ? 'green' : 'orange' }}>
              Status: {item.status}
            </Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'gray' }}>No medication scheduled</Text>
          </View>
        )}
        onDayPress={handleDayPress}
        onCalendarToggled={(opened) => {
          if (opened) {
            const today = getTodayAsDayObject();
            setSelectedDate(today.dateString);
            setVisibleItems({ [today.dateString]: allItems[today.dateString] || [] });
            router.setParams({ selectedDay: today.dateString });
          }
        }}
      />
    </View>
  );
}