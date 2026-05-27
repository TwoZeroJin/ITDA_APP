import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface NickNameInputProps {
  extraValidate?: (nickname: string) => true | string;
}

function NickNameInput({ extraValidate }: NickNameInputProps) {
  const {control, setFocus} = useFormContext();
  return (
    <Controller
      name='mem_nick'
      control={control}
      rules={{
        validate: (data?: string) => {
          if (extraValidate) {
            return extraValidate(data ?? '');
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="닉네임" 
          placeholder="닉네임을 입력하세요."
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='submit'
          onSubmitEditing={() => setFocus("login_pwd")}
          value={value}
          onChangeText={onChange}
        />
      )}
    />
  )
}

export default NickNameInput;