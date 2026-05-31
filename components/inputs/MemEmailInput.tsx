import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const sanitizeEmail = (data: string) => data.replace(/\s/g, '');
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

interface MemEmailInputProps {
  focusField?: string;
}

function MemEmailInput({ focusField = "" }: MemEmailInputProps) {
  const { control, setFocus } = useFormContext();
  return (
    <Controller
      name='mem_email'
      control={control}
      rules={{
        validate: (data?: string) => {
          const email = sanitizeEmail(data ?? '');

          if (!email) {
            return '이메일을 입력해주세요.';
          }

          if (!EMAIL_REGEX.test(email)) {
            return '이메일 형식이 올바르지 않습니다. (예: example@example.com)';
          }

        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="이메일"
          placeholder="이메일을 입력하세요."
          inputMode="email"
          keyboardType="email-address"
          autoCapitalize='none'
          returnKeyType={focusField ? 'next' : 'done'}
          value={value ?? ''}
          onChangeText={(text) => onChange(sanitizeEmail(text))}
          onSubmitEditing={() => focusField ? setFocus(focusField) : undefined}
          error={error?.message}
        />
      )}
    />
  )
}

export default MemEmailInput;