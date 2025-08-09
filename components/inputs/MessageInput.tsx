import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function MessageInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='chat_msg'
        control={control}
        rules={{
          validate: (data: string) => {
            if (data.length === 0) {
              return '메시지를 입력해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="" 
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

export default MessageInput;