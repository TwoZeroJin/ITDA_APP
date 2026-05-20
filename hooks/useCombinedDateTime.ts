import { useState } from 'react';

type UseCombinedDateTimeParams = {
  onChangeCombined: (value: string) => void;
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

export default function useCombinedDateTime({ onChangeCombined }: UseCombinedDateTimeParams) {
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedTimeLabel, setSelectedTimeLabel] = useState('');

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
