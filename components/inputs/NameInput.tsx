import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface NameInputProps {
  focusField?: string;
}

function NameInput({ focusField = "mem_telno" }: NameInputProps) {
  const { control, setFocus } = useFormContext();
  return (
    <Controller
      name='mem_name'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.length === 0) {
            return '이름을 입력해주세요.';
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="이름" 
          placeholder="이름을 입력하세요."
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='submit'
          onSubmitEditing={() => setFocus(focusField)}
          value={value}
          onChangeText={onChange}
          maxLength={20}
          error={error?.message}
        />
      )}
    />
  )
}

export default NameInput;