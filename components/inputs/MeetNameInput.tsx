import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function MeetNameInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='meet_name'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.trim().length < 5) {
                return '소셜명을 입력해주세요.(5글자 이상)';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="소셜링 제목" 
                placeholder="소셜링 제목을 입력하세요."
                inputMode='text'
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='submit'
                onSubmitEditing={() => setFocus("meet_desc")}
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default MeetNameInput;