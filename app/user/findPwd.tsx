import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import IdInput from "@/components/inputs/IdInput";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import NameInput from "@/components/inputs/NameInput";
import CustomDialog from "@/components/modal/CustomDialog";
import { COMM_STYLES } from "@/constants";
import { useFindInfo } from "@/hooks/queries/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

export default function FindPwdScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessForVerify, setIsSuccessForVerify] = useState(false);
  const [isSuccessForUpdate, setIsSuccessForUpdate] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { findPwdMutation, verifyCodeMutation, updatePwdMutation } = useFindInfo();
  // 비밀번호 찾기
  const formValues = useForm({
    defaultValues: {
      mem_name  : "",
      login_id  : "",
      mem_email : "",
    },
  });
  // 인증번호 검증
  const verifyFormValues = useForm({
    defaultValues: {
      verifyCode: "",
    },
  });
  // 비밀번호 변경
  const updateFormValues = useForm({
    defaultValues: {
      mem_id    : "",
      login_pwd : "",
    },
  });

  // 비밀번호 찾기
  const onSubmit = (formValues: any) => {
    findPwdMutation.mutate(formValues, {
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
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="비밀번호 찾기"/>
        {isSuccess ? (
          <View style={COMM_STYLES.findContentContainer}>
            <Text style={COMM_STYLES.findTitle}>등록된 이메일로{"\n"}인증번호가 전송되었습니다.{"\n"}인증번호를 입력해 주세요.</Text>
          </View>
        ) : (
        <View style={COMM_STYLES.findContentContainer}>
          <Text style={COMM_STYLES.findTitle}>등록된 이름, 아이디, 이메일을{"\n"}입력해 주세요.</Text>

          <FormProvider {...formValues}>
            <View style={COMM_STYLES.findInputContainer}>
              <NameInput />
              <IdInput />
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