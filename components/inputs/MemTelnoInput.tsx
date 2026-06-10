import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const sanitizeDigits = (data: string) => data.replace(/[^0-9]/g, '').slice(0, 11);

const formatPhoneNumber = (data: string) => {
  const digits = sanitizeDigits(data);

  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length < 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

function MemTelnoInput() {
  const { control, setFocus } = useFormContext();
  return (
    <Controller
      name='mem_telno'
      control={control}
      rules={{
        validate: (data: string) => {
          const digits = sanitizeDigits(data ?? '');

          if (!digits) {
            return '전화번호를 입력해주세요.';
          }

          if (!/^01[016789]\d{7,8}$/.test(digits)) {
            return '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
          }

        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="전화번호"
          placeholder="전화번호를 입력하세요."
          inputMode="tel"
          keyboardType="phone-pad"
          returnKeyType='done'
          value={value ?? ''}
          onChangeText={(text) => onChange(formatPhoneNumber(text))}
          onSubmitEditing={() => setFocus("mem_email")}
          maxLength={20}
          error={error?.message}
        />
      )}
    />
  )
}

export default MemTelnoInput;