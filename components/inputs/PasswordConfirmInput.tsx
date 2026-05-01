import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

function PasswordConfirmInput() {
    const {control} = useFormContext();
    const login_pwd = useWatch({control, name: "login_pwd"});
  return (
    <Controller
        name='passwordConfirm'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data !== login_pwd ) {
              return '동일한 비밀번호를 입력해주세요.';
            }
          }
        }}
        render={({field: { ref, onChange, value}, fieldState: { error }}) => (
            <InputField
                ref={ref}
                label="비밀번호 확인" 
                placeholder="비밀번호확인을 입력하세요."
                secureTextEntry
                textContentType='oneTimeCode'
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default PasswordConfirmInput;