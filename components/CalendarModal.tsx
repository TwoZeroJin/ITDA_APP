import { COLOR } from "@/constants";
import { formatYmdDate, parseYmdDate } from "@/utils/commUtil";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * 날짜 선택 모달
 */
type DateOption = {
  value: string;
  label: string;
};

type CalendarModalProps = {
  visible: boolean;
  selectedValue: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onConfirm: (item: DateOption) => void;
  title?: string;
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateLabel(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = WEEKDAY_LABELS[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

function getMonthCells(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1;

    if (day < 1 || day > daysInMonth) {
      return null;
    }

    return day;
  });
}

function CalendarModal({
  visible,
  selectedValue,
  onChangeValue,
  onClose,
  onConfirm,
  title,
}: CalendarModalProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const selectedDate = useMemo(() => {
    const parsed = parseYmdDate(selectedValue);
    return parsed?.date ?? null;
  }, [selectedValue]);

  const monthCells = useMemo(() => getMonthCells(displayMonth), [displayMonth]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const baseDate = selectedDate && selectedDate >= today ? selectedDate : today;
    setDisplayMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));

    if (!selectedDate || selectedDate < today) {
      onChangeValue(formatYmdDate(baseDate));
    }
  }, [onChangeValue, selectedDate, today, visible]);

  const handleConfirm = () => {
    const date = selectedDate && selectedDate >= today ? selectedDate : today;
    onConfirm({
      value: formatYmdDate(date),
      label: formatDateLabel(date),
    });
  };

  const moveMonth = (diff: number) => {
    setDisplayMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));
  };

  const isPrevMonthDisabled = useMemo(() => {
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return displayMonth <= currentMonthStart;
  }, [displayMonth, today]);

  const isSelectedDate = (day: number) => {
    if (!selectedDate) {
      return false;
    }

    return (
      selectedDate.getFullYear() === displayMonth.getFullYear()
      && selectedDate.getMonth() === displayMonth.getMonth()
      && selectedDate.getDate() === day
    );
  };

  const isPastDate = (day: number) => {
    const targetDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    return targetDate < today;
  };

  const handleSelectDay = (day: number) => {
    const pickedDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);

    if (pickedDate < today) {
      return;
    }

    onChangeValue(formatYmdDate(pickedDate));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          {!!title && <Text style={styles.modalTitle}>{title}</Text>}

          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>{`${displayMonth.getFullYear()}년 ${displayMonth.getMonth() + 1}월`}</Text>
            <View style={styles.monthNavRow}>
              <TouchableOpacity
                style={styles.monthNavButton}
                onPress={() => moveMonth(-1)}
                disabled={isPrevMonthDisabled}
              >
                <Text style={[styles.monthNavText, isPrevMonthDisabled && styles.monthNavTextDisabled]}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => moveMonth(1)}>
                <Text style={styles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((weekday) => (
              <View key={weekday} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{weekday}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {monthCells.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const selected = isSelectedDate(day);
              const isDisabled = isPastDate(day);

              return (
                <View key={`day-${day}`} style={styles.dayCell}>
                  <TouchableOpacity
                    style={[styles.dayButton, selected && styles.dayButtonSelected]}
                    onPress={() => handleSelectDay(day)}
                    activeOpacity={0.8}
                    disabled={isDisabled}
                  >
                    <Text style={[styles.dayText, isDisabled && styles.dayTextDisabled, selected && styles.dayTextSelected]}>{day}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalContainer: {
    borderRadius: 16,
    backgroundColor: COLOR.COMM_WHITE,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 14,
    color: COLOR.TEXT_DEFAULT,
    marginBottom: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.COLOR_323232,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthNavButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  monthNavText: {
    fontSize: 28,
    color: COLOR.TEXT_DEFAULT,
    lineHeight: 28,
  },
  monthNavTextDisabled: {
    color: COLOR.COMM_GRAY_6,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayCell: {
    width: '14.2857%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.TEXT_DEFAULT,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  dayCell: {
    width: '14.2857%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: COLOR.APP_ACTIVE_5,
  },
  dayText: {
    fontSize: 16,
    color: COLOR.TEXT_DEFAULT,
    lineHeight: 18,
  },
  dayTextDisabled: {
    color: COLOR.COMM_GRAY_6,
  },
  dayTextSelected: {
    color: COLOR.COMM_WHITE,
  },
  buttonRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.COMM_GRAY_6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.COMM_WHITE,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.TEXT_DEFAULT,
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.APP_MAIN,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.COMM_WHITE,
  },
});

export default CalendarModal;
