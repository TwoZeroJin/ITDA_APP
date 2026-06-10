import InputField from "@/components/InputField";
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

function FeedContentInput() {
    const {control} = useFormContext();
  return (
    <Controller
        name='feed_content'
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.trim().length < 10) {
                return '내용을 입력해주세요.(10글자 이상)';
            }
            if (data.length > 1000) {
                return '내용은 1000자 이하로 입력해주세요.';
            }
          }
        }}
        render={({field: {ref, onChange, value}, fieldState: {error}}) => (
            <InputField
                ref={ref}
                label="내용" 
                placeholder="내용을 입력해 주세요.(10글자 이상)"
                inputMode='text'
                autoCapitalize='none'
                returnKeyType='next'
                submitBehavior='newline'
                numberOfLines={10}
                value={value}
                onChangeText={onChange}
                textArea={true}
                maxLength={1000}
                error={error?.message}
            />
        )}
    />
  )
}

export default FeedContentInput;