import InputField from "@/components/InputField";
import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput } from "react-native";

function GroupNameInput() {
  const {control, setFocus} = useFormContext();
  const ref = useRef<TextInput>(null);
    
  return (
  <Controller
    name='group_name'
    control={control}
    rules={{
      validate: (data: string) => {
        if (!data || data.length === 0) {
          return '클럽명을 입력해주세요.';
        }
      }
    }}
    render={({field: {onChange, value}, fieldState: {error}}) => (
      <InputField
        label="클럽 명" 
        placeholder="클럽 명을 입력하세요."
        inputMode='text'
        autoCapitalize='none'
        returnKeyType='next'
        submitBehavior='submit'
        onSubmitEditing={() => setFocus("group_desc")}
        value={value}
        ref={ref}
        onChangeText={onChange}
        maxLength={100}
        error={error?.message}
      />
    )}
  />
  )
}

export default GroupNameInput;