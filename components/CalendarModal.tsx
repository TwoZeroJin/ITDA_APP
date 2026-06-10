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

function CalendarModal({ visible, selectedValue, onChangeValue, onClose, onConfirm }: CalendarModalProps) {
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
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={0.6} 
          onPress={onClose} 
        />
        <View style={styles.modalContainer}>
          <View style={{ paddingHorizontal : 16}}>
            <View style={styles.calendarHeader}>
              <Text style={styles.monthTitle}>{`${displayMonth.getFullYear()}년 ${displayMonth.getMonth() + 1}월`}</Text>
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  style={styles.monthNavButton}
                  activeOpacity={0.6}
                  onPress={() => moveMonth(-1)}
                  disabled={isPrevMonthDisabled}
                >
                  <Text style={[styles.monthNavText, isPrevMonthDisabled && styles.monthNavTextDisabled]}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.monthNavButton}
                  activeOpacity={0.6}
                  onPress={() => moveMonth(1)}
                >
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
                      activeOpacity={0.6}
                      onPress={() => handleSelectDay(day)}
                      disabled={isDisabled}
                    >
                      <Text style={[styles.dayText, isDisabled && styles.dayTextDisabled, selected && styles.dayTextSelected]}>{day}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton}
              activeOpacity={0.6}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.6}
            >
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
    flex                : 1,
    justifyContent      : 'center',
    paddingHorizontal   : 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor     : COLOR.COMM_MODAL_BG,
  },
  modalContainer: {
    borderRadius        : 10,
    backgroundColor     : COLOR.COMM_WHITE,
    paddingTop          : 16,
  },
  calendarHeader: {
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    alignItems          : 'center',
    marginBottom        : 16,
  },
  monthTitle: {
    fontSize            : 20,
    fontFamily          : 'Pretendard-Bold',
    color               : COLOR.COLOR_323232,
    marginStart         : 8,
  },
  monthNavRow: {
    flexDirection       : 'row',
    alignItems          : 'center',
    gap                 : 4,
  },
  monthNavButton: {
    width               : 28,
    height              : 28,
    justifyContent      : 'center',
    alignItems          : 'center',
    borderRadius        : 14,
  },
  monthNavText: {
    fontSize            : 32,
    color               : COLOR.TEXT_DEFAULT,
    lineHeight          : 32,
  },
  monthNavTextDisabled: {
    color               : COLOR.COMM_GRAY_6,
  },
  weekdayRow: {
    flexDirection       : 'row',
  },
  weekdayCell: {
    width               : '14.2857%',
    height              : 35,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  weekdayText: {
    fontSize            : 14,
    fontFamily          : 'Pretendard-Medium',
    color               : COLOR.TEXT_DEFAULT,
  },
  calendarGrid: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
  },
  dayCell: {
    width               : '14.2857%',
    height              : 50,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  dayButton: {
    width               : 44,
    height              : 44,
    borderRadius        : 22,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  dayButtonSelected: {
    backgroundColor     : COLOR.APP_ACTIVE_5,
  },
  dayText: {
    fontSize            : 16,
    color               : COLOR.TEXT_DEFAULT,
    lineHeight          : 18,
  },
  dayTextDisabled: {
    color               : COLOR.COMM_GRAY_6,
  },
  dayTextSelected: {
    color               : COLOR.COMM_WHITE,
  },
  buttonRow: {
    flexDirection       : "row",
  },
  cancelButton: {
    flex                    : 1,
    height                  : 55,
    borderBottomLeftRadius  : 10,
    justifyContent          : "center",
    alignItems              : "center",
    backgroundColor         : COLOR.COMM_GRAY_6,
  },
  cancelButtonText: {
    fontSize        : 16,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.TEXT_DEFAULT,
    alignSelf       : "center",
  },
  confirmButton: {
    flex                    : 1,
    height                  : 55,
    borderBottomRightRadius : 10,
    justifyContent          : "center",
    alignItems              : "center",
    backgroundColor         : COLOR.APP_MAIN,
  },
  confirmButtonText: {
    fontSize        : 16,
    fontFamily      : 'Pretendard-Medium',
    color           : COLOR.COMM_WHITE,
    alignSelf       : "center",
  },
});

export default CalendarModal;
