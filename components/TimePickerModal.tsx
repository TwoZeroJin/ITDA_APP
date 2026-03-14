import { COLOR } from "@/constants";
import React, { useMemo, useRef } from "react";
import { FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TimeMeridiem = '오전' | '오후';

type WheelValue = string | number;
type WheelOption = {
  label: string;
  value: WheelValue;
};

type TimePickerModalProps = {
  visible: boolean;
  meridiem: TimeMeridiem;
  hour: string;
  minute: string;
  onChangeMeridiem: (value: TimeMeridiem) => void;
  onChangeHour: (value: string) => void;
  onChangeMinute: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
};

type TimeWheelColumnProps = {
  options: WheelOption[];
  selectedValue: WheelValue;
  onChange: (value: WheelValue) => void;
};

const MERIDIEM_OPTIONS: TimeMeridiem[] = ['오전', '오후'];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => index);
const WHEEL_ITEM_HEIGHT = 42;
const WHEEL_VISIBLE_ROWS = 5;
const WHEEL_CONTAINER_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ROWS;

const MERIDIEM_WHEEL_OPTIONS: WheelOption[] = MERIDIEM_OPTIONS.map((value) => ({
  label: value,
  value,
}));

const HOUR_WHEEL_OPTIONS: WheelOption[] = HOUR_OPTIONS.map((value) => ({
  label: `${value}시`,
  value: `${value}`.padStart(2, '0'),
}));

const MINUTE_WHEEL_OPTIONS: WheelOption[] = MINUTE_OPTIONS.map((value) => ({
  label: `${value}분`,
  value: `${value}`.padStart(2, '0'),
}));

function TimeWheelColumn({ options, selectedValue, onChange }: TimeWheelColumnProps) {
  const listRef = useRef<FlatList<WheelOption>>(null);

  const handleScrollFinish = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const normalizedIndex = Math.min(Math.max(rawIndex, 0), options.length - 1);
    const nextOption = options[normalizedIndex];

    if (!nextOption) {
      return;
    }

    if (nextOption.value !== selectedValue) {
      onChange(nextOption.value);
    }
  };

  return (
    <View style={styles.timePickerColumn}>
      <View style={styles.timeWheelContainer}>
        <FlatList
          ref={listRef}
          data={options}
          keyExtractor={(item) => `${item.value}`}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={WHEEL_ITEM_HEIGHT}
          bounces={false}
          onMomentumScrollEnd={handleScrollFinish}
          onScrollEndDrag={handleScrollFinish}
          getItemLayout={(_, index) => ({
            length: WHEEL_ITEM_HEIGHT,
            offset: WHEEL_ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={styles.timeWheelContent}
          renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;

            return (
              <View style={styles.timeWheelItem}>
                <Text style={[styles.timeWheelItemText, isSelected && styles.timeWheelItemTextSelected]}>{item.label}</Text>
              </View>
            );
          }}
        />

        <View pointerEvents="none" style={styles.timeWheelHighlight} />
      </View>
    </View>
  );
}

function TimePickerModal({
  visible,
  meridiem,
  hour,
  minute,
  onChangeMeridiem,
  onChangeHour,
  onChangeMinute,
  onClose,
  onConfirm,
  title = '모임 시간 선택',
}: TimePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.timeModalOverlay}>
        <TouchableOpacity style={styles.timeModalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.timeModalContainer}>
          <Text style={styles.timeModalTitle}>{title}</Text>

          <View style={styles.timePickerRow}>
            <TimeWheelColumn
              options={MERIDIEM_WHEEL_OPTIONS}
              selectedValue={meridiem}
              onChange={(value) => onChangeMeridiem(value as TimeMeridiem)}
            />

            <TimeWheelColumn
              options={HOUR_WHEEL_OPTIONS}
              selectedValue={hour}
              onChange={(value) => onChangeHour(String(value))}
            />

            <TimeWheelColumn
              options={MINUTE_WHEEL_OPTIONS}
              selectedValue={minute}
              onChange={(value) => onChangeMinute(String(value))}
            />
          </View>

          <View style={styles.timeModalButtonRow}>
            <TouchableOpacity style={styles.timeCancelButton} onPress={onClose}>
              <Text style={styles.timeCancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeConfirmButton} onPress={onConfirm}>
              <Text style={styles.timeConfirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  timeModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timeModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  timeModalContainer: {
    borderRadius: 16,
    backgroundColor: COLOR.COMM_WHITE,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },
  timeModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
    marginBottom: 12,
  },
  timePickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  timePickerColumn: {
    flex: 1,
  },
  timePickerLabel: {
    fontSize: 12,
    color: COLOR.TEXT_DEFAULT,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  timeWheelContainer: {
    height: WHEEL_CONTAINER_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    backgroundColor: COLOR.COMM_WHITE,
    overflow: 'hidden',
  },
  timeWheelContent: {
    paddingVertical: (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2,
  },
  timeWheelItem: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeWheelItemText: {
    fontSize: 15,
    color: COLOR.COMM_GRAY_7,
  },
  timeWheelItemTextSelected: {
    fontSize: 16,
    color: COLOR.COLOR_323232,
    fontWeight: 'bold',
  },
  timeWheelHighlight: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2,
    height: WHEEL_ITEM_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.APP_MAIN,
  },
  timeModalButtonRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  timeCancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.COMM_WHITE,
  },
  timeCancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.TEXT_DEFAULT,
  },
  timeConfirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.APP_MAIN,
  },
  timeConfirmButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.COMM_WHITE,
  },
});

export default TimePickerModal;
