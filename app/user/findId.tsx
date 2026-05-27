import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import NameInput from "@/components/inputs/NameInput";
import CustomDialog from "@/components/modal/CustomDialog";
import { COMM_STYLES } from "@/constants";
import { useFindInfo } from "@/hooks/queries/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

/**
 * 계정 아이디 찾기 화면
 */
export default function FindIdScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { findIdMutation } = useFindInfo();
  const formValues = useForm({
    defaultValues: {
      mem_name  : "",
      mem_email : "",
    },
  });

  const onSubmit = (formValues: any) => {
    findIdMutation.mutate(formValues, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ret_msg);
          setIsErrorDialogVisible(true);
        } else {
          setIsSuccess(true);
        }
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="계정 찾기"/>
        {isSuccess ? (
          <View style={COMM_STYLES.findContentContainer}>
            <Text style={COMM_STYLES.findTitle}>등록된 이메일로{"\n"}계정 아이디가 전송되었습니다.</Text>
          </View>
        ) : (
        <View style={COMM_STYLES.findContentContainer}>
          <Text style={COMM_STYLES.findTitle}>등록된 이름, 이메일을{"\n"}입력해 주세요.</Text>

          <FormProvider {...formValues}>
            <View style={COMM_STYLES.findInputContainer}>
              <NameInput focusField="mem_email" />
              <MemEmailInput />
            </View>
          </FormProvider>
        </View>
        )}

        <CommBottomButton
          label={isSuccess ? "로그인 하기" : "다음"}
          onPress={isSuccess ? () => router.dismissAll() : formValues.handleSubmit(onSubmit)}
        />

        <CustomDialog
          visible={isErrorDialogVisible}
          content={`${errorMessage}`}
          cancelLabel="닫기"
          onCancel={() => setIsErrorDialogVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}