import React from 'react';
import { Modal, View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface Props {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export default function TimePickerModal({ visible, value, onChange, onClose }: Props) {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-xl p-4 w-[80%]">
          <Text className="text-lg font-bold mb-4 text-center">Select Time</Text>

          {Platform.OS === 'web' ? (
            // @react-native-community/datetimepicker has no web implementation
            // (it renders null there), so fall back to a native <input type="time">.
            React.createElement('input', {
              type: 'time',
              value: format(value, 'HH:mm'),
              onChange: (e: any) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
                  const updated = new Date(value);
                  updated.setHours(hours, minutes, 0, 0);
                  onChange(updated);
                }
              },
              style: { fontSize: 18, padding: 8, marginBottom: 20, width: '100%' },
            })
          ) : (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={value}
              onChange={(_, selected) => {
                if (selected) onChange(selected);
              }}
              style={{ marginBottom: 20 }}
            />
          )}

          <Pressable
            onPress={onClose}
            className="mt-2 px-4 py-2 rounded bg-blue-500"
          >
            <Text className="text-white text-center">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
