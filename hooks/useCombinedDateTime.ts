import { useEffect, useState } from 'react';

type UseCombinedDateTimeParams = {
  onChangeCombined: (value: string) => void;
  initialCombinedValue?: string;
};

/**
 * 모임 날짜 시간 공통 훅
 */
const parseTimeLabelTo24Hour = (timeLabel: string): string | null => {
  const parsedTime = timeLabel.match(/^(오전|오후)\s(\d{1,2}):(\d{2})$/);

  if (!parsedTime) {
    return null;
  }

  const meridiem = parsedTime[1];
  const hour = parsedTime[2].padStart(2, '0');
  const minute = parsedTime[3].padStart(2, '0');

  const hour12 = Number(hour);
  const normalizedHour = Number.isNaN(hour12) ? 0 : hour12 % 12;
  const hour24 = meridiem === '오후' ? normalizedHour + 12 : normalizedHour;

  return `${`${hour24}`.padStart(2, '0')}:${minute}`;
};

const parseCombinedDateTime = (combinedDateTime?: string) => {
  if (!combinedDateTime) {
    return null;
  }

  const parsed = combinedDateTime.match(/^(\d{4}-\d{2}-\d{2})\s(\d{2}):(\d{2})$/);
  if (!parsed) {
    return null;
  }

  const dateValue = parsed[1];
  const hour24 = Number(parsed[2]);
  const minute = parsed[3];
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const timeLabel = `${isPm ? '오후' : '오전'} ${String(hour12).padStart(2, '0')}:${minute}`;

  return {
    dateValue,
    timeLabel,
  };
};

export default function useCombinedDateTime({ onChangeCombined, initialCombinedValue }: UseCombinedDateTimeParams) {
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedTimeLabel, setSelectedTimeLabel] = useState('');

  useEffect(() => {
    const parsed = parseCombinedDateTime(initialCombinedValue);
    if (!parsed) {
      return;
    }

    setSelectedDateValue(parsed.dateValue);
    setSelectedTimeLabel(parsed.timeLabel);
  }, [initialCombinedValue]);

  const updateCombinedDateTime = (dateValue: string, timeLabel: string) => {
    if (!dateValue || !timeLabel) {
      onChangeCombined('');
      return;
    }

    const parsedTime24 = parseTimeLabelTo24Hour(timeLabel);

    if (!parsedTime24) {
      onChangeCombined('');
      return;
    }

    onChangeCombined(`${dateValue} ${parsedTime24}`);
  };

  const handleDateChange = (dateValue: string, _dateLabel: string) => {
    setSelectedDateValue(dateValue);
    updateCombinedDateTime(dateValue, selectedTimeLabel);
  };

  const handleTimeChange = (timeLabel: string) => {
    setSelectedTimeLabel(timeLabel);
    updateCombinedDateTime(selectedDateValue, timeLabel);
  };

  return {
    handleDateChange,
    handleTimeChange,
  };
}
