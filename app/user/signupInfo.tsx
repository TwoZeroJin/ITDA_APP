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
import { SignupInfo } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * 회원가입 기본 정보 입력 화면
 */
export default function SignupInfoScreen() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 키보드가 올라오고 내려갈 때 isKeyboardVisible 상태 업데이트
  useEffect(() => {
      const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
      const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

      return () => {
          showSub.remove();
          hideSub.remove();
      };
  }, []);

  const signupForm = useForm<SignupInfo>({
      defaultValues: {
          login_type : "D", // 일반 로그인일 경우 D, 추후 소셜 로그인 추가 시 해당 값으로 구분
      }
  })

  const onSubmit = (formValues: SignupInfo) => {
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={120}
        enableAutomaticScroll={true} 
      >
        <FormProvider {...signupForm}>
          <View style={COMM_STYLES.formContainer}>
            <ProfileImageInput/>
            <ChurchSelectBox/>
            <ChurchTmNmInput/>
            <NameInput/>
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