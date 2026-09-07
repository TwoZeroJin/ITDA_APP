import InputField from "@/components/InputField";
import { Controller, useFormContext } from 'react-hook-form';

interface ReviewContentInputProps {
  titleText?: string;
}

function ReviewContentInput({ titleText = "후기" }: ReviewContentInputProps) {
  const {control} = useFormContext();
  return (
    <Controller
      name='review_content'
      control={control}
      rules={{
        validate: (data: string) => {
          if (!data || data.trim().length < 10) {
            return titleText + ' 내용을 입력해주세요.(10글자 이상)';
          }
          if (data.length > 1000) {
            return titleText + ' 내용은 1000자 이하로 입력해주세요.';
          }
        }
      }}
      render={({field: {ref, onChange, value}, fieldState: {error}}) => (
        <InputField
          ref={ref}
          label={titleText + " 내용"} 
          placeholder={titleText + " 내용을 입력해 주세요.(10글자 이상)"}
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

export default ReviewContentInput;