import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import BirthInput from "@/components/inputs/BirthInput";
import ChurchSelectBox from "@/components/inputs/ChurchSelectBox";
import ChurchTmNmInput from "@/components/inputs/ChurchTmNmInput";
import GenderInput from "@/components/inputs/GenderInput";
import IdInput from "@/components/inputs/IdInput";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import MemTelnoInput from "@/components/inputs/MemTelnoInput";
import NameInput from "@/components/inputs/NameInput";
import NickNameInput from "@/components/inputs/NickNameInput";
import PasswordConfirmInput from "@/components/inputs/PasswordConfirmInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import ProfileImageInput from "@/components/inputs/ProfileImageInput";
import { COMM_STYLES } from "@/constants";
import { useFindInfo } from "@/hooks/queries/useAuth";
import { SignupInfo } from "@/types";
import { showToast } from "@/utils/commToast";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 회원가입 기본 정보 입력 화면
 */
export default function SignupInfoScreen() {
  const { checkDupMutation } = useFindInfo();

  const signupForm = useForm<SignupInfo>({
      defaultValues: {
          login_type : "D", // 일반 로그인일 경우 D, 추후 소셜 로그인 추가 시 해당 값으로 구분
      }
  })

  // 중복 체크 함수 (아이디, 이메일, 닉네임)
  const checkDuplicateField = async (key: "login_id" | "mem_email" | "mem_nick", value?: string) => {
    const targetValue = (value ?? "").trim();

    const result = await checkDupMutation.mutateAsync({ [key]: targetValue });
    if (result.ret_code != 200) {
      showToast({ text1: result.ret_msg });
      return false;
    }

    return true;
  };

  const onSubmit = async (formValues: SignupInfo) => {
    // 서버를 통한 중복 체크
    if (!await checkDuplicateField("mem_email", formValues.mem_email)) return;
    if (!await checkDuplicateField("login_id", formValues.login_id)) return;
    if (!await checkDuplicateField("mem_nick", formValues.mem_nick)) return;

    const submitValues = {
      ...formValues,
      new_image_name: formValues.new_image_name === 'DEL' ? '' : formValues.new_image_name, // DEL일 경우 빈 문자열로 변경하여 서버에 전달
    };
    router.navigate({
      pathname: '/user/signupInterest',
      params: {
        signupInfo: JSON.stringify(submitValues),
      },
    });
  }

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원 가입"/>
      <KeyboardAwareScrollView
        style={{ marginBottom: 100 }}
        contentContainerStyle={[
          COMM_STYLES.formContainer
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        <FormProvider {...signupForm}>
          <View style={COMM_STYLES.formContainer}>
            <ProfileImageInput/>
            <ChurchSelectBox/>
            <ChurchTmNmInput/>
            <NameInput focusField="mem_email"/>
            {/* <MemTelnoInput/> */}
            <MemEmailInput focusField="login_id"/>
            <GenderInput/>
            <BirthInput/>
            <IdInput focusField="mem_nick"/>
            <NickNameInput/>
            <PasswordInput returnKeyType="next"/>
            <PasswordConfirmInput/>
          </View>
        </FormProvider>
      </KeyboardAwareScrollView>
      <CommBottomButton label="다음" onPress={signupForm.handleSubmit(onSubmit)}/>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    // 🌟 하단에 떠 있는 버튼 영역(약 70~80px) + 안드로이드 키보드 안전 마진을 고정 패딩으로 확보합니다.
    paddingBottom       : 200, 
  },
})