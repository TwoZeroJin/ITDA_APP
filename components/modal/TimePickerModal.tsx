import WheelPickerModal from "@/components/modal/WheelPickerModal";
import React from "react";

type TimePickerModalProps = {
  visible: boolean;
  meridiem: string;
  hour: string;
  minute: string;
  onChangeMeridiem: (value: string) => void;
  onChangeHour: (value: string) => void;
  onChangeMinute: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const MERIDIEM_OPTIONS = ['오전', '오후'];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i);

const MERIDIEM_WHEEL_OPTIONS = MERIDIEM_OPTIONS.map((value) => ({ label: value, value }));
const HOUR_WHEEL_OPTIONS = HOUR_OPTIONS.map((value) => ({ label: `${value}시`, value: `${value}`.padStart(2, '0') }));
const MINUTE_WHEEL_OPTIONS = MINUTE_OPTIONS.map((value) => ({ label: `${value}분`, value: `${value}`.padStart(2, '0') }));

function TimePickerModal({ visible, meridiem, hour, minute, onChangeMeridiem, onChangeHour, onChangeMinute, onClose, onConfirm }: TimePickerModalProps) {
  return (
    <WheelPickerModal
      visible={visible}
      cancelLabel="취소"
      confirmLabel="확인"
      columns={[
        {
          options: MERIDIEM_WHEEL_OPTIONS,
          selectedValue: meridiem,
          onChange: onChangeMeridiem,
        },
        {
          options: HOUR_WHEEL_OPTIONS,
          selectedValue: hour,
          onChange: onChangeHour,
        },
        {
          options: MINUTE_WHEEL_OPTIONS,
          selectedValue: minute,
          onChange: onChangeMinute,
        },
      ]}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default TimePickerModal;
