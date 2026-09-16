import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function ChurchNmInput() {
    const { control, setFocus } = useFormContext();
  return (
    <Controller
      name='mem_church_nm'
      control={control}
      // rules={{
      //   validate: (data: string) => {
      //     if (!data || data.length === 0) {
      //       return '교회 이름을 입력해주세요.';
      //     }
      //   }
      // }}
      render={({field: { ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="교회 이름" 
          placeholder="교회 이름을 입력하세요."
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='submit'
          onSubmitEditing={() => setFocus("mem_church_mnm")}
          value={value}
          onChangeText={onChange}
          maxLength={20}
          error={error?.message}
        />
      )}
    />
  )
}

export default ChurchNmInput;