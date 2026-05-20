import CalendarModal from '@/components/CalendarModal';
import { COLOR } from '@/constants';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCalendar from '@/assets/images/icon_calendar.svg';

interface DateInputProps {
  onDateChange?: (dateValue: string, dateLabel: string) => void;
}

/**
 * 모임 날짜 입력 컴포넌트
 */
export default function DateInput({ onDateChange }: DateInputProps) {
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedDateLabel, setSelectedDateLabel] = useState('');

  const handleConfirmDate = (item: { value: string; label: string }) => {
    setSelectedDateValue(item.value);
    setSelectedDateLabel(item.label);
    onDateChange?.(item.value, item.label);
    setDateModalVisible(false);
  };

  return (
    <>
      <View style={styles.dateContainer}>
        <Text style={styles.commContainerSubTitle}>모임 날짜</Text>
        <TouchableOpacity
          style={styles.placeInfoContainer}
          activeOpacity={0.6}
          onPress={() => setDateModalVisible(true)}
        >
          <IconCalendar width={15} height={13} />
          <Text style={[styles.infoDesc, !selectedDateLabel && styles.placeholderText]}>
            {selectedDateLabel || '언제 만날까요?'}
          </Text>
        </TouchableOpacity>
      </View>

      <CalendarModal
        visible={dateModalVisible}
        selectedValue={selectedDateValue}
        onChangeValue={setSelectedDateValue}
        onClose={() => setDateModalVisible(false)}
        onConfirm={handleConfirmDate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    gap               : 14,
  },
  commContainerSubTitle: {
    fontSize          : 14,
    color             : COLOR.TEXT_DEFAULT,
    marginTop         : 10,
  },
  placeInfoContainer: {
    height            : 50,
    borderRadius      : 12,
    borderWidth       : 1,
    borderColor       : COLOR.COMM_GRAY_6,
    paddingHorizontal : 16,
    color             : COLOR.COMM_BLACK,
    flexDirection     : 'row',
    alignItems        : 'center',
    gap               : 8,
  },
  infoDesc: {
    fontSize          : 16,
    fontWeight        : 'bold',
    color             : COLOR.COLOR_323232,
  },
  placeholderText: {
    fontSize          : 14,
    fontWeight        : 'normal',
    color             : COLOR.COMM_GRAY_7,
  },
});
