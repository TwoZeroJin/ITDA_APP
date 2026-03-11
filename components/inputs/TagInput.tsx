import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function TagInput() {
    const {control} = useFormContext();
  return (
    <Controller
        name='tag'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.trim().length === 0) {
                return '태그를 입력해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="태그" 
                placeholder="#태그입력"
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

export default TagInput;