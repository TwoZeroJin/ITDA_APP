import { formatYmdDateFromParts, getDaysInMonth, parseYmdDate } from "@/utils/commUtil";
import WheelPickerModal, { WheelOption } from "@/components/WheelPickerModal";
import React, { useEffect, useMemo } from "react";

type DatePickerModalProps = {
  visible         : boolean;
  selectedValue?  : string;
  onChangeValue   : (value: string) => void;
  onClose         : () => void;
  onConfirm       : (value: string) => void;
};

/**
 * YYYY-MM-DD 형식의 날짜 선택 모달 컴포넌트
 */
function DatePickerModal({ visible, selectedValue, onChangeValue, onClose, onConfirm, }: DatePickerModalProps) {
  const today = useMemo(() => new Date(), []);
  const maxYear = today.getFullYear();
  const minYear = maxYear - 80;
  const fallbackDate = useMemo(() => {
    const year = maxYear;
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return formatYmdDateFromParts(year, month, day);
  }, [maxYear, today]);

  const parsedDate = useMemo(() => {
    const parsed = parseYmdDate(selectedValue);
    return parsed ?? parseYmdDate(fallbackDate);
  }, [fallbackDate, selectedValue]);

  const selectedYear = parsedDate?.year ?? today.getFullYear();
  const selectedMonth = parsedDate?.month ?? today.getMonth() + 1;
  const selectedDay = parsedDate?.day ?? today.getDate();

  const yearOptions = useMemo<WheelOption[]>(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, index) => {
      const year = minYear + index;
      return { label: `${year}`, value: `${year}` };
    }),
    [maxYear],
  );

  const monthOptions = useMemo<WheelOption[]>(
    () => Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return { label: `${`${month}`.padStart(2, "0")}`, value: `${`${month}`.padStart(2, "0")}` };
    }),
    [],
  );

  const dayOptions = useMemo<WheelOption[]>(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return { label: `${`${day}`.padStart(2, "0")}`, value: `${`${day}`.padStart(2, "0")}` };
    });
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const parsed = parseYmdDate(selectedValue);

    if (!parsed) {
      onChangeValue(fallbackDate);
      return;
    }

    const maxDay = getDaysInMonth(parsed.year, parsed.month);

    if (parsed.day > maxDay) {
      onChangeValue(formatYmdDateFromParts(parsed.year, parsed.month, maxDay));
    }
  }, [fallbackDate, onChangeValue, selectedValue, visible]);

  const updateDate = (nextYear: number, nextMonth: number, nextDay: number) => {
    const normalizedDay = Math.min(nextDay, getDaysInMonth(nextYear, nextMonth));
    onChangeValue(formatYmdDateFromParts(nextYear, nextMonth, normalizedDay));
  };

  return (
    <WheelPickerModal
      visible={visible}
      cancelLabel="취소"
      confirmLabel="선택완료"
      columns={[
        {
          options: yearOptions,
          selectedValue: `${selectedYear}`,
          onChange: (value) => updateDate(Number(value), selectedMonth, selectedDay),
        },
        {
          options: monthOptions,
          selectedValue: `${selectedMonth}`.padStart(2, "0"),
          onChange: (value) => updateDate(selectedYear, Number(value), selectedDay),
        },
        {
          options: dayOptions,
          selectedValue: `${selectedDay}`.padStart(2, "0"),
          onChange: (value) => updateDate(selectedYear, selectedMonth, Number(value)),
        },
      ]}
      onClose={onClose}
      onConfirm={() => onConfirm(formatYmdDateFromParts(selectedYear, selectedMonth, selectedDay))}
    />
  );
}

export default DatePickerModal;
