import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function NickNameInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='mem_nick'
        control={control}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="닉네임" 
                placeholder="닉네임을 입력하세요."
                inputMode='text'
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='submit'
                // onSubmitEditing={() => setFocus("login_pwd")}
                value={value}
                onChangeText={onChange}
            />
        )}
    />
  )
}

export default NickNameInput;