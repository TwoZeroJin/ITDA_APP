import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';


function ChurchNmInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='mem_church_nm'
        control={control}
        rules={{
          validate: (data: string) => {

            if (!data || data.length === 0) {
                return '교회이름을 입력해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="교회이름" 
                placeholder="교회 이름을 입력하세요."
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

export default ChurchNmInput;