import CalendarModal from '@/components/CalendarModal';
import { COLOR, COMM_STYLES } from '@/constants';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconCalendar from '@/assets/images/icon_calendar.svg';

interface DateInputProps {
  type? : string;
  isError?: boolean;
  onDateChange?: (dateValue: string, dateLabel: string) => void;
  initialDateValue?: string;
  initialDateLabel?: string;
}

/**
 * 모임 날짜 입력 컴포넌트
 */
export default function DateInput({ type = 'M', isError = false, onDateChange, initialDateValue = '', initialDateLabel = '' }: DateInputProps) {
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedDateLabel, setSelectedDateLabel] = useState('');

  useEffect(() => {
    setSelectedDateValue(initialDateValue);
    setSelectedDateLabel(initialDateLabel);
  }, [initialDateValue, initialDateLabel]);

  const handleConfirmDate = (item: { value: string; label: string }) => {
    setSelectedDateValue(item.value);
    setSelectedDateLabel(item.label);
    onDateChange?.(item.value, item.label);
    setDateModalVisible(false);
  };

  return (
    <>
      <View style={styles.dateContainer}>
        <Text style={styles.commContainerSubTitle}>{type === 'M' ? '모임 날짜' : '모임 시작날짜'}</Text>
        <TouchableOpacity
          style={[styles.placeInfoContainer, isError && COMM_STYLES.errorBorder]}
          activeOpacity={0.6}
          onPress={() => setDateModalVisible(true)}
        >
          <IconCalendar width={15} height={13} />
          <Text style={[COMM_STYLES.dataText, !selectedDateLabel && COMM_STYLES.placeholderText]}>
            {selectedDateLabel || (type === 'M' ? '언제 만날까요?' : '모임 시작날짜를 선택하세요.')}
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
});
