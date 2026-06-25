import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const sanitizeLoginId = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

interface IdInputProps {
  focusField?: string;
}

function IdInput({ focusField = "" }: IdInputProps) {
  const {control, setFocus} = useFormContext();
  return (
    <Controller
      name='login_id'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.length < 3) {
            return 'ID는 3자 이상 입력해주세요.';
          }

          if (!/^[a-zA-Z0-9]+$/.test(data)) {
            return 'ID는 영어/숫자 만 입력할 수 있습니다.';
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="로그인 ID" 
          placeholder="ID를 입력하세요."
          inputMode="email"
          autoCapitalize='none'
          returnKeyType={focusField ? 'next' : 'done'}
          submitBehavior={focusField ? 'submit' : 'blurAndSubmit'}
          onSubmitEditing={() => focusField ? setFocus(focusField) : undefined}
          value={value}
          onChangeText={(text) => onChange(sanitizeLoginId(text))}
          maxLength={20}
          error={error?.message}
        />
      )}
    />
  )
}

export default IdInput;