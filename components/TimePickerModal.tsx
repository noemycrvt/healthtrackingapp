import React from 'react';
import { Modal, View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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

          <DateTimePicker
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={value}
            onChange={(_, selected) => {
              if (selected) onChange(selected);
            }}
            style={{ marginBottom: 20 }}
          />

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
