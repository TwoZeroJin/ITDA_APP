import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function VerifyCodeInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name='verify_code'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.length === 0) {
            return '인증번호를 입력해주세요.';
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="인증번호" 
          placeholder="인증번호를 입력하세요."
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='done'
          submitBehavior='submit'
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  )
}

export default VerifyCodeInput;