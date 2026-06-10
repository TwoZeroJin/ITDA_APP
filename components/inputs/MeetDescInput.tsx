import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function MeetDescInput() {
  const {control} = useFormContext();
  return (
    <Controller
      name='meet_desc'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.trim().length < 10) {
            return '소개글을 입력해주세요.(10글자 이상)';
          }
          if (data.length > 1000) {
            return '소개글은 1000자 이하로 입력해주세요.';
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="소셜링 소개" 
          placeholder="소개글을 입력해 주세요.(10글자 이상)"
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='newline'
          numberOfLines={10}
          maxLength={1000}
          value={value}
          onChangeText={onChange}
          textArea={true}
          error={error?.message}
        />
      )}
    />
  )
}

export default MeetDescInput;