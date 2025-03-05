import React from 'react';
import {View, Text} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default function CalendarScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Calendar
        onDayPress={day => {
          console.log('selected day', day);
        }}
      />
    </View>
  );
}