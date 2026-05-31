import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import IdInput from "@/components/inputs/IdInput";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import NameInput from "@/components/inputs/NameInput";
import PasswordConfirmInput from "@/components/inputs/PasswordConfirmInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import VerifyCodeInput from "@/components/inputs/VerifyCodeInput";
import CustomDialog from "@/components/modal/CustomDialog";
import { COMM_STYLES } from "@/constants";
import { useFindInfo } from "@/hooks/queries/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

export default function FindPwdScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessForVerify, setIsSuccessForVerify] = useState(false);
  const [isSuccessForUpdate, setIsSuccessForUpdate] = useState(false);
  const [memIdForUpdatePwd, setMemIdForUpdatePwd] = useState(0);
  const [memIdForVerify, setMemIdForVerify] = useState(0);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { findPwdMutation, verifyCodeMutation, updatePwdMutation } = useFindInfo();
  const { screen_type, mem_id } = useLocalSearchParams();

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
      mem_id      : 0,
      verify_code : "",
    },
  });
  // 비밀번호 변경
  const updateFormValues = useForm({
    defaultValues: {
      mem_id    : 0,
      login_pwd : "",
    },
  });

  // 로그인 화면에서 인증이 필요한 계정, 비밀번호 변경이 필요한 계정으로 이동 시 해당 mem_id와 화면 타입을 받아서 바로 처리
  useEffect(() => {
    if (mem_id) {
      if (screen_type == 'verify') {
        setIsSuccess(true);
        setMemIdForVerify(Number(mem_id));
      }
      else if (screen_type === 'update') {
        setIsSuccess(true);
        setIsSuccessForVerify(true);
        setMemIdForUpdatePwd(Number(mem_id));
      }
    }
  }, [screen_type, mem_id]);

  // 비밀번호 찾기
  const onSubmit = (formValues: any) => {
    findPwdMutation.mutate(formValues, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ret_msg);
          setIsErrorDialogVisible(true);
        } else {
          setMemIdForVerify(Number(result.data?.mem_id));
          setIsSuccess(true);
        }
      },
    });
  };

  // 인증번호 검증
  const onVerifySubmit = (formValues: any) => {
    verifyCodeMutation.mutate({
      verify_code : formValues.verify_code,
      mem_id      : memIdForVerify,
    }, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ret_msg);
          setIsErrorDialogVisible(true);
        } else {
          setMemIdForUpdatePwd(Number(result.data?.mem_id));
          setIsSuccessForVerify(true);
        }
      },
    });
  };

  // 비밀번호 변경
  const onUpdatePwdSubmit = (formValues: any) => {
    updatePwdMutation.mutate({
      ...formValues,
      mem_id : memIdForUpdatePwd
    }, {
      onSuccess: (result) => {
        if(result.ret_code != 200){
          setErrorMessage(result.ret_msg);
          setIsErrorDialogVisible(true);
        } else {
          setIsSuccessForUpdate(true);
        }
      },
    });
  };

  const bottomButtonLabel = 
    isSuccess 
      ? (isSuccessForVerify 
          ? (isSuccessForUpdate ? "로그인" : "비밀번호 변경") 
        : "인증번호 검증")
      : "비밀번호 찾기";

  const handleSubmit = 
    isSuccess
      ? (isSuccessForVerify
        ? (isSuccessForUpdate ? () => { router.navigate('/user/login') } : updateFormValues.handleSubmit(onUpdatePwdSubmit))
      : verifyFormValues.handleSubmit(onVerifySubmit))
    : formValues.handleSubmit(onSubmit);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={COMM_STYLES.container}>
        <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="비밀번호 찾기"/>
        {isSuccess ? (
          isSuccessForVerify ? (
            isSuccessForUpdate ? (
              // 로그인 화면
              <View style={COMM_STYLES.findContentContainer}>
                <Text style={COMM_STYLES.findTitle}>비밀번호 변경이 완료되었습니다.{"\n"}로그인 화면으로 이동해주세요.</Text>
              </View>
            ) : (
              // 비밀번호 입력 화면
              <View style={COMM_STYLES.findContentContainer}>
                <Text style={COMM_STYLES.findTitle}>새로운 비밀번호를 입력해 주세요.</Text>

                <FormProvider {...updateFormValues}>
                  <View style={COMM_STYLES.findInputContainer}>
                    <PasswordInput returnKeyType="next" />
                    <PasswordConfirmInput />
                  </View>
                </FormProvider>
              </View>
            )
          ) : (
            // 인증번호 검증 화면
            <View style={COMM_STYLES.findContentContainer}>
            <Text style={COMM_STYLES.findTitle}>등록된 이메일로{"\n"}인증번호가 전송되었습니다.{"\n"}인증번호를 입력해 주세요.</Text>

            <FormProvider {...verifyFormValues}>
              <View style={COMM_STYLES.findInputContainer}>
                <VerifyCodeInput/>
              </View>
            </FormProvider>
          </View>
          )
        ) : (
          // 비밀번호 찾기 화면
          <View style={COMM_STYLES.findContentContainer}>
            <Text style={COMM_STYLES.findTitle}>등록된 이름, 아이디, 이메일을{"\n"}입력해 주세요.</Text>

            <FormProvider {...formValues}>
              <View style={COMM_STYLES.findInputContainer}>
                <NameInput focusField="mem_email"/>
                <MemEmailInput focusField="login_id"/>
                <IdInput/>
              </View>
            </FormProvider>
          </View>
        )}

        <CommBottomButton
          label={bottomButtonLabel}
          onPress={handleSubmit}
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