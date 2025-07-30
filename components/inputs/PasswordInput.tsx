import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';

interface Props {
  submitBehavior?: TextInputProps['submitBehavior'];
  returnKeyType?: TextInputProps['returnKeyType'];
}
function PasswordInput({submitBehavior = 'blurAndSubmit', returnKeyType = 'default'}: Props) {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='login_pwd'
        control={control}
        rules={{
          validate: (data: string) => {
            if (data.length < 8) {
              return '비밀번호는 8자 이상 입력해주세요.';
            }
          }
        }}
        render={({field: { ref, onChange, value}, fieldState: { error } }) => (
            <InputField
                ref={ref}
                label="비밀번호" 
                placeholder="비밀번호를 입력하세요."
                submitBehavior={submitBehavior}
                textContentType='oneTimeCode'
                secureTextEntry
                returnKeyType={returnKeyType}
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default PasswordInput;