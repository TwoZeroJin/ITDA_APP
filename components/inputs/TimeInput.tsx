import TimePickerModal from '@/components/modal/TimePickerModal';
import { COLOR, COMM_STYLES } from '@/constants';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconTime from '@/assets/images/icon_time.svg';

interface TimeInputProps {
  isError?: boolean;
  onTimeChange?: (timeLabel: string) => void;
}

/**
 * 모임 시간 입력 컴포넌트
 */
export default function TimeInput({ isError = false, onTimeChange }: TimeInputProps) {
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedTimeLabel, setSelectedTimeLabel] = useState('');

  const [timeMeridiem, setTimeMeridiem] = useState('오전');
  const [timeHour, setTimeHour] = useState('01');
  const [timeMinute, setTimeMinute] = useState('00');

  const handleConfirmTime = () => {
    const nextLabel = `${timeMeridiem} ${timeHour}:${timeMinute}`;
    setSelectedTimeLabel(nextLabel);
    onTimeChange?.(nextLabel);
    setTimeModalVisible(false);
  };

  const handleOpenTimeModal = () => {
    const parsedTime = selectedTimeLabel.match(/^(오전|오후)\s(\d{1,2}):(\d{2})$/);

    if (parsedTime) {
      setTimeMeridiem(parsedTime[1]);
      setTimeHour(parsedTime[2].padStart(2, '0'));
      setTimeMinute(parsedTime[3].padStart(2, '0'));
    }

    setTimeModalVisible(true);
  };

  return (
    <>
      <View style={styles.timeContainer}>
        <Text style={styles.commContainerSubTitle}>모임 시간</Text>
        <TouchableOpacity
          style={[styles.placeInfoContainer, isError && COMM_STYLES.errorBorder]}
          onPress={handleOpenTimeModal}
        >
          <IconTime width={14} height={14} />
          <Text style={[COMM_STYLES.dataText, !selectedTimeLabel && COMM_STYLES.placeholderText]}>
            {selectedTimeLabel || '몇시에 만날까요?'}
          </Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={timeModalVisible}
        meridiem={timeMeridiem}
        hour={timeHour}
        minute={timeMinute}
        onChangeMeridiem={setTimeMeridiem}
        onChangeHour={setTimeHour}
        onChangeMinute={setTimeMinute}
        onClose={() => setTimeModalVisible(false)}
        onConfirm={handleConfirmTime}
      />
    </>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
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
