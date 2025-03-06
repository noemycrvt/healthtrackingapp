import React, { useState } from 'react';
import {View, Text} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {useRouter} from 'expo-router';
import { medicationAgendaItems } from '../data/medicationItems';

/** Returns 'st', 'nd', 'rd', or 'th' based on the day number. */
function getOrdinalSuffix(dayNumber: number) {
  // Handle special 11th, 12th, 13th
  if (dayNumber % 100 >= 11 && dayNumber % 100 <= 13) {
    return 'th';
  }
  // Handle 1, 2, 3, etc.
  switch (dayNumber % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/** Checks if 'day' is the current calendar date. */
function isToday(day: {year: number; month: number; day: number}) {
  const now = new Date();
  return (
    day.year === now.getFullYear() &&
    day.month === now.getMonth() + 1 &&
    day.day === now.getDate()
  );
}

/** Converts the day’s JSON into a string like "March 6th, 2025" 
 *  or returns "Today" if it’s the same calendar day as the device’s date.
 */
function formatSelectedDay(day: { year: number; month: number; day: number }) {
  if (isToday(day)) {
    return 'Today';
  }

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const monthName = months[day.month - 1]; // day.month is 1-based
  const suffix = getOrdinalSuffix(day.day);

  return `${monthName} ${day.day}${suffix}, ${day.year}`;
}

function getTodayAsDayObject() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;  // Agenda months are 1-based
    const day = now.getDate();
    
    // Format as YYYY-MM-DD
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return {
      dateString,
      day,
      month,
      year,
      timestamp: now.getTime() // e.g. 1741219200000
    };
  }

export default function CalendarScreen() {
  const router = useRouter();
  const [items, setItems] = useState(medicationAgendaItems);

  return (
    <View style={{flex: 1, backgroundColor: '#f1f1f1'}}>
      <Agenda
        items={items}
        selected={getTodayAsDayObject().dateString}

      onCalendarToggled={calendarOpened => {
        if (calendarOpened) {
          // Construct an object matching Agenda's "day" format
          const todayObj = getTodayAsDayObject();

          // If you want to do something with 'todayObj', e.g. route params:
          router.setParams({ selectedDay: todayObj.dateString });
        }
      }}
        onDayPress={day => {
          // The 'day' object looks like:
          // { dateString: '2025-03-06', day: 6, month: 3, year: 2025, timestamp: ... }
          const formatted = formatSelectedDay(day);

          // e.g. set route params so your header can display that date or "Today"
          router.setParams({ selectedDay: formatted });
        }}
        renderItem={(item) => {
            return (
              <View style={{ margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>Dosage: {item.dosage}</Text>
                <Text>Time: {item.time}</Text>
                <Text>Notes: {item.instructions}</Text>
              </View>
            );
          }}
      />
    </View>
  );
}
