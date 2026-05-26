import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const sanitizeLoginId = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

function IdInput() {
  const {control, setFocus} = useFormContext();
  return (
    <Controller
      name='login_id'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.length === 0) {
            return '아이디를 입력해주세요.';
          }

          if (!/^[a-zA-Z0-9]+$/.test(data)) {
            return '아이디는 영어/숫자 만 입력할 수 있습니다.';
          }
        }
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <InputField
          label="아이디" 
          placeholder="아이디를 입력하세요."
          inputMode="email"
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='submit'
          onSubmitEditing={() => setFocus("login_pwd")}
          value={value}
          onChangeText={(text) => onChange(sanitizeLoginId(text))}
          error={error?.message}
        />
      )}
    />
  )
}

export default IdInput;