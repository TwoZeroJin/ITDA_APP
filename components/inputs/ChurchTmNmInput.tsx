import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function ChurchTmNmInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='mem_church_tm_nm'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.length === 0) {
              return '교회 팀이름을 입력해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="교회팀이름" 
                placeholder="교회팀 이름를 입력하세요."
                inputMode='text'
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='submit'
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default ChurchTmNmInput;