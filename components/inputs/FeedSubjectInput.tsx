import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function FeedSubjectInput() {
    const {control, setFocus} = useFormContext();
  return (
    <Controller
        name='feed_subject'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.length === 0) {
              return '제목을 입력해주세요.';
            }
          }
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <InputField
                label="제목" 
                placeholder="제목을 입력하세요."
                inputMode="text"
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='submit'
                onSubmitEditing={() => setFocus("feed_content")}
                value={value}
                onChangeText={onChange}
                error={error?.message}
            />
        )}
    />
  )
}

export default FeedSubjectInput;