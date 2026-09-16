import InputField from "@/components/InputField";
import { Controller, useFormContext } from 'react-hook-form';

function ChurchMnmInput() {
    const { control } = useFormContext();
  return (
    <Controller
      name='mem_church_mnm'
      control={control}
      // rules={{
      //   validate: (data: string) => {
      //     if (!data || data.length === 0) {
      //       return '담임목사 이름을 입력해주세요.';
      //     }
      //   }
      // }}
      render={({field: { ref,onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label="담임목사 이름" 
          placeholder="담임목사 이름을 입력하세요."
          inputMode='text'
          autoCapitalize='none'
          returnKeyType='next'
          submitBehavior='submit'
          value={value}
          onChangeText={onChange}
          maxLength={20}
          error={error?.message}
        />
      )}
    />
  )
}

export default ChurchMnmInput;