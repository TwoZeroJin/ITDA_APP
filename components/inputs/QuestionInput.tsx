import InputField from "@/components/InputField";
import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';

/**
 * 모임 신청 시 멤버들에게 받을 질문 입력 컴포넌트
 */
function QuestionInput({ name = '' }) {
    const { control } = useFormContext<FieldValues>();
  return (
    <Controller
        name={name}
        control={control}
        rules={{
          validate: (data: string) => {
            if (!data || data.trim().length < 10) {
                return '모임 신청 시 멤버들에게 받을 질문을 작성해 주세요.(10글자 이상)';
            }
            if (data.length > 1000) {
                return '모임 신청 시 멤버들에게 받을 질문은 1000자 이하로 입력해주세요.';
            }
          }
        }}
        render={({field: {ref, onChange, value}, fieldState: {error}}) => (
          <InputField
            ref={ref}
            placeholder="모임 신청 시 멤버들에게 받을 질문을 작성해 주세요."
            inputMode='text'
            autoCapitalize='none'
            returnKeyType='next'
            submitBehavior='newline'
            numberOfLines={10}
            value={value}
            onChangeText={onChange}
            textArea={true}
            error={error?.message}
          />
        )}
    />
  )
}

export default QuestionInput;