import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="아이디" 
                placeholder="아이디를 입력하세요."
                inputMode='text'
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='submit'
                onSubmitEditing={() => setFocus("login_pwd")}
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default IdInput;