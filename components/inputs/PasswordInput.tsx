import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';

const removeWhitespace = (value: string) => value.replace(/\s+/g, '');

interface Props {
  submitBehavior? : TextInputProps['submitBehavior'];
  returnKeyType?  : TextInputProps['returnKeyType'];
  isSignUp?       : boolean;
}
function PasswordInput({submitBehavior = 'blurAndSubmit', returnKeyType = 'default' }: Props) {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='login_pwd'
        control={control}
        rules={{
          validate: (data: string) => {
            if (data !== "1111" && (!data || data.length < 8)) {
              return '비밀번호는 8자 이상 입력해주세요.';
            }
          }
        }}
        render={({field: { ref, onChange, value}, fieldState: { error } }) => (
            <InputField
                ref={ref}
                label="비밀번호" 
                placeholder="비밀번호를 입력하세요."
                submitBehavior={returnKeyType === 'next' ? 'submit' : submitBehavior }
                textContentType='oneTimeCode'
                secureTextEntry
                returnKeyType={returnKeyType}
                onSubmitEditing={() => returnKeyType == 'next' ? setFocus("passwordConfirm") : null}
                value={value}
                onChangeText={(text) => onChange(removeWhitespace(text))}
                error={error?.message}
            />
        )}
    />
  )
}

export default PasswordInput;